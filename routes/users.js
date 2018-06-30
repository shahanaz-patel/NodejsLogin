const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
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
       // session:false
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
                    //throw err;
                    {
                        if(err.code===11000){
                            req.flash('error_msg', 'Already exist');
                            res.render('users/sign-up',{error_msg:'Already Exists'});
                        }
                    }
                newUser.password = hash;
                new User(newUser)
                .save()
                    .then(user => {
                        res.writeHead(302, {'Location': 'http://127.0.0.1:3000/send?emailid='+req.body.email+'&id='+user._id});
                        res.end();
                        console.log('writeheadlink');
                        req.flash('success_msg', 'You are registered now..Plz verify your email to log in...');
                        
                    })
                    .catch(err => {
                        console.log(err);
                        return;
                    });
                 
            });
        });
        

    }
});

/////


//Logout User
router.get('/logout', (req, res) => {
     req.logout();
     req.flash('success_msg', 'You are Logged out...');
     res.redirect('/users/login');
});

router.get('/verification',(req,res) => {
    req.flash('success_msg', 'Email verified successfully');
    res.render('users/verification');
});

//Route profile page
router.get('/profile',(req,res) => {
    req.flash('success_msg', 'You are Logged in...')
    res.render('users/profile',{success_msg : req.flash('success_msg') });
    //res.locals.flash = [];        --------------to hide flashmsgs(not working...)
});

module.exports = router;
