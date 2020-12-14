const express = require('express');
const router = express.Router();
const axios = require('axios');

const utils = require('../src/libs/utils');

// Main / User pages
router.get('/', async (req, res) => {
    //const result = await axios.get('http://localhost:8080/api/pubs');
    //console.log(result.data);
    //res.render('index', { pubs: result.data });
    res.render('index', { pubs: [] });
});

router.get('/search', async (req, res) => {
    const queries = req.query;
    let pubs = []
    let search = {};

    // Render the pubs based on the search queries
    if (Object.keys(queries).length == 0) {
        const result = await axios.get('http://localhost:8080/api/pubs');
        pubs = result.data;
    } else {
        if (queries.q && queries.d) {
            search.q = queries.q;
            search.d = queries.d;
            try {
                const result = await axios.get(`http://localhost:8080/api/pubs/filter/name/${queries.q}/day/${queries.d}`);
                pubs = result.data;
            } catch {
                pubs = []
            }
        } else if (queries.q) {
            search.q = queries.q;
            try {
                const result = await axios.get(`http://localhost:8080/api/pubs/filter/name/${queries.q}`);
                pubs = result.data;
            } catch {
                pubs = []
            }   
        } else if (queries.d) {
            search.d = queries.d;
            try {
                const result = await axios.get(`http://localhost:8080/api/pubs/filter/day/${queries.d}`);
                pubs = result.data;
            } catch {
                pubs = []
            }
        }
    }

    const day = utils.getWeekDay(new Date());
    // Add additional data the pubs that got selected
    await Promise.all(pubs.map(async (pub, index) => {
        try {
            const opening_times = await axios.get(`http://localhost:8080/api/opening_hours/pub/${pub.id}/day/${day}`);
            pubs[index].opening_times = opening_times.data;
        } catch (error) {
            pubs[index].opening_times = { open: 'N/A', close: 'N/A' };
        }
    }));
    res.render('search', { pubs, search });
});

router.get('/signup', async (req, res) => {
    res.render('signup');
});

router.get('/login', async (req, res) => {
    res.render('login');
});

router.get('/user_info', async (req, res) => {
    res.render('user_info');
});

router.get('/account', async (req, res) => {
    res.render('account');
});

// Business/pages
router.get('/business/signup', async (req, res) => {
    res.render('business/signup');
});

router.get('/business/login', async (req, res) => {
    res.render('business/login');
});

router.get('/business/register', async (req, res) => {
    res.render('business/register');
});

router.get('/business/address', async (req, res) => {
    res.render('business/address');
});

router.get('/business/dashboard', async (req, res) => {
    res.render('business/dashboard');
});

router.get('/business/dashboard/details', async (req, res) => {
    res.render('business/details');
});

router.get('/business/dashboard/opening-times', async (req, res) => {
    res.render('business/opening-times');
});

router.get('/business/dashboard/tables', async (req, res) => {
    res.render('business/tables');
});

router.get('/business/dashboard/pictures', async (req, res) => {
    res.render('business/pictures');
});

module.exports = router;