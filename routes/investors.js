var express = require('express');
var router = express.Router();

var recentPR = 'Protext.PR.9.20.17.1.3.pdf';
var recentSU = 'CEO.Update.1.03.pdf'

/* GET investors main page */
router.get('/', function(req, res, next){
    res.render('investors/index', { title: 'Investors - Protext', partial: 'investor_parts/inv_home' });
});

router.get('/press', function(req, res, next){
    res.render('investors/index', { title: 'Investors - Protext', partial: 'investor_parts/press_release', recentPR: recentPR});
});

router.get('/shareholder_update', function(req, res, next){
    res.render('investors/index', { title: 'Investors - Protext', partial: 'investor_parts/shareholder', recentSU: recentSU});
});

router.get('/lease_agreement', function(req, res, next){
    res.render('investors/index', { title: 'Investors - Protext', partial: 'investor_parts/lease_agreement'});
});

router.get('/corporate_profile', function(req, res, next){
    res.render('investors/index', { title: 'Investors - Protext', partial: 'investor_parts/corporate_profile'});
});

module.exports = router;
