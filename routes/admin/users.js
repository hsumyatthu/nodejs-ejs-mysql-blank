var express = require('express');
var router = express.Router();
var User = require('../../models/User');

router.all('/list', function(req, res, next) {
  var params = [req.body.keyword||'', req.body.keyword||'', req.body.role||''];
  User.find(params, function(err, users) {
    if (err) throw err;
    res.render('admin/users/user-list', { title: 'User List', users: users, search:{keyword: req.body.keyword, role: req.body.role} });
  });
});

router.get('/view/:uid', function(req, res, next) {
  User.findById( req.params.uid,function(err, user) {
    if (err) throw err;
    if(user.length == 0) next(new Error('User data not found!'));
    res.render('admin/users/user-view', { title: 'User View', user: user[0] });
  });
});

router.get('/modify/:uid', function(req, res, next) {
  User.findById( req.params.uid,function(err, user) {
    if (err) throw err;
    if(user.length == 0) next(new Error('User data not found!'));
    res.render('admin/users/user-modify', { title: 'User View', user: user[0] });
  });
});

router.post('/modify', function(req, res, next) {
  var params = [req.body.name, req.body.role, req.body.uid];
  User.findById( req.body.uid,function(err, user) {
    if (err) throw err;
    if(user.length == 0) next(new Error('User data not found!'));
    User.update(params, function(uerr,uuser){
      if(uerr) throw uerr;
      req.flash('info', 'Success');
      res.redirect('/admin/users/view/'+ user[0].uid);
    });
  });
});

router.post('/remove', function(req, res, next) {
  User.remove(req.body.uid,function(err, user) {
    if (err) throw err;
    req.flash('info', 'Successfully');
    res.redirect('/admin/users/list');
  });
});

router.get('/add', function(req, res, next) {
  res.render('admin/users/user-add', { title: 'Add User' });
});

router.post('/add', function(req, res, next) {
  var params =[req.body.name, req.body.email, req.body.password, req.body.role];
  User.findByEmail(req.body.email, function(err, rows){
    if (err) throw err;
    if (rows.length > 0) {
      req.flash('warning', 'Duplicated email!!');
      res.redirect('/admin/users/add');
    }else {
      User.add(params, function(err2, result){
        if(err2) throw err2;
        res.redirect('/admin/users/view/'+result.insertId);
      });
    }
  });
});

module.exports = router;
