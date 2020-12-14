const express = require('express');

const queries = require('./bookings.queries');
const auth = require('../../authentication');
const ohQueries = require('../opening_hours/opening_hours.queries');
const pubQueries = require('../pubs/pubs.queries');
const utils = require('../../libs/utils');

const router = express.Router();

// user creates a booking
router.post('/user', auth.authenticateToken, auth.isUser, async (req, res) => {
    const { table_id, start, end } = req.body;
    const user_id = req.account.id;

    // Make sure start time > end time 
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate > endDate) {
        res.status(403);
        res.json({
            status: res.statusCode,
            message: 'End time must be before start time'
        });
    } else {
        // Confirm that the booking is in the open hours for a day
        const opening_hours = await ohQueries.getByTableId(table_id);
        const startDay = utils.getWeekDay(startDate);
        const endDay = utils.getWeekDay(startDate);

        const days = {};
        opening_hours.forEach((oh) => {
            if (oh.day + 1 == startDay) {
                days.before = oh
            }
            if (oh.day == startDay) {
                days.current = oh;
            }
        });

        let bookingValid = false;
        let pastmidnight = 0;
        // definitely some duplicated logic here but it works as intended at least.....
        if (days.current && days.before) {
            if (utils.compareTime(days.current.open, start) <= 0 && utils.compareTime(days.before.close, end) <= 0) {
                bookingValid = true;
                pastmidnight = 1;
            } else if (utils.compareTime(days.current.open, start) >= 0) {
                const closeDate = new Date('2001-01-01 ' + days.current.close);
                if (utils.compareTime(days.current.close, end) <= 0) {
                    bookingValid = true;
                } else if (utils.compareTime(days.current.open, closeDate) <= 0 && utils.compareTime(days.current.close, end) >= 0) {
                    bookingValid = true;
                }
            }
        } else if (days.current) { // Booking should be for the current day
            if (utils.compareTime(days.current.open, start) >= 0) {
                const closeDate = new Date('2001-01-01 ' + days.current.close);
                if (utils.compareTime(days.current.close, end) <= 0) {
                    bookingValid = true;
                } else if (utils.compareTime(days.current.open, closeDate) <= 0 && utils.compareTime(days.current.close, end) >= 0) {
                    bookingValid = true;
                }
            }
        } else if (days.before) { // Booking without current day
            if (utils.compareTime(days.before.close, end) <= 0) {
                bookingValid = true;
                pastmidnight = 1;
            }
        }

        if (bookingValid) {
            // Check if there is any booking overlap
            const currentBookings = await queries.getBookingOverlap(table_id, start, end);
            if (currentBookings.length > 0) {
                res.status(409);
                res.json({
                    status: res.statusCode,
                    message: 'Booking overlap for table.'
                });
            } else {
                // If there is no overlap insert new booking into the database
                try {
                    const booking = await queries.newBooking(table_id, 0, undefined, user_id, start, end, pastmidnight);
                    res.status(201);
                    res.json({
                        status: res.statusCode,
                        message: 'Created a new booking successfully.'
                    });
                } catch (error) {
                    res.status(500);
                    res.json({
                        status: res.statusCode,
                        message: error.sqlMessage
                    });
                }
            }
        } else {
            // Booking date/time is not valid
            res.status(403);
            res.json({
                status: res.statusCode,
                message: 'Booking date and time does not fit inside the pubs opening hours.'
            });
        }
    }
});

// Get all booking for a pub
router.get('/', auth.authenticateToken, auth.isOwner, async (req, res) => {
    // get owners pub id
    const pub = await pubQueries.getByOwnerId(req.account.id);
    if (pub == undefined) {
        res.status(404);
        res.json({
            status: res.statusCode,
            message: 'Account does not have pub assinged yet.'
        });
    } else {
        const bookings = await queries.getAllPubBookings(pub.id);
        res.json(bookings);
    }
});

// Get all booking for a user account
// date format 2020-12-14 yyyy-mm-dd
router.get('/date/:date', auth.authenticateToken, auth.isOwner, async (req, res) => {
    const { date } = req.params;
    // get owners pub id
    const pub = await pubQueries.getByOwnerId(req.account.id);
    if (pub == undefined) {
        res.status(404);
        res.json({
            status: res.statusCode,
            message: 'Account does not have pub assinged yet.'
        });
    } else {
        const day = utils.getWeekDay(new Date(date));
        const opening_hours = await ohQueries.getByPubIdAndDay(pub.id, day);
        if (opening_hours == undefined) {
            res.status(404);
            res.json({
                status: res.statusCode,
                message: 'Pub is closed on this date.'
            });
        } else {
            const start = new Date(date);
            const end = start.addDays(1);
            const st = opening_hours.open.split(':');
            const et = opening_hours.close.split(':');
            start.setHours(st[0], st[1], st[2]);
            end.setHours(et[0], et[1], et[2]);
            
            const bookings = await queries.getPubBookingsByDate(pub.id, start, end);
            res.json(bookings);
        }
    }
});

router.delete('/:booking_id/owner', auth.authenticateToken, auth.isOwner, async (req, res) => {
    // get owners pub id
    const pub = await pubQueries.getByOwnerId(req.account.id);
    const { booking_id } = req.params;
    if (pub == undefined) {
        res.status(404);
        res.json({
            status: res.statusCode,
            message: 'Account does not have pub assinged yet.'
        });
    } else {
        // Check if the booking exists or cannot be deleted by wrong owner
        const booking = await queries.isBookingOwner(pub.id, booking_id);
        console.log(booking);
        if (booking != undefined) {
            try {
                const deleted = await queries.deleteBooking(booking_id)
                res.status(200);
                res.json({
                    status: res.statusCode,
                    message: 'Booking deleted successfully.'
                });
            } catch(error) {
                res.status(500);
                res.json({
                    status: res.statusCode,
                    message: 'Could not delete booking by its id at this time.',
                    Sqlmessage: error.sqlMessage
                });
            }
        } else {
            res.status(403);
            res.json({
                status: res.statusCode,
                message: 'Error: Booking does not exists or owner is atempting to delete another pubs booking.' 
            });
        }
    }
});

module.exports = router;