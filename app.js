const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const async = require('async');
const bodyParser = require('body-parser');
const passport =require('passport'); 
const bcrypt = require('bcryptjs');
const randtoken = require('rand-token');
const url=require('url');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const app = express();

//Load Routes
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);


//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/loginSystem')
.then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err));

// //Load User model
require('./models/User');
const User = mongoose.model('user');

//Load Token model
require('./models/Token');
const Token = mongoose.model('Token');

//Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

}));

app.use(flash());

//Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user =req.user || null;
    next();
});

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set route
app.get('/',(req,res) => {
    res.render('index');
});

app.get('/about',(req,res) => {
    res.render('about');
});
//send mailhead and token generation
app.get('/send',function(req,res){
    console.log('send');
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
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "bosetester19@gmail.com",
                pass: "zeusbomber"
            }
        });
    
       // var rand,mailOptions,host,link;
        let mailOptions = {
            from: '"LoginSystem " <loginverification@gmail.com>', // sender address
            to: emails, // list of receivers
            subject: "Please confirm your Email account", // Subject line
            text: 'Hello ✔', // plain text body
            html: "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" // html body
        };
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.render('users/verification');
    
        });
    });
});

app.get('/verify',(req,res) => {
    urlparse=url.parse(req.url,true);
    id=urlparse.query.id;
    Token.findOne({ token: id }, function (err, token) {
  
          if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
          User.findOne({ _id:token._userId }, function (err, user) {
                   if(user){
                     user.isVerified = true;
                     user.save();
                     console.log(user);
                     req.flash('success_msg', 'Email verified successfully...Login to activate your account...');
                     res.render('users/login',{success_msg:'Email verified successfully...Login to activate your account...'});
                   }
                      if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
                    });
  
  
  });
  
});

app.get('/reset/:token',(req,res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error_msg', 'Password reset token is invalid or has expired.');
          return res.redirect('/users/forgot');
        }
        res.render('users/reset', {
          user: req.user
        });
      });
});

//process reset password token
app.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error_msg', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          bcrypt.genSalt(9,(err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                // if(err) throw err;

                user.password = hash;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                console.log('password  ' + user.password  + 'and the user is' + user.email);

                user.save(function(err) {
                    if (err) {
                        console.log('here')
                        return res.redirect('back');
                    } else { 
                        console.log('here2')
                        req.logIn(user, function(err) {
                        done(err, user);
                      });
                  
                    }
                });

            });
          });
            
        
        });
    },
              
        //   bcrypt.genSalt(9,(err, salt) => {
        //     bcrypt.hash(user.password, salt, (err, hash) => {
        //         if(err)
        //             //throw err;
        //             {
        //                 if(err.code===11000){
        //                     req.flash('error_msg', 'Already exist');
        //                     res.render('users/sign-up',{error_msg:'Already Exists'});
        //                 }
        //             }
                // user.password = hash;
                // user.resetPasswordToken = undefined;
                // user.resetPasswordExpires = undefined;

                // user.save()
                  

                 
           // });
       // });

       // });
     // },
      function(user, done) {
        nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "bosetester19@gmail.com",
                    pass: "zeusbomber"
                }
            });
        
           // var rand,mailOptions,host,link;
            let mailOptions = {
                from: '"LoginSystem " <resetsuccessful@gmail.com>', // sender address
                to: user.email, // list of receivers
                subject: 'Your password has been changed', // Subject line
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n' // plain text body
            };
        
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                res.render('users/verification');
        
            });
        });
      }
    ], function(err) {
      res.redirect('/reset');
    });
  });


//Use routes
app.use('/users',users);

const port = 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


// app.get('/login',(req,res) => {
//     res.render('login');
// });

// //Process form
// app.post('/login',(req,res) => {
//     let errors = [];
//     if(!req.body.email){
//         errors.push({text:"Please enter your email"});
//     }
//     if(!req.body.password){
//         errors.push({text:"Invalid Password"});
//     }

//     if(errors.length > 0){
//         res.render('login', {
//             errors: errors,
//             email: req.body.email,
//             password: req.body.password
//         })
//     } else{
//         res.send('Success');
//     }
    
//     // console.log(req.body);
//     // res.send('Success');
// });

// app.get('/sign-up',(req,res) => {
//     console.log(req.body);
//     res.render('sign-up');
// });

// app.post('/sign-up',(req,res) => {
//     let errors = [];
//     if(!req.body.firstname){
//         errors.push({text:"Please enter your Name"});
//     }
//     if(!req.body.email){
//         errors.push({text:"Please enter your email"});
//     }
//     if(!req.body.password){
//         errors.push({text:"Invalid Password"});
//     }

//     if(errors.length > 0){
//         res.render('login', {
//             errors: errors,
//             firstname: req.body.firstname,
//             lastname: req.body.lastname,
//             place: req.body.email,
//             email: req.body.email,
//             password: req.body.password
//         })
//     } else{
//         const newUser = {
//             firstname: req.body.firstname,
//             lastname: req.body.lastname,
//             place: req.body.email,
//             email: req.body.email,
//             password: req.body.password
//         }
        
//         new User(newUser)
//             .save()
//             .then(user => {
//                 res.redirect('/login');
//             })
//         // res.send('Success');
//     }

//     // console.log(req.body);
//     // res.send('Success1');
// });



//passport local strategy

// var passport = require('passport')
//   , LocalStrategy = require('passport-local').Strategy;

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));  