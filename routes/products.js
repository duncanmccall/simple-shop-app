const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// GET to /products
router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({
                message: 'Handling GET requests to /products',
                docs
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
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
            res.status(201).json({
                message: 'Handling POST requests to /products',
                createdProduct: result
            });
        }).catch((error) => {
            console.log(error);
            res.status(500).json({ error });
        });

});

// GET to /products/:productId
router.get('/:productId', (req, res, next) => {
    
    // get product id from params
    const id = req.params.productId;

    // find product by id
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    message: 'Handling GET requests to /products/productId',
                    doc
                });
            } else {
                res.status(404).json({
                    message: 'Invalid ID: No product exists with this ID'
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// PATCH to /products/:productId
router.patch('/:productId', (req, res, next) => {

    // get product id from params
    const id = req.params.productId;
    
    // allow for updating of single values or multiple values
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    
    // update product
    Product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json({
                message: 'Handling PATCH requests to /products/productId',
                doc
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
    
});

// DELETE to /products/:productId
router.delete('/:productId', (req, res, next) => {
    
    // get product id from params
    const id = req.params.productId;

    // delete product by id
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Handling DELETE requests to /products/productId',
                result
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// export router
module.exports = router;