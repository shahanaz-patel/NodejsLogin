const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const passport =require('passport'); 
const mongoose = require('mongoose');

const app = express();

//Load Routes
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);


//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/users')
.then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err));

// //Load User model
// require('./models/User');
// const User = mongoose.model('user');

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
    saveUninitialized: true
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