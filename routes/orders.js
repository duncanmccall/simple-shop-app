const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/Order');
const Product = require('../models/Product');

const checkAuth = require('../utilities/check-auth');

// GET to /orders
router.get('/', checkAuth, (req, res, next) => {
    Order.find()
        .select('-__v')
        .populate('product', '_id name price')
        .exec()
        .then(orders => {
            const response = {
                count: orders.length,
                orders: orders.map(order => {
                    return {
                        orderId: order._id,
                        createdAt: order.createdAt,
                        updatedAt: order.updatedAt,
                        product: order.product,
                        quantity: order.quantity,
                        request: {
                            type: 'GET',
                            url: `http://${process.env.HOSTNAME}:${process.env.PORT}/orders/${order._id}`
                        }
                    }
                })
            }
            console.log(response);
            res.status(200).json({ response })
        })
        .catch(error => {
            error.message = 'Server Error: Try again';
            console.log(error)
        });
});

// POST to /orders
router.post('/', checkAuth, (req, res, next) => {
    
    // get productId from request params
    const productId = req.body.productId;

    // check if products exist and create order
    Product
        .findById(productId)
        .exec()
        .then(product => {

            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            // create a new order
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            
            // save order to database
            return order.save()
        })
        .then(order => {
            console.log(order);
            res.status(201).json({
                message: 'Order successfully created!',
                order
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error: Order creation operation failed',
                error
            })
        });
});

// GET to /orders/:orderId
router.get('/:orderId', checkAuth, (req, res, next) => {
    
    // get order id from request params
    const id = req.params.orderId;

    Order
        .findById(id)
        .select('-__v')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Invalid order ID: This ID does not exist'
                });
            }
            console.log(order);
            res.status(200).json({
                _id: order._id,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                product: order.product,
                quantity: 10,
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error
            });
        });
});

// DELETE to /orders/:orderId
router.delete('/:orderId', checkAuth, (req, res, next) => {
    
    // get order id from request params
    const id = req.params.orderId;

    Order
        .remove({ _id: id })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({ 
                message: 'Order deleted successfully!',
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