const express = require('express');
const app = express();
const morgan = require('morgan');

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

app.use(morgan('dev'));

app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

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