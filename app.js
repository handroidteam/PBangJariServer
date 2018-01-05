var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');

var index           = require('./routes/index');
var users           = require('./routes/users');

var Ceo             = require('./models/ceo');

var config          = require('./bin/config');

var app = express();

// DB 설정
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pbangjari');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
    console.log('connected to mongodb server');
});


/***************************************************************/
// session 및 보안 설정을 위한 모듈
var session         = require('express-session');
var helmet          = require('helmet');
var assert          = require('assert');

// 카카오 로그인 구현
var passport        = require('passport');
var KakaoStrategy   = require('passport-kakao').Strategy;


// MongoDB store 설정, session은 express-session에서 선언한 session
var MongoDBStore = require('connect-mongodb-session')(session);

var store = new MongoDBStore(
    {
        // mongoDB 연결 URI 입력
        uri: 'mongodb://localhost/pbangjari',
        // 생성할 collection 이름 입력
        collection: 'mySessions'
    }
);

// store 에러 캐치
store.on('error', function(error) {
    assert.ifError(error);
    assert.ok(false);
});


// session 암호화
app.use(session({
    secret: config.secret,
    resave: true,   
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000, 
        httpOnly: true
    },
    store: store,
    rolling: true
}));

// session 보안 설정
app.use(helmet.hsts(
    {
        maxAge: 10886400000,
        includeSubdomains: true
    }
));

// passport 모듈 초기화
app.use(passport.initialize());
// passport 세션 사용
app.use(passport.session());


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

passport.use('kakao', new KakaoStrategy(
    {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: '/kakao_oauth'
    },
    function(accessToken, refreshToken, profile, done) {
        Ceo.findOne({
            sns: 'kakao',
            distinguishID: profile.id
        }, function(err, ceo) {
            if(err) {
                return done(err);
            }
            if(!ceo) {
                Ceo.create({
                    name: profile.displayName,
                    sns: profile.provider,
                    distinguishID: profile.id,
                    token: accessToken
                }, function(err, ceo) {
                    if(err) {
                        return done(err);
                    }
                    done(null, ceo);
                });
            } else {
                var tmp = accessToken;
                var tmp2 = new Date();
                Ceo.findByIdAndUpdate(ceo._id, {
                    $set: {
                        lastvisited: tmp2,
                        token: tmp
                    }
                }, function(err, ceo) {
                    if(err) {
                        return done(err);
                    }
                    else done(null, ceo);
                });
            }
        });
    }
));
/***************************************************************/


// View Engine Setup = ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// favicon 설정
app.use(favicon(path.join(__dirname, 'public', 'images/logo.png')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
