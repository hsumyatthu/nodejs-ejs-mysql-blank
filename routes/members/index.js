var express = require('express');
var router = express.Router();

//admin role check
router.use(function(req,res,next){
if (req.session.user.role == 'USER') {
next();
}else {
  req.flash('warn', 'Not allowed user! Please login members account');
  res.redirect('/signin');
}
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('members/home', { title: 'Member Home' });
});

module.exports = router;
