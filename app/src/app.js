const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');

require('dotenv').config();

const app = express();
const services = require('./services/index')


// npm middlewares
app.use(morgan('tiny'));
app.use(compression());
app.use(helmet());
app.use(express.json());

// All api requests will be routed to services
app.use('/api', services);

// Config the static files
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/vendor', express.static(path.join(__dirname, '../public/vendor')));

// Templating Engine for frontend
app.set('views', path.join(__dirname, '../public/views'));
app.set('view engine', 'ejs');

const publicRoutes = require('../public/routes');
app.use('/', publicRoutes);

/// ##################
app.use('/uploads/:id', (req, res) => {
    res.sendFile(path.join(__dirname, `../uploads/${req.params.id}`));
});
/// #################

// Very last outcome if nothing else is found for specified url
app.use((req, res) => {
    res.status(404);
    res.json({
        status: res.statusCode,
        message: `Not found - ${req.originalUrl}`
    });
});

module.exports = app;