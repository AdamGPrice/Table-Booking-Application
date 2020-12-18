const express = require('express');

const queries = require('./tables.queries');
const auth = require('../../authentication');
const router = express.Router();

// Post a new table 
router.post('/', auth.authenticateToken, auth.isOwner, async (req, res) => {
    // Check if the owner making the request has permissions to change table data
    const { pub_id, table_num, seats, is_outside } = req.body;
    const isOwner = await auth.isPubOwner(req, res, pub_id);
    if (!isOwner) {
        res.status(403);
        res.json({
            status: res.statusCode,
            message: 'Account does not permissions to change table data for this pub.'
        });
    } else {
        // Check if that table already exists
        const exists = await queries.getTableByPubIdAndNumber(pub_id, table_num);
        if (exists == undefined) {
            try {
                const table = await queries.newTable(pub_id, table_num, seats, is_outside);
                res.status(201);
                res.json({
                    status: res.statusCode,
                    message: 'Created new table data successfully.'
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
                message: 'A table with that number already exists for this pub.'
            });
        }
    }
});



// Update a table entry 
router.put('/', auth.authenticateToken, auth.isOwner, async (req, res) => {
    // Check if the user making the request has permission to change opening hours
    const { pub_id, table_num, seats, is_outside } = req.body
    const isOwner = await auth.isPubOwner(req, res, pub_id)
    if (!isOwner) {
        res.status(403);
        res.json({
            status: res.statusCode,
            message: 'Account does not permissions to change table data for this pub.'
        });
    } else {
        // Check if the table exists before making changes
        const exists = await queries.getTableByPubIdAndNumber(pub_id, table_num);
        if (exists != undefined) {
            try {
                const table = await queries.updateByPubIdAndNum(pub_id, table_num, seats, is_outside);
                res.status(200);
                res.json({
                    status: res.statusCode,
                    message: 'Table data updated successfully.'
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
                message: 'Cannot update a table that does not exist. Check table number.' 
            });
        }
    }
});

// Delete a table entry 
router.delete('/pub/:id/table/:num', auth.authenticateToken, auth.isOwner, async (req, res) => {
    const { id, num } = req.params;
    // Check if the owner making the request has permissions to change table data
    const isOwner = await auth.isPubOwner(req, res, id)
    if (!isOwner) {
        res.status(403);
        res.json({
            status: res.statusCode,
            message: 'Account does not permissions to change table data for this pub.'
        });
    } else {
        // Check if the day already exists
        const exists = await queries.getTableByPubIdAndNumber(id, num);
        if (exists != undefined) {
            try {
                const result = await queries.deleteTableByPubIdAndNumber(id, num);
                res.status(200);
                res.json({
                    status: res.statusCode,
                    message: 'Table data deleted successfully.'
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
                message: 'Cannot delete a table that does not exist.' 
            });
        }
    }
});

// Get all tables in a pub
router.get('/pub/:id', async (req, res) => {
    const { id } = req.params;
    const tables = await queries.getTablesByPubId(id);
    res.json(tables);
});

// Get all tables in a pub and query if outside/inside
router.get('/pub/:id/is_outside/:bool', async (req, res) => {
    const { id, bool } = req.params;
    const tables = await queries.getTablesByPubIdIsOutside(id, bool);
    res.json(tables);
});


// Get all tables in a pub and query if outside/inside and capacity
router.get('/pub/:id/seats/:seats', async (req, res) => {
    const { id, seats  } = req.params;
    const tables = await queries.getTablesByPubIdAndSeats(id, seats);
    res.json(tables);
});

// Get all tables in a pub and query if outside/inside and capacity
router.get('/pub/:id/location/:loc/seats/:seats', async (req, res) => {
    const { id, loc, seats  } = req.params;
    const tables = await queries.getTablesByPubIdAndQuery(id, loc, seats);
    res.json(tables);
});

// Return the highest capacity table in a pub.
router.get('/pub/:id/capacity', async (req, res) => {
    const { id } = req.params;
    const table = await queries.getHighestCapacityTable(id);
    res.json(table.seats);
});

module.exports = router;