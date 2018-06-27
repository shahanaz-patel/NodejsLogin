const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const mongoose = require('mongoose'); // for below two instructions

//Load User model
require('../models/User');//extra . since we are outside the folder
const User = mongoose.model('user');

//Route login form
router.get('/login',(req,res) => {
    res.render('users/login');
});

//Login form post
router.post('/login',(req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/profile',
        failureRedirect: '/users/login',
        failureFlash : true,
        session:false
    })(req, res, next);
});

//Route register form
router.get('/sign-up',(req,res) => {
    res.render('users/sign-up');
});

//Registration Form post
router.post('/sign-up',(req,res) => {
    let errors = [];

    if(req.body.password != req.body.cpassword){
        errors.push({text:'Passwords do not match'});
    }

    if(req.body.password.length < 5)
    {
        errors.push({text:'Password must be at least 5 characters'});
    }

    if(errors.length > 0){
        res.render('users/sign-up', {
            errors: errors,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            place: req.body.place,
            email: req.body.email,
            password: req.body.password,
            cpassword: req.body.cpassword
        });
    } else{
        const newUser = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            place: req.body.place,
            email: req.body.email,
            password: req.body.password,
            cpassword: req.body.cpassword
        }
        bcrypt.genSalt(9,(err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err)
                    throw err;
                newUser.password = hash;
                new User(newUser)
                .save()
                    .then(user => {
                        req.flash('success_msg', 'You are registered now and can log in...');
                        res.redirect('/users/login');
                    })
                    .catch(err => {
                        console.log(err);
                        return;
                    });
                 
            });
        });
    }
});

//Route profile page
router.get('/profile',(req,res) => {
    req.flash('success_msg', 'You are Logged in...')
    res.render('users/profile',{success_msg : req.flash('success_msg') });
});

module.exports = router;
