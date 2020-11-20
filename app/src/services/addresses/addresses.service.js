const express = require('express');

const queries = require('./addresses.queries');
const auth = require('../../authentication');
const router = express.Router();

// Create a new address entry 
router.post('/', auth.authenticateToken, auth.isOwner, async (req, res) => {
    // Check if the user making the request has permission to change pub address
    const { pub_id, line_1, line_2, town, country, postcode } = req.body
    const isOwner = await auth.isPubOwner(req, res, pub_id)
    if (!isOwner) {
        res.status(403);
        res.json({
            status: res.statusCode,
            message: 'Account does not permission to change address for this pub'
        });
    } else {
        // Add the address to the database
        const exists = await queries.getByPubId(pub_id);
        if (exists == undefined) {
            try {
                const address = await queries.newAddress(pub_id, line_1, line_2, town, country, postcode);
                res.status(201);
                res.json({
                    status: res.statusCode,
                    message: 'Address information created successfully.'
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
                message: 'An Address is already in use for this pub.' 
            });
        }
    }
});

// Update an address
router.put('/', auth.authenticateToken, auth.isOwner, async (req, res) => {
    // Check if the user making the request has permission to change pub address
    const { pub_id, line_1, line_2, town, country, postcode } = req.body
    const isOwner = await auth.isPubOwner(req, res, pub_id)
    if (!isOwner) {
        res.status(403);
        res.json({
            status: res.statusCode,
            message: 'Owner does not permission to change address for this pub'
        });
    } else {
        // Add the address to the database
        const exists = await queries.getByPubId(pub_id);
        if (exists != undefined) {
            try {
                const address = await queries.editAddress(pub_id, line_1, line_2, town, country, postcode);
                res.status(200);
                res.json({
                    status: res.statusCode,
                    message: 'Address information updated successfully.'
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
                message: 'An Address does not exist and must be created first.' 
            });
        }
    }
});

// Get all addresses
router.get('/', async (req, res) => {
    const addresses = await queries.getAll();
    res.json(addresses);
});

// Get an address by pub id
router.get('/pub/:id', async (req, res) => {
    const { id } = req.params;
    const pub = await queries.getByPubId(id);
    if (pub == undefined) {
        res.status(404);
        res.json({
            status: res.statusCode,
            message: 'Address not found for pub.'
        });
    } else {
        res.json(pub);
    }
});

module.exports = router;