const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const services = require('./services/index')

// npm middlewares
app.use(morgan('tiny'));
app.use(compression());
app.use(helmet());
app.use(express.json());

app.use(express.static('public'));

app.use('/api', services);


// Very last outcome if nothing else is found for specified url
app.use((req, res) => {
    res.status(404);
    res.json({
        status: res.statusCode,
        message: `Not found - ${req.originalUrl}`
    });
});

module.exports = app;