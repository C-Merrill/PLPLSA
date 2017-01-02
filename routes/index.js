var express = require('express');
var nodemailer = require('nodemailer');
var request = require('request');
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
router.get('/about', function(req, res, next) {
  res.redirect('/about/who');
});

/* GET about who we are page */
router.get('/about/who', function(req, res, next) {
    res.render('about', { title: 'About Plandai SA', partial: 'about_parts/who_we_are'});
});

/* GET about key personnel page */
router.get('/about/personnel', function(req, res, next){
  res.render('about', { title: 'About Plandai SA', partial: 'about_parts/key_personnel'});
});

/* GET about company credo page */
router.get('/about/credo', function(req, res, next){
  res.render('about', { title: 'About Plandai SA', partial: 'about_parts/comp_credo'});
});

/* GET contact page */
router.get('/contact/', function(req, res, next) {
  res.render('contact', { title: 'Contact Us' });
});

/* POST for email message sent to contact */
router.post('/contact/', function(req, res, next){
  if (req.body['g-recaptcha-response'] === null || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === undefined){
    return res.status(500).send({'error':1, 'errorMessage': 'Please select recaptcha'});
  }

  var secretKey = config.recaptcha_secret;
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  // Hitting GET request to the URL, Google will respond with success or error scenario.
    request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    if(body.success !== undefined && !body.success) {
      return res.status(500).send({"error" : 1,"errorMessage" : "Failed captcha verification"});
    }
    var email_message = "<u>Contact Info</u>"
    + "Name: " + req.body.name + "\n"
    + "Company: " + req.body.company + "\n"
    + "Email: " + req.body.email + "\n"
    + "Phone: " + req.body.phone + "\n"
    + "Address:\n"
    + "\t" + req.body.address1 + "\n";
    if (req.body.address2!="")
    {
      email_message += "\t" + req.body.address2 + "\n";
    }
    email_message+= "\t" + req.body.city + ", " + req.body.state + "\n"
    + "\t" + req.body.zippostal + " " + req.body.country + "\n\n"
    + "<u>Message</u>\n" + req.body.message;
    
    console.log(email_message);
    
    var mailOptions={
      to : 'cmerrill99@gmail.com',
      from: req.body.email,
      subject : "Phytofare contact email from " + req.body.name,
      text : email_message
    }

    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){

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
  
});

router.get('/privacy_policy', function(req,res,next){
  res.render('privacy', {title: 'Privacy Policy - PlandaiSA'});
});

router.get('/safe_harbor', function(req, res, next){
  res.render('safe_harbor', {title: 'Safe Harbor - PlandaiSA'});
});

router.get('/articles', function(req, res, next){
  res.render('articles', {title: 'Articles - PlandaiSA' });
});

module.exports = router;
