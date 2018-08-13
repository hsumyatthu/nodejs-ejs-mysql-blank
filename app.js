var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('express-flash');

var indexRouter = require('./routes/index');
var members = require('./routes/members');
var admin = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// plugins in node module
app.use('/js', express.static(__dirname+'/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname+'/node_modules/jquery-validation/dist'));

app.use(session({
  secret: 'AN12@~1!/y8&^*@$%<<,',// any string for security
  resave: false,
  saveUninitialized : true
}));
app.use(flash());

// Set session for EJS //after session, before routing
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});

app.use('/', indexRouter);
app.use('/members', members);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//client error for ajxa
app.use(function(err, req, res, next){
  if (req.xhr) {
    res.status(err.status || 500).send(err.message);
  }else {
    next(err);
  }
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('commons/error' + ((err.status == 404)?'-404':''));
});

module.exports = app;
