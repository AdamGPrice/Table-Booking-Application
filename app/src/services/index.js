const express = require('express');

// Endpoints 
const auth = require('./auth/auth.service');
const owners = require('./owners/owners.service');
const users = require('./users/users.service');
const pubs = require('./pubs/pubs.service');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'api v1'
    })
});

router.use('/auth', auth);
router.use('/owners', owners);
router.use('/users', users);
router.use('/pubs', pubs);

module.exports = router;