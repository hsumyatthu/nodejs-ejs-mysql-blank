var express = require('express');
var router = express.Router();
var users = require('./users');

//admin role check
router.use(function(req,res,next){
if (req.session.user.role == 'ADMIN') {
next();
}else {
  req.flash('warn', 'Not allowed user! Please login admin account');
  res.redirect('/signin');
}
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/home', { title: 'Admin Home' });
});

router.use('/users', users);

module.exports = router;
