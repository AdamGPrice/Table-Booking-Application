const express = require('express');
const router = express.Router();
const axios = require('axios');

// Main / User pages
router.get('/', async (req, res) => {
    //const result = await axios.get('http://localhost:3030/api/pubs');
    //console.log(result.data);
    //res.render('index', { pubs: result.data });
    res.render('index', { pubs: [] });
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