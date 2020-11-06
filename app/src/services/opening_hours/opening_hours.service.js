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
        // Check if that day allready has opeing times 
        const exists = await queries.getByPubIdAndDay(pub_id, day);
        if (exists == undefined) {
            try {
                const opening_hours = await queries.newOpeningHour(pub_id, day, open, close);
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

router.get('/', async (req, res) => {
    const opening_hours = await queries.getAll();
    res.json(opening_hours);
});

module.exports = router;