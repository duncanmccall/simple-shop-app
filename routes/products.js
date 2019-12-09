const express = require('express');
const router = express.Router();

// GET to /products
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    });
});

// POST to /products
router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(201).json({
        message: 'Handling POST requests to /products',
        createdProduct: productpr
    });
});

// GET to /products/:productId
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message: 'Handling GET requests to /products/productId',
        id: id
    });
});

// PATCH to /products/:productId
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message: 'Handling PATCH requests to /products/productId',
        id: id
    });
});

// DELETE to /products/:productId
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message: 'Handling DELETE requests to /products/productId',
        id: id
    });
});

// export router
module.exports = router;