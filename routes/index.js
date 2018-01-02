var express = require('express');
var router = express.Router();
var passport = require('passport');
var Ceo = require('../models/ceo')

function isLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/');
  }
}

router.get('/kakao', passport.authenticate('kakao'));

router.get('/callback' ,isLoggedIn , passport.authenticate('kakao', {
  successRedirect: '/',
  failureRedirect: '/fail'
}));

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.session.passport) {
    Ceo.findById(req.session.passport.user, (err, ceo) => {
      if(ceo.name) res.render('index', {
        ceoName: ceo.name
      });
      else res.render('index', {
        ceoName: ''
      });
    })
  } else res.render('index', {
    ceoName: ''
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.render('index', {
    ceoName: ''
  });
});

module.exports = router;
