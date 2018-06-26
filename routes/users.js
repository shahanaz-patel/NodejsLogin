const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const mongoose = require('mongoose'); // for below two instructions

//Load User model
require('../models/User');//extra . since we are outside the folder
const User = mongoose.model('user');

router.get('/login',(req,res) => {
    res.render('users/login');
});

//Process form
router.post('/login',(req,res) => {
    let errors = [];
    if(!req.body.email){
        errors.push({text:"Please enter your email"});
    }
    if(!req.body.password){
        errors.push({text:"Invalid Password"});
    }

    if(errors.length > 0){
        res.render('login', {
            errors: errors,
            email: req.body.email,
            password: req.body.password
        })
    } else{
        res.send('Success');
    }
    
   // // console.log(req.body);
   // // res.send('Success');
});

router.get('/sign-up',(req,res) => {
    res.render('users/sign-up');
});

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

module.exports = router;
