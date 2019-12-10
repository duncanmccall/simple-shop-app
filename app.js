const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/users');

// log requests to terminal
app.use(morgan('dev'));

// make uploads public
app.use('/uploads', express.static('uploads'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// handling cors issues
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        req.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

/*
    Database
*/

// establish connection to db, check for connection errors
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Successfully connected to the database...");
    })
    .catch(error => {
        console.log(`Could not connect to the database. Error: ${error}...`);
    });

// error handling for disruptions to d connection after initial connection has been made
mongoose.connection
    .once('open', () => {
        console.log("Connection to the database re-established...")
    })
    .on('error', error => {
        console.log(`There is a problem connecting to the database. Error: ${error}...`);
    });

/*
    Routing
*/

app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/users', usersRouter);

/*
    Error handling
*/

// handle all undefined routes and return a 404
app.use((req, res, next) => {
    const error = new Error('404 Error: Resource not found');
    error.status = 404;
    next(error);
});

// handle all errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;