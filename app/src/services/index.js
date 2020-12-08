const express = require('express');

// Services (Endpoints)
const auth = require('./auth/auth.service');
const owners = require('./owners/owners.service');
const users = require('./users/users.service');
const user_info = require('./user_info/user_info.service');
const pubs = require('./pubs/pubs.service');
const addresses = require('./addresses/addresses.service');
const opening_hours = require('./opening_hours/opening_hours.service');
const tables = require('./tables/tables.service');
const pictures = require('./pictures/pictures.service');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'api v1'
    })
});

// Routing all the service endpoints to api/'endpoint'
router.use('/auth', auth);
router.use('/owners', owners);
router.use('/users', users);
router.use('/user_info', user_info);
router.use('/pubs', pubs);
router.use('/addresses', addresses);
router.use('/opening_hours', opening_hours);
router.use('/tables', tables);
router.use('/pictures', pictures);

module.exports = router;