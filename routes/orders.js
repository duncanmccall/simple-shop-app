const express = require('express');
const router = express.Router();

// GET to /orders
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /orders'
    });
});

// POST to /orders
router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'Handling POST requests to /orders',
        order: order
    });
});

// GET to /orders/:orderId
router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: 'Handling GET requests to /orders/orderId',
        id: id
    });
});

// DELETE to /orders/:orderId
router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: 'Handling DELETE requests to /orders/orderId',
        id: id
    });
});

// export router
module.exports = router;