const express = require('express');
const crypto = require('crypto-js');

const db = require('../../mysql');
const auth = require('../../authentication');
const ownersQueires = require('../owners/owners.queries');
const userQueires = require('../users/users.queries');

const router = express.Router();

router.post('/', async (req, res) => {
    const { type, email, password } = req.body 
    // make sure account type is either business or user
    if (type == 'owner') {
        const hashedPassword = crypto.SHA3(password, process.env.PASS_SECRET).toString();
        const account = await ownersQueires.authOwner(email, hashedPassword);
        if (account == undefined) {
           accountNotFound(req, res);
        } else {
            account.type = 'owner';
            // Generate token
            const token = auth.generateAccessToken(account);
            // Give the token to the user
            res.json({
                token,
                id: account.id,
                email: account.email,
                type: 'owner'
            });
        }
    } else if (type == 'user') {
        const hashedPassword = crypto.SHA3(password, process.env.PASS_SECRET).toString();
        const account = await userQueires.authUser(email, hashedPassword);
        if (account == undefined) {
           accountNotFound(req, res);
        } else {
            account.type = 'user';
            // Generate token
            const token = auth.generateAccessToken(account);
            // Give the token to the user
            res.json({
                token,
                id: account.id,
                email: account.email,
                type: 'user'
            });
        }
    } else {
        accountTypeInvalid(req, res);
    }
});

function accountNotFound(req, res) {
    res.status(401);
    res.json({
        status: 401,
        message: 'Account details are incorrect or account does not exist'
    });
}

function accountTypeInvalid(req, res) {
    res.status(400);
    res.json({ 
        status:  res.statusCode,
        message: 'Account type is invalid' 
    });
}

module.exports = router;