const express       = require('express');
const router        = express.Router();

const passport      = require('passport');

const Ceo           = require('../models/ceo');


// Index 페이지에서 SNS 계정 중복 로그인을 막기 위한 함수
function isLoggedIn(req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
}

// 현재 세션에 값이 없을 때 Index로 이동시키기
// 세션에 CEO 정보가 있으면 PC방 정보 확인하고, 없으면 등록페이지 표시
function checkLoggedinAndCallBack(req, res, next) {
    var userInfo = req.user;
    if(userInfo) {
        if(userInfo.ownPCBang.length === 0) {
            res.render('newPCBangPage');
        } else
            return next();
    } else {
        res.redirect('/');
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

router.get('/ceo', checkLoggedinAndCallBack, function(req, res) {
    res.render('ceoPage');
});

router.get('/newPCBang', checkLoggedinAndCallBack, function(req, res) {
    res.render('newPCBangPage');
});

router.get('/newPCMap', checkLoggedinAndCallBack, function(req, res) {
    res.render('newPCMapPage');
});

router.get('/newPCMapTest', checkLoggedinAndCallBack, function(req, res) {
    res.render('newPCMapTest');
});

module.exports = router;
