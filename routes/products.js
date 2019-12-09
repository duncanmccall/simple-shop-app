const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// GET to /products
router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productId: doc._id,
                        request: {
                            type: 'GET',
                            url: `http://${process.env.HOSTNAME}:${process.env.PORT}/products/${doc._id}`
                        }
                    }
                })
            }
            console.log(response);
            res.status(200).json({ response });
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
                message: `${result.name} successfully created!`,
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: `http://${process.env.HOSTNAME}:${process.env.PORT}/products/${result._id}`
                    }
                }
            });
        }).catch((error) => {
            error.message = 'Failed to create a new product';
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
        .select('-__v')
        .exec()
        .then(product => {
            console.log(product);
            if (product) {
                res.status(200).json({
                    product
                });
            } else {
                res.status(404).json({
                    message: 'Invalid ID: No product exists with this ID',
                    request: {
                        type: 'GET',
                        url: `http://${process.env.HOSTNAME}:${process.env.PORT}/products`
                    }
                });
            }
        })
        .catch(error => {
            error.message = 'Invalid ID: No product exists with this ID';
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
        .select('-__v')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc.nModified === 0) {
                res.status(404).json({
                    message: 'Product failed to update',
                    doc
                });
            } else {
                res.status(200).json({
                    message: 'Product successfully updated',
                    request: {
                        type: 'GET',
                        url: `http://${process.env.HOSTNAME}:${process.env.PORT}/products/${id}`
                    }
                });
            }
        })
        .catch(error => {
            error.message = 'Server Error: Update operation failed'
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
            if (result.deletedCount === 0) {
                console.log(result);
                res.status(404).json({
                    message: 'Failed to delete product that does not exist',
                    result
                });
            } else {
                console.log(result);
                res.status(200).json({
                    message: `Product with ID: ${id} successfully deleted`,
                    result
                });
            }
        })
        .catch(error => {
            error.message = 'Server Error: Delete operation failed';
            console.log(error);
            res.status(500).json({ error });
        });
});

// export router
module.exports = router;