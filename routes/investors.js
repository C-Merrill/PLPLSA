var express = require('express');
var router = express.Router();

/* GET investors main page */
router.get('/', function(req, res, next){
    res.render('investors/index', { title: 'Investors - PlandaiSA', partial: 'investor_parts/inv_home' });
});

router.get('/press', function(req, res, next){
    res.render('investors/index', { title: 'Investors - PlandaiSA', partial: 'investor_parts/press_release'});
});

router.get('/shareholder_update', function(req, res, next){
    res.render('investors/index', { title: 'Investors - PlandaiSA', partial: 'investor_parts/shareholder'});
});

module.exports = router;