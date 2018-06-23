const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const app = express();

//Connect to mongoose
mongoose.connect('mongodb://localhost/nodelogin-dev', {
    useMongoClient: true
})
.then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err))

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

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});