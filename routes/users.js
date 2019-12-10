const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST to users/signup
router.post('/signup', (req, res, next) => {
    
    // check if user exists
    User
        .find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length >= 1) {
                return res.status(409).json({
                    message: 'Failed to save: Email already exists'
                });
            } else {
                // create a new user    
                bcrypt.hash(req.body.password, 10, (error, hash) => {
                    if (error) {
                        return res.status(500).json({ 
                            message: 'Failed to save new user',
                            error
                        });

                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User was successfully created'
                                });
                            })
                            .catch(error => {
                                console.log(error);
                                res.status(500).json({
                                    error
                                });
                            });
                    }
                });
            }
        });
});

// POST to /login
router.post('/login', (req, res, next) => {
    User
        .find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                console.log(user);
                return res.status(401).json({
                    message: 'Authorization failed'
                });
            }

            bcrypt.compare(req.body.password, user[0].password, (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(401).json({
                        message: 'Authorization failed'
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id,
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: '1h'
                        }
                    );
                    console.log(result);
                    return res.status(200).json({
                        message: 'Authorization successful',
                        token: token
                    });
                }
                console.log(error);
                res.status(401).json({
                    message: 'Authorization failed'
                });
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error
            });

        });
});

// DELETE to /userId
router.delete('/:uderId', (req, res, next) => {

    User
        .remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'User was successfully deleted'
            });
        })
        .catch(error => {
            console.log(error);
            res.status.json({
                message: 'Error: User could not be deleted',
                error
            });
        });
    
});

// export router
module.exports = router;