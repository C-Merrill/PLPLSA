var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();
var config = require('../app.config');

var smtpTransport = nodemailer.createTransport("SMTP", {
  service: "SendGrid",
  auth: {
    user: config.sendgrid.username,
    pass: config.sendgrid.password
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Plandai - South Africa' });
});

/* GET about page */
router.get('/about/', function(req, res, next) {
    res.render('about', { title: 'About Plandai SA'});
});

/* GET contact page */
router.get('/contact/', function(req, res, next) {
  res.render('contact', { title: 'Contact Us' });
});

/* POST for email message sent to contact */
router.post('/contact/', function(req, res, next){
  var mailOptions={
    to : 'cmerrill99@gmail.com',
    subject : "Phytofare contact email from " + req.body.name,
    text : req.body.message
  }
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
      var resp = {
        error: error,
        status: 500
      }
      res.status(500).send({error: error});
      //res.end(JSON.stringify(resp));
    }else{
      console.log("Message sent: " + response.message);
      var resp = {
        success: response.message,
        status: 200
      }
      res.end(JSON.stringify(resp));
    }
  });
});

module.exports = router;
