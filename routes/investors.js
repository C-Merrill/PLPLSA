var express = require('express');
var router = express.Router();

var recentPR = 'Protext.PR.9.20.17.1.3.pdf';
var recentSU = 'CEO.Update.1.03.pdf';

var prs = [
  {
    title:'November 20, 2017',
    article:'Protext.PR.11.20.17.1.1.1.pdf'
  },
  {
    title:'October 30, 2017',
    article:'Protext.PR.10.30.17.1.5.pdf'
  },
  {
    title:'September 20, 2017',
    article:'Protext.PR.9.20.17.1.3.pdf'
  },
  {
    title:'September 13, 2017',
    article:'Protext.PR.9.13.17.2.pdf'
  },
  {
    title:'NEWS RELEASE July 13, 2017',
    article:'NEWS RELEASE July 13.17.1.1 (2).pdf'
  },
  {
    title:'May 23, 2017 Cannabis',
    article:'Protext.PR.5.23.17.1.1.pdf'
  },
  {
    title:'May 4, 2017',
    article:'PR.TXTM.May.4.2017.1.f.pdf'
  },
  {
    title:'March 27, 2017 Cannabis',
    article:'PR.CannabisBio.3.27.17.pdf'
  },
  {
    title:'March 7, 2017',
    article:'Protext.PR.3.7.17.1.5.pdf'
  },
  {
    title:'March 2, 2017',
    article:'PR.3.2.17.1.1.pdf'
  },
  {
    title:'January 10, 2017',
    article:'Protext.PR.1.10.17.9.pdf'
  },
];

/* GET investors main page */
router.get('/', function(req, res, next){
    res.render('investors/index', { title: 'Investors - Protext', partial: 'investor_parts/inv_home' });
});

router.get('/press', function(req, res, next){
    res.render('investors/articles-press', { title: 'Press - Protext', articles: prs, preview:false });
});

router.get('/press/:id', function(req,res,next){
  var id=req.params.id;
  if (id < 0) res.redirect(0);
  if(id >= prs.length) res.redirect(prs.length - 1);
  res.render('investors/articles-press', {title: 'Press - Protext', articles: prs, preview:true, id:id})
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
