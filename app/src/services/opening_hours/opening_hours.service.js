const express = require('express');

const queries = require('./opening_hours.queries');
const auth = require('../../authentication');
const router = express.Router();


router.post('/', auth.authenticateToken, auth.isOwner, async (req, res) => {
    // Check if the user making the request has persmissions to change pub opening_hours
    const { pub_id, day, open, close } = req.body
    const isOwner = await auth.isPubOwner(req, res, pub_id)
    if (!isOwner) {
        res.status(403);
        res.json({
            status: res.statusCode,
            message: 'Account does not permissions to change opening_hours for this pub'
        });
    } else {
        // Check if that day already has opeing times 
        const exists = await queries.getByPubIdAndDay(pub_id, day);
        if (exists == undefined) {
            const fixedOpen = roundTime(open);
            const fixedClose = roundTime(close);
            try {
                const opening_hours = await queries.newOpeningHour(pub_id, day, fixedOpen, fixedClose);
                res.status(201);
                res.json({
                    status: res.statusCode,
                    message: 'Created new opening times successfully.'
                });
            } catch(error) {
                res.status(500);
                res.json({
                    status: res.statusCode,
                    message: error.sqlMessage
                });
            }
        } else {
            res.status(409);
            res.json({
                status: res.statusCode,
                message: 'Opening Hours for that day are already created.' 
            });
        }
    }
});

// Update opening hours
router.put('/', auth.authenticateToken, auth.isOwner, async (req, res) => {
    // Check if the user making the request has permission to change opening hours
    const { pub_id, day, open, close } = req.body
    const isOwner = await auth.isPubOwner(req, res, pub_id)
    if (!isOwner) {
        res.status(403);
        res.json({
            status: res.statusCode,
            message: 'Owner does not have the permission to change opening hours for this pub'
        });
    } else {
        // Check if the opening_hours for that day exists before making changes
        const exists = await queries.getByPubIdAndDay(pub_id, day);
        if (exists != undefined) {
            const fixedOpen = roundTime(open);
            const fixedClose = roundTime(close);
            try {
                const opening_hours = await queries.updateByPubIdAndDay(pub_id, day, fixedOpen, fixedClose);
                res.status(200);
                res.json({
                    status: res.statusCode,
                    message: 'Opening hours updated successfully.'
                });
            } catch(error) {
                res.status(500);
                res.json({
                    status: res.statusCode,
                    message: error.sqlMessage
                });
            }
        } else {
            res.status(409);
            res.json({
                status: res.statusCode,
                message: 'Opening hours for this day does not exist and must be created fist' 
            });
        }
    }
});


// Update opening hours
router.delete('/pub/:id/day/:day', auth.authenticateToken, auth.isOwner, async (req, res) => {
    const { id, day } = req.params;
    console.log(id, day);
    // Check if the user making the request has permission to change opening hours
    const isOwner = await auth.isPubOwner(req, res, id)
    if (!isOwner) {
        res.status(403);
        res.json({
            status: res.statusCode,
            message: 'Owner does not have the permission to change opening hours for this pub'
        });
    } else {
        // Check if the day exists before tying to delete
        const exists = await queries.getByPubIdAndDay(id, day);
        if (exists != undefined) {
            try {
                const result = await queries.deleteByPubIdAndDay(id, day);
                res.status(200);
                res.json({
                    status: res.statusCode,
                    message: 'Opening hours deleted successfully.'
                });
            } catch(error) {
                res.status(500);
                res.json({
                    status: res.statusCode,
                    message: error.sqlMessage
                });
            }
        } else {
            res.status(409);
            res.json({
                status: res.statusCode,
                message: 'Opening hours for this day does not exist and must be created fist before deleting' 
            });
        }
    }
});

// Get Requests
router.get('/', async (req, res) => {
    const opening_hours = await queries.getAll();
    res.json(opening_hours);
});

router.get('/pub/:id', async (req, res) => {
    const { id } = req.params;
    const opening_hours = await queries.getByPubId(id);
    res.json(opening_hours);
});

router.get('/pub/:id/day/:day', async (req, res) => {
    const { id, day} = req.params;
    const opening_hours = await queries.getByPubIdAndDay(id, day);
    if (opening_hours == undefined) {
        res.status(404);
        res.json({
            status: res.statusCode,
            message: 'Day not found for pub.'
        });
    } else {
        res.json(opening_hours);
    }
});


function roundTime(time) {
    const split = time.split(':');

    if (split[1] >= 45) {
        split[1] = 0;
        if (split[0] == 23) {
            split[0] = 0;
        } else {
            split[0]++;
        }
    } else if (split[1] > 15) {
        split[1] = 30;
    } else {
        split[1] = 0;
    }

    return split[0] + ':' + split[1];
}


module.exports = router;