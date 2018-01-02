var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./bin/config');

var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var User = require('./models/user');
var Ceo = require('./models/ceo');

var app = express();

//DB 설정

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pbangjari');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
  console.log('connected to mongodb server');
});


var session = require('express-session');
var helmet = require('helmet');
var assert = require('assert');
var passport = require('passport');
var KakaoStrategy = require('passport-kakao').Strategy;

//store 설정
var MongoDBStore = require('connect-mongodb-session')(session);

var store = new MongoDBStore({
  uri: 'mongodb://localhost/pbangjari',
  collection: 'mySessions'
});

store.on('error', function(err) {
  assert.ifError(err);
  assert.ok(false);
})

//session 설정
app.use(session({
  secret: config.values.sessionSecret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000,
    httpOnly: true
  },
  store: store,
  rolling: true
}))

//session 보안 설정
app.use(helmet.hsts({
  maxAge: 1088640000,
  includeSubdomains: true
}))

//passport 미들 웨어 설정
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(ceo, done) {
  console.log(ceo._id)
  done(null, ceo._id);
});
passport.deserializeUser(function(id, done) {
  console.log(id)
  Ceo.findOne({
    _id: id
  }, function(err, ceo) {
    done(err, ceo);
  });
});

//카카오 로그인 설정
passport.use('kakao', new KakaoStrategy({
    clientID: config.values.clientID,
    clientSecret: config.values.clientSecret,
    callbackURL: 'http://localhost:3000/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    Ceo.findOne({
      sns: 'kakao',
      distinguishID: profile.id
    }, function(err, ceo) {
      if (err) {
        return cb(err);
      }
      if (!ceo) {
        Ceo.create({
          name: profile.displayName,
          sns: profile.provider,
          distinguishID: profile.id,
          token: accessToken
        }, function(err, ceo) {
          if (err) {
            return cb(err);
          }
          cb(null, ceo);
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
          if (err) {
            return cb(err);
          }
          else cb(null, ceo);
        });
      }
    });
  }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/api', api);

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
