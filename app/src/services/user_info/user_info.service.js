const express = require('express');

const queries = require('./user_info.queries');
const auth = require('../../authentication');
const router = express.Router();


router.post('/', auth.authenticateToken, auth.isUser, async (req, res) => {
    // Check if the user already has user info for their account if not create user info
    const user_id = req.account.id;
    const exists = await queries.getByUserId(user_id);
    if (exists == undefined) {
        // Post the new use information
        const { first_name, last_name, phone } = req.body;
        try {
            const user_info = await queries.newUserInfo(user_id, first_name, last_name, phone);
            res.status(201);
            res.json({
                status: res.statusCode,
                message: 'User information created successfully.'
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
            message: 'User infomation already exists for this account try updating instead.'
        });
    }
});

router.put('/', auth.authenticateToken, auth.isUser, async (req, res) => {
    // Check if the user is making changes to their own user info 
    const user_id = req.account.id;
    const exists = await queries.getByUserId(user_id);
    if (exists) {
        const { first_name, last_name, phone } = req.body;
        try {
            const user_info = await queries.editUserInfo(user_id, first_name, last_name, phone);
            res.status(200);
            res.json({
                status: res.statusCode,
                message: 'User information updated successfully.'
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

// should probably delete this endpoint, no need to get all user info at once
router.get('/', async (req, res) => {
    const user_info = await queries.getAll();
    res.json(user_info);
});

// Get user info from user info id
router.get('/:id', async (req, res) => {    
    const { id } = req.params;
    const user_info = await queries.getById(id);
    if (user_info == undefined) {
        res.status(404);
        res.json({
            status: res.statusCode,
            message: 'User info not found.'
        });
    } else {
        res.json(user_info);
    }
});

// Get user info from user id
router.get('/user/:id', auth.authenticateToken, async (req, res) => {
    console.log(req.account);
    const { id } = req.params;
    // Check if the user is requesting their own info or if a pub owner 
    if (req.account.type == 'owner' || req.account.id == id) {
        const user_info = await queries.getByUserId(id);
        if (user_info == undefined) {
            res.status(404);
            res.json({
                status: res.statusCode,
                message: 'User info not found.'
            });
        } else {
            res.json(user_info);
        }
    } else {
        res.status(401);
        res.json({
            status: res.statusCode,
            message: 'Cannot view the user information of other users'
        });
    }
});

module.exports = router;