var express = require('express');
var nodemailer = require('nodemailer');
var request = require('request');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var config = require('../app.config');

var articles = [
  {
    title:'Plandai and Diabetes',
    article:'Diabetes_Plandai.pdf'
  },
  {
    title:'Green Tea for Diabetes',
    article:'Green_Tea_For_Diabetes_Green_Tea_in_3.pdf'
  },
  {
    title:'Grean tea extract shows anti-diabetic potential',
    article:'Green_Tea_report_Diabetes.pdf'
  },
  {
    title:'Clinical Trial in Type 2 Diabetes Patients',
    article:'Proposal_for_ph2_diabetes_clinical_trial_ag.pdf'
  },
  {
    title:'Green Tea Catechins in Prevention of Metabolic Syndrome',
    article:'study-26_teavigo.pdf'
  },
  {
    title:'USA Diabetes Statistics',
    article:'USA.pdf'
  }
];

var prs = [
  {
    title:'January 10, 2017',
    article:'Protext.PR.1.10.17.9.pdf'
  },
  {
    title:'March 2, 2017',
    article:'PR.3.2.17.1.1.pdf'
  },
  {
    title:'March 7, 2017',
    article:'Protext.PR.3.7.17.1.5.pdf'
  },
  {
    title:'March 27, 2017 Cannabis',
    article:'PR.CannabisBio.3.27.17.pdf'
  },
  {
    title:'May 4, 2017',
    article:'PR.TXTM.May.4.2017.1.f.pdf'
  },
  {
    title:'May 23, 2017 Cannabis',
    article:'Protext.PR.5.23.17.1.1.pdf'
  }
];

//TODO: use metadata and file walker to make these lists

var smtpTransport = nodemailer.createTransport("SMTP", {
  service: "SendGrid",
  auth: {
    user: config.sendgrid.username,
    pass: config.sendgrid.password
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Protext Pharma' });
});

/* GET about who we are page */
router.get('/about', function(req, res, next) {
    res.render('about', { title: 'About Protext', partial: 'about_parts/who_we_are'});
});

/* GET about plandai sa page */
router.get('/about/plandaiSA',(req,res,next)=>{
  res.render('about', { title: 'About Plandai SA', partial: 'about_parts/about_plandai'});
});

router.get('/about/cannabisbio',(req,res,next)=>{
  res.render('about', { title: 'About Cannabis Biosciences', partial: 'about_parts/about_cannabis'})
});

/* GET about key personnel page */
router.get('/about/personnel', function(req, res, next){
  res.render('about', { title: 'About Protext', partial: 'about_parts/key_personnel'});
});

/* GET about gallery page */
router.get('/about/gallery', function(req, res, next){
  var landscapeImgs = fs.readdirSync('./public/images/Estate/').filter(file => !fs.statSync(path.join('./public/images/Estate',file)).isDirectory());
  var facilityImgs = fs.readdirSync('./public/images/Facility').filter(file => !fs.statSync(path.join('./public/images/Facility',file)).isDirectory());
  var personnelImgs = fs.readdirSync('./public/images/Personnel').filter(file => !fs.statSync(path.join('./public/images/Personnel',file)).isDirectory());
  var otherImgs = fs.readdirSync('./public/images/Other').filter(file => !fs.statSync(path.join('./public/images/Other',file)).isDirectory());
  res.render('about', { title: 'About Protext', partial: 'about_parts/gallery', landscapeImgs: landscapeImgs, facilityImgs: facilityImgs, personnelImgs: personnelImgs, otherImgs: otherImgs });
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
    var email_message = "<u>Contact Info</u><br/>"
    + "Name: " + req.body.name + "<br/>"
    + "Company: " + req.body.company + "<br/>"
    + "Email: " + req.body.email + "<br/>"
    + "Phone: " + req.body.phone + "<br/>"
    + "Address:<br/>"
    + "   " + req.body.address1 + "<br/>";
    if (req.body.address2!="")
    {
      email_message += "   " + req.body.address2 + "<br/>";
    }
    email_message+= "   " + req.body.city + ", " + req.body.state + "<br/>"
    + "   " + req.body.zippostal + " " + req.body.country + "<br/><br/>"
    + "<u>Message</u><br/>" + req.body.message;

    console.log(email_message);

    var mailOptions={
      to : 'info@plandaibiotech.com',
      from: req.body.email,
      subject : "Phytofare contact email from " + req.body.name,
      html : email_message
    };

    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){

        var resp = {
          error: error,
          status: 500
        };
        res.status(500).send({error: error});
        //res.end(JSON.stringify(resp));
      }else{
        console.log("Message sent: " + response.message);
        var resp = {
          success: response.message,
          status: 200
        };
        res.end(JSON.stringify(resp));
      }
    });

    var autoreply = "<p>" + req.body.name + ", thank you for your message. We will try to get back to you as soon as possible.</p><br/>"
    + "<p>Protext Pharma, Inc.</p>";

    mailOptions={
      to : req.body.email,
      from : "no-reply@plandaibiotech.com",
      subject : "Thank you",
      html : autoreply
    };

    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){

        var resp = {
          error: error,
          status: 500
        };
        res.status(500).send({error: error});
        //res.end(JSON.stringify(resp));
      }else{
        console.log("Message sent: " + response.message);
        var resp = {
          success: response.message,
          status: 200
        };
        res.end(JSON.stringify(resp));
      }
    });
  });
});

router.get('/privacy_policy', function(req,res,next){
  res.render('privacy', {title: 'Privacy Policy - Protext'});
});

router.get('/safe_harbor', function(req, res, next){
  res.render('safe_harbor', {title: 'Safe Harbor - Protext'});
});

router.get('/articles', function(req, res, next){
  res.render('articles', {title: 'Articles - Protext', articles: articles, preview:false });
});

router.get('/articles/pr', (req,res,next) => {
  res.render('articles-press', {title: 'Press - Protext', articles: prs, preview:false });
});

router.get('/articles/:id', function(req,res,next){
  var id = req.params.id;
  if (id < 0) res.redirect(0);
  if (id >= articles.length) res.redirect(articles.length - 1);
  res.render('articles', {title: 'Articles - Protext', articles: articles, preview:true, id:id});
});

router.get('/articles/pr/:id', function(req,res,next){
  var id=req.params.id;
  if (id < 0) res.redirect(0);
  if(id >= prs.length) res.redirect(prs.length - 1);
  res.render('articles-press', {title: 'Press - Protext', articles: prs, preview:true, id:id})
});

module.exports = router;
