const express = require('express');

const queries = require('./bookings.queries');
const ohQueries = require('../opening_hours/opening_hours.queries');
const pubQueries = require('../pubs/pubs.queries');
const tableQueries = require('../tables/tables.queries');
const userInfoQueries = require('../user_info/user_info.queries');
const auth = require('../../authentication');
const utils = require('../../libs/utils');

const router = express.Router();

// user creates a booking
router.post('/user', auth.authenticateToken, auth.isUser, async (req, res) => {
    const { table_id, start, end } = req.body;
    const user_id = req.account.id;

    console.log(start, end);
    const { bookingValid, pastmidnight } = await checkBookingIsValid(table_id, start, end);

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
                    message: 'Created a new booking successfully.',
                    bookingInfo: {
                        bookingId: booking[0],
                        table_id,
                        start,
                        end,
                        past_day: pastmidnight
                    }
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
});

router.post('/guest', async (req, res) => {
    const { table_id, start, end, first_name, last_name, phone } = req.body;
    const { bookingValid, pastmidnight } = await checkBookingIsValid(table_id, start, end);
    console.log(table_id, start, end, first_name, last_name, phone);

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
            // Add guest information to the database the the booking
            try {
                const guestId = await queries.newGuest(first_name, last_name, phone);
                const booking = await queries.newBooking(table_id, 1, guestId, undefined, start, end, pastmidnight);
                res.json({
                    status: res.statusCode,
                    message: 'Created a new booking successfully.',
                    bookingInfo: {
                        bookingId: booking[0],
                        table_id,
                        start,
                        end,
                        past_day: pastmidnight
                    }
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
});

async function checkBookingIsValid(table_id, start, end) {
    let bookingValid = false;
    let pastmidnight = 0;

    // Make sure start time > end time 
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate < endDate) {
        // Confirm that the booking is in the open hours for a day
        const opening_hours = await ohQueries.getByTableId(table_id);
        const startDay = utils.getWeekDay(startDate);
        const endDay = utils.getWeekDay(endDate);

        let nighbourOH = [];
        opening_hours.forEach(oh => {
            if (oh.day == startDay) {
                nighbourOH.push(oh);
            } else if (oh.day + 1 == startDay) {
                nighbourOH.push(oh)
            }
        })

        if (nighbourOH.length > 0) {
            for (let i = 0; i < nighbourOH.length; i++) {
                if (nighbourOH[i].open.split(':')[0] > nighbourOH[i].close.split(':')[0]) {
                    pastmidnight = 1;
                }
                let date1 = new Date(startDate.getTime());
                let date2 = new Date(startDate.getTime());
                if (pastmidnight) {
                    date2 = date2.addDays(1);
                }
                
                const open = openingHoursToDateTime(nighbourOH[i].open, date1);
                const close = openingHoursToDateTime(nighbourOH[i].close, date2);

                if (startDate.getTime() >= open.getTime() && endDate.getTime() <= close.getTime()) {
                    if (utils.compareTime('00:00', startDate) >= 0) {
                        pastmidnight = 1;
                    } else {
                        pastmidnight = 0;
                    }   
                    bookingValid = true;
                }
            }
        }
    }

    return { bookingValid, pastmidnight };
}

function openingHoursToDateTime(time, date) {
    const hours = new Date(date.getTime());
    const t = time.split(':');
    hours.setHours(t[0], t[1], t[2]);
    return hours;
};

// Get all bookings for a pub
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

// Get all bookings for a user
router.get('/mybookings', auth.authenticateToken, auth.isUser, async (req, res) => {
    const userId = req.account.id;
    const bookings = await queries.getUserBookings(userId);
    res.json(bookings);
});

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
            console.log(bookings);
            await Promise.all(bookings.map(async (booking, index) => {
                if (booking.is_guest) {
                    const user_info = await queries.getGuestById(booking.guest_id);
                    booking.user_info = user_info;
                } else {
                    const user_info = await userInfoQueries.getByUserId(booking.user_id);
                    booking.user_info = user_info;
                }
            }));
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

router.delete('/:booking_id/user', auth.authenticateToken, auth.isUser, async (req, res) => {
    const user_id = req.account.id;
    const { booking_id } = req.params;
    const isUsersBooking = await queries.isBookingUser(user_id, booking_id);
    
    // Delte the booking if the user making the request owns the booking
    if (isUsersBooking) {
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
            message: 'Account does not permissions to modify bookings of other users.'
        });
    }
});

// Check for available tables. return tables or tables close the the requested params
router.post('/tables/pub/:id', async (req, res) => {
    const { id } = req.params;
    const { start, end, seats, location } = req.body;
    //console.log(start, end, seats, location);

    tables = await checkForAvailableTables(id, start, end, seats, location);

    // return available tables if there are any
    if (tables.length > 0) {
        res.json({
            available: true,
            tables,
            start,
            end,
        });
    } else {
        // Find some appriopriate tables for the user
        const newTimes = await getSimilarTimes(start, end, id);
        const pubTables = await tableQueries.getTablesByPubIdAndSeats(id, seats);

        const tables = [];
        await Promise.all(newTimes.map(async (time, index) => {
            // Add additional data the pubs that got selected
            await Promise.all(pubTables.map(async (table, index) => {
                const result = await queries.getBookingOverlap(table.id, time.start, time.end);
                if (result.length == 0) {
                    tables.push({
                        table,
                        start: time.start,
                        end: time.end 
                    });
                } 
            }));
        }));

        const validTables = []

        await Promise.all(tables.map(async (table, index) => {
            const { bookingValid, pastmidnight } = await checkBookingIsValid(table.table.id, new Date(table.start), new Date(table.end));
            if (bookingValid) {
                validTables.push(table);
            } 
        }));
        
        console.log(validTables);

        res.json({
            available: false,
            tables: validTables,
            start,
            end,
        });
    }

});

async function checkForAvailableTables(pub_id, start, end, seats, location) {
    let pubTables = [];
    if (location == -1) {
        pubTables = await tableQueries.getTablesByPubIdAndSeats(pub_id, seats);
    } else {
        pubTables = await tableQueries.getTablesByPubIdAndQuery(pub_id, location, seats);
    }
    
    const tables = [];
    // Add additional data the pubs that got selected
    await Promise.all(pubTables.map(async (table, index) => {
        const result = await queries.getBookingOverlap(table.id, start, end);
        if (result.length == 0) {
            tables.push(table);
        } 
    }));

    return tables;
}

async function getSimilarTimes(start, end, pub_id) {
    const day = utils.getWeekDay(new Date(start));
    newTimes = [];
    for (let i = -3; i <= 3; i++) {
        if (i != 0) {
            const startNew = utils.DateObjToString(new Date(start).addHours(i));
            const endNew = utils.DateObjToString(new Date(end).addHours(i));

            newTimes.push({ 
                start: startNew,
                end: endNew
            })
        }
    }
    return newTimes;
}

//function checkIsWithn
 
module.exports = router;