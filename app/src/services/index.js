const express = require('express');

// Endpoints 
const auth = require('./auth/auth.service');
const businesses = require('./businesses/businesses.service');
const users = require('./users/users.service');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'api v1'
    })
});

router.use('/auth', auth);
router.use('/businesses', businesses);
router.use('/users', users);

module.exports = router;