var express = require('express');
var router = express.Router();

/* GET investors main page */
router.get('/', function(req, res, next){
    res.render('investors/index', { title: 'Plandai - Investors' });
});

module.exports = router;