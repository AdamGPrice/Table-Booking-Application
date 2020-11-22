const express = require('express');

// Services (Endpoints)
const auth = require('./auth/auth.service');
const owners = require('./owners/owners.service');
const users = require('./users/users.service');
const pubs = require('./pubs/pubs.service');
const addresses = require('./addresses/addresses.service');
const opening_hours = require('./opening_hours/opening_hours.service');
const tables = require('./tables/tables.service');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'api v1'
    })
});

// Add this services to api/
router.use('/auth', auth);
router.use('/owners', owners);
router.use('/users', users);
router.use('/pubs', pubs);
router.use('/addresses', addresses);
router.use('/opening_hours', opening_hours);
router.use('/tables', tables);

module.exports = router;