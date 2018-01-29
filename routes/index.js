const express       = require('express');
const router        = express.Router();

const passport      = require('passport');

const Ceo           = require('../models/ceo');


// 중복 로그인을 막기 위한 함수 (index 페이지)
function isLoggedIn(req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
}

// 현재 세션에 값이 없을 때 로그인 페이지로 이동시키기
function checkLoggedinAndCallBack(req, res, next) {
    var loginInfo = req.session.passport;
    if(loginInfo) {
        return next();
    } else {
        res.render('/auth/kakao', {
            ceoName: '',
            ceoId: ''
        });
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.passport) {
        Ceo.findById(req.session.passport.user, (err, ceo) => {
            if(ceo)
                res.render('index', {
                    ceoName: ceo.name
                });
            else res.render('index', {
                ceoName: ''
            });
        });
    } else res.render('index', {
        ceoName: ''
    });
});

router.get('/auth/kakao', isLoggedIn, passport.authenticate('kakao', {
    successRedirect: '/',       // 성공하면 index로
    failureRedirect: '/fail'    // 실패하면 fail로
}));

router.get('/kakao_oauth', passport.authenticate('kakao', {
    successRedirect: '/',       // 성공하면 index로
    failureRedirect: '/fail'    // 실패하면 fail로
}));

router.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy();
    res.render('index', {
        ceoName: ''
    });
});

router.get('/ceo', function(req, res) {
    res.render('ceoPage');
});

router.get('/newPCBang', function(req, res) {
    res.render('newPCBangPage');
});

router.get('/newPCMap', function(req, res) {
    res.render('newPCMapPage');
});

router.get('/newPCMapTest', function(req, res) {
    res.render('newPCMapTest');
});

module.exports = router;
