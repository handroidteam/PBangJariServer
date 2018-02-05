// passport 모듈로 카카오 로그인 구현
const passport      = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const Ceo           = require('../models/ceo');
const config        = require('../bin/config');


// DB에서 찾은 사용자의 정보를 세션에 저장
passport.serializeUser(function(ceo, done) {
    done(null, ceo._id);
});
passport.deserializeUser(function(id, done) {
    Ceo.findOne({
        _id: id
    }, function(err, ceo) {
        done(err, ceo);
    });
});

passport.use('kakao', 
    new KakaoStrategy({
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: '/kakao_oauth'
    },
    (accessToken, refreshToken, profile, done) => {
        Ceo.findCeoByKakaoID(profile.id).then(
            ceo => {
                if(!ceo) {
                    Ceo.createCeoDB({
                        displayName: profile.displayName,
                        provider: profile.provider,
                        id: profile.id,
                        accessToken
                    }, function(err, ceo) {
                        if(err) {
                            done(err);
                        }
                        done(null, ceo);
                    });
                } else {
                    done(null, ceo);
                }
            }
        ).catch(
            error => {
                done(error);
            }
        );
    })
);