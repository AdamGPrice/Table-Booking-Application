const express = require('express');

const queries = require('./pubs.queries');
const auth = require('../../authentication');
const router = express.Router();

router.post('/', auth.authenticateToken, auth.isOwner, async (req, res) => {
    // Check if a pub is already assciated with owner account
    const owner_id  = req.account.id;
    const exists = await queries.getByOwnerId(owner_id);
    if (exists == undefined) {
        // Create a new pub
        const { name, description, email, phone } = req.body;
        try {
            const pub = await queries.newPub(owner_id, name, description, email, phone);
            res.status(201);
            res.json({
                status: res.statusCode,
                message: 'Pub created successfully.'
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
            message: 'A pub is already registered with this account.'
        });
    }
});

// Edit pub details
router.put('/:id', auth.authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, description, email, phone } = req.body;
    const doesOwnPub = await auth.isPubOwner(req, res, id);
    if (doesOwnPub) {
        try {
            const pub = await queries.editPub(id, name, description, email, phone);
            res.status(200);
            res.json({
                status: res.statusCode,
                message: 'Pub information updated successfully.'
            });
        } catch(error) {
            res.status(500);
            res.json({
                status: res.statusCode,
                message: error.sqlMessage
            });
        }
    } else {
        res.status(401);
        res.json({
            status: res.statusCode,
            message: 'Not the owner pub trying to edit or pub does not exist.'
        })
    }
});

// Get all pubs
router.get('/', async (req, res) => {       
    const pubs = await queries.getAll();
    res.json(pubs);
});

// Get one pub by its id
router.get('/:id', async (req, res) => {    
    const { id } = req.params;
    const pub = await queries.getById(id);
    if (pub == undefined) {
        res.status(404);
        res.json({
            status: res.statusCode,
            message: 'Pub Not Found.'
        });
    } else {
        res.json(pub);
    }
});

// Get pub by owner id
router.get('/byowner/:id', async (req, res) => {
    const { id } = req.params;
    const pub = await queries.getByOwnerId(id);
    if (pub == undefined) {
        res.status(404);
        res.json({
            status: res.statusCode,
            message: 'Pub Not Found.'
        });
    } else {
        res.json(pub);
    }
});

// Filter pubs by name
router.get('/filter/name/:name', async (req, res) => {
    const { name } = req.params;
    const pubs = await queries.FilterByName(name);
    if (pubs.length == 0 || pubs == undefined) {
        res.status(404);
        res.json({
            status: res.statusCode,
            message: `No pubs are bars are found with search param '${name}'`
        })
    } else {
        res.json(pubs);
    }
});

// Filter pubs by address????? no idea

module.exports = router;