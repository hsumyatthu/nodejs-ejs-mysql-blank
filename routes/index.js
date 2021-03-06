var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*Get signup page */
router.get('/signup', function(req, res, next) {
  res.render('commons/sign-up', { title: 'Signup' });
});

/*Post signup page */
router.post('/signup', function(req, res, next) {
  var params =[req.body.name, req.body.email, req.body.password, 'USER'];
  User.findByEmail(req.body.email, function(err, rows){
    if (err) throw err;
    if (rows.length > 0) {
      req.flash('warning', 'Duplicated email!!');
      res.redirect('/signup');
    }else {
      User.add(params, function(err2, result){
        if(err2) throw err2;
        res.render('commons/sign-up-success', {title: 'Signup success'});
      });
    }
});
});

/*Post email duplicated page */
router.post('/dupemail', function(req, res, next) {
  User.findByEmail(req.body.email, function(err, rows){
    if (err) throw err;
    if (rows.length > 0) {
      res.json({ status: true, msg: 'Duplicated email!!'});
    }else {
      res.json({status: false});
      }
  });
});

/*Get signin page */
router.get('/signin', function(req, res, next) {
  var email = (req.cookies.email)?req.cookies.email:'';
  console.log(email);
  res.render('commons/sign-in', { title: 'Signin', email:email });
});

/*Post signin action */
router.post('/signin', function(req, res, next) {
  User.findByEmail(req.body.email, function(err,users){
    if (err) next(err) ;
    if(users.length == 0 || !User.compare(req.body.password, users[0].password)){
      req.flash('warning', 'Email not exists or password not matched!!');
      if(req.body.forward) req.flash('forward', req.body.forward);
      res.redirect('/signin');
    }else {
      req.session.user = {uid: users[0].uid, name: users[0].name, email: users[0].email, role: users[0].role};
      if(req.body.rememberme) res.cookie('email', users[0].email, {maxAge: 86400 * 7});
      else res.cookie('email', '', {maxAge: 0});
      if (req.body.forward &&
        (users[0].role == 'ADMIN' && req.body.forward.startsWith('/admin') ||
        users[0].role == 'USER' && req.body.forward.startsWith('/members')
      ) ) {
        res.redirect(req.body.forward);
      }else
      if (users[0].role == 'ADMIN') {
        res.redirect('/admin');
      }else {
        res.redirect('/members');
      }
    }
  });
});

/*Get Login page */
router.get('/login', function(req, res, next) {
  res.render('commons/log-in', { title: 'Login' });
});

/*Post email duplicated page */
router.post('/login', function(req, res, next) {
  User.findByEmail(req.body.email, function(err, users){
    if (err) next(err);
    if (users.length == 0 || !User.compare(req.body.password, users[0].password)){
      res.json({ status: false, msg: 'Email not exists or password not matched!!'});
    }else {
      req.session.user = {uid: users[0].uid, name: users[0].name, email: users[0].email, role: users[0].role};
      res.json({status: true});
      }
  });
});

/*Get Login page */
router.get('/signout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

/* TODO init */
router.get('/init', function(req, res, next) {
  var params =['Admin', 'help@abc.com', 'Ki123456','ADMIN'];
      User.add(params, function(err, result){
        if(err) throw err;
        console.log('init', result);
        res.end('Ok');
      });
});

module.exports = router;
