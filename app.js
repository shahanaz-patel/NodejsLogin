const express = require('express');
const exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

//Load Routes
const users = require('./routes/users');

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

//set route
app.get('/',(req,res) => {
    res.render('index');
});

app.get('/about',(req,res) => {
    res.render('about');
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

//Use routes
app.use('/users',users);

const port = 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});