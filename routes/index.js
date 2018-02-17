const express       = require('express');
const router        = express.Router();

const passport      = require('passport');

const Ceo           = require('../models/ceo');
const Pcbang        = require('../models/pcbang');
const Pcmap         = require('../models/pcmap');

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
function checkPCBangAndCallBack(req, res, next) {
    const userInfo = req.user;
    if(userInfo) {
        if(userInfo.ownPCBang.length === 0) {
            res.render('newPCBangPage', {
                ceoId: userInfo._id,
                pcBang: null,
            });
        } else
            return next();
    } else {
        res.redirect('/');
    }
}

// 로그인 한 사용자의 DB에 PCBang 정보가 있으면, PCBang 페이지에 정보 로딩
function checkPCBangAndAutoComplete(req, res, next) {
    req.params.pcBangId = req.user.ownPCBang[0];
    Pcbang.findPCBangForm(req)
        .then((pcbangs) => {
            if(pcbangs.length === 0)
                return next();
            else
                return res.render('newPCBangPage', {
                    ceoId: req.session.passport.user,
                    pcBang: pcbangs[0]
                });
        }).catch( (err) => {
            console.log(err);
            res.status(500).end();
        });
}

// 로그인 한 사용자의 DB에 PCMap 정보가 있으면, PCMap 페이지에 정보 로딩
function checkPCMapAndAutoComplete(req, res, next) {
    req.params.pcBangId = req.user.ownPCBang[0];
    Pcmap.findPCMapsByPCBangId(req)
        .then((pcmaps) => {
            if(pcmaps.length === 0)
                return next();
            else
                return res.render('newPCMapPage', {
                    ceoId: req.session.passport.user,
                    pcBangId: req.user.ownPCBang[0]._id,
                    pcMaps: pcmaps,
                });
        }).catch( (err) => {
            console.log(err);
            res.status(500).end();
        });
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

router.get('/ceo', checkPCBangAndCallBack, function(req, res) {
    res.render('ceoPage', {
        ceoId: req.session.passport.user
    });
});

router.get('/newPCBang', checkPCBangAndCallBack, checkPCBangAndAutoComplete, function(req, res) {
    res.render('newPCBangPage', {
        ceoId: req.session.passport.user
    });
});

router.get('/newPCMap', checkPCBangAndCallBack, checkPCMapAndAutoComplete, function(req, res) {
    res.render('newPCMapPage', {
        ceoId: req.session.passport.user,
        pcBangId: req.user.ownPCBang[0]._id,
        pcMaps: null,
    });
});

router.get('/doro', function(req, res) {
    res.render('doroTestPage');
});

router.get('/ipSet', function(req, res) {
    res.render('ipSetPage');
});

module.exports = router;
