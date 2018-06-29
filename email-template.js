const nodemailer = require('nodemailer');
const url = require('url');
var randtoken = require('rand-token');
var crypto = require('crypto');
const express = require('express');
const app = express();

const Token=require('./models/Token');
// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "shanazkukz@gmail.com",
            pass: "kukzkukz"
        }
    });

    var rand,mailOptions,host,link;
    app.get('/send',function(req,res){
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

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Shehnaz Patel " <shanazkukz@gmail.com>', // sender address
        to: "l1873512@nwytg.com", // list of receivers
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
        res.render('verification');

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});
});

//module.exports = router;