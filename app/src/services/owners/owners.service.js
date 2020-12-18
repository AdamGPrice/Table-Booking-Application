const express = require('express');
const crypto = require('crypto-js');

const queries = require('./owners.queries');
const auth = require('../../authentication');

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    if (email != undefined && password != undefined) {
        const environment = process.env.NODE_ENV || 'dev';
        let secret = process.env.LOCAL_PASS_SECRET;
        if (environment == 'prod') {
            secret = process.env.PROD_PASS_SECRET
        }
        const hashedPassword = crypto.SHA3(password, secret).toString();
        try {
            const business = await queries.newOwner(email, hashedPassword);
            res.status(201);
            res.json({
                status: res.statusCode,
                message: 'Account created successfully.'
            });
        } catch(error) {
            res.status(409);
            res.json({
                status: res.statusCode,
                message: error.sqlMessage
            });
        }
    } else {
        res.status(401);
        res.json({
            status: res.statusCode,
            message: 'Missing Email or Password Data in request body.'
        });
    }
});

// Don't need this
router.get('/', async (req, res) => {
    res.on('finish', () => console.log('after'));
    console.log('before');
    // include auth here
    const pubs = await queries.getAll();
    res.json(pubs);
});

// Probably Don't need this either
router.get('/:id', auth.authenticateToken, async (req, res, next) => {
    const { id } = req.params;
    const pub = await queries.get(id);
    if (pub == undefined) {
        res.status(404);
        res.json({
            status: res.statusCode,
            message: 'Owner Not Found.'
        });
    } else {
        res.json(pub);
    }
});

module.exports = router;