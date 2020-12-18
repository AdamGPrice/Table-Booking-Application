const express = require('express');
const crypto = require('crypto-js');

const queries = require('./users.queries');
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
            const business = await queries.newUser(email, hashedPassword);
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

module.exports = router;