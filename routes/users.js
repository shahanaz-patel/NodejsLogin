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
                    throw err;
                newUser.password = hash;
                new User(newUser)
                .save()
                    .then(user => {
                        req.flash('success_msg', 'You are registered now..Plz verify your email to log in...');
                        res.writeHead(302, {'Location': 'http://127.0.0.1:3000/send?emailid='+req.body.email+'&id='+newUser._id});
                    })
                    .catch(err => {
                        console.log(err);
                        return;
                    });
                 
            });
        });
        

    }
});
router.get('/send',function(req,res){
    urlparse=url.parse(req.url,true);
    id = urlparse.query.id;
    var hashtoken = crypto.randomBytes(16).toString('hex');
    var tokens = new Token({ 
        _userId: id, 
        token: hashtoken 
    });
    tokens.save();
    urlparse = url.parse(req.url,true);
    emails=urlparse.query.emailid;
    console.log(emails);
    host=req.get('host');
    link="http://"+req.get('host')+"/verify?id="+hashtoken;
});

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
