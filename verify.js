var express=require('express');
var app=express();
var url=require('url');
// //Load User model
// require('./models/User');
// const User = mongoose.model('user');

const Token=require('./models/Token');
const User=require('./models/User');
app.get('/',function(req,res){

//   var dbconnect=require('./mongodb_connect.js');
//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/loginSystem')
.then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err));

  urlparse=url.parse(req.url,true);
  id=urlparse.query.id;
  Token.findOne({ token: id }, function (err, token) {
    console.log(token)
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token may have expired.' });
        User.findOne({ _id: token._userId }, function (err, user) {
                    if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
                  });

});

});
module.exports = router;