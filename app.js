const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const app = express();

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/test')
.then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err));

//Load User model
require('./models/User');
const User = mongoose.model('user');


//Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get('/',(req,res) => {
    res.render('index');
});

app.get('/about',(req,res) => {
    res.render('about');
});

app.get('/login',(req,res) => {
    res.render('login');
});

app.post('/login',(req,res) => {
    res.send('Success');
});

app.get('/sign-up',(req,res) => {
    res.render('sign-up');
});

app.post('/sign-up',(req,res) => {
    res.send('Success1');
});

const port = 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});