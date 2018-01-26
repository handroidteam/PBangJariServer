const express       = require('express');
const path          = require('path');
const favicon       = require('serve-favicon');
const logger        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const passport      = require('passport'); require('./passport');

const index         = require('./routes/index');
const users         = require('./routes/users');
const api           = require('./routes/api');

const config        = require('./bin/config');

const app = express();

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
const session       = require('express-session');
const helmet        = require('helmet');
const assert        = require('assert');

// MongoDB store 설정, session은 express-session에서 선언한 session
const MongoDBStore  = require('connect-mongodb-session')(session);

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

/***************************************************************/


// View Engine Setup = ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// favicon 설정
app.use(favicon(path.join(__dirname, 'public', 'images/pbangjari-logo.png')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
