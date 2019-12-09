const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// GET to /products
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    });
});

// POST to /products
router.post('/', (req, res, next) => {

    // create a new product
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    // save product to database
    product.save()
        .then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
        });

    // send response to client
    res.status(201).json({
        message: 'Handling POST requests to /products',
        createdProduct: product
    });

});

// GET to /products/:productId
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json({
                message: 'Handling GET requests to /products/productId',
                doc
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
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