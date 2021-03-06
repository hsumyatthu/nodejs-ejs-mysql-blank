var db = require('../dbconn');
var bcrypt = require('bcrypt-nodejs');

var User = {
  add: function(params, callback) {
    var sql = "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?) ";
    params[2] = bcrypt.hashSync(params[2], bcrypt.genSaltSync(8), null);
    return db.query(sql, params, callback);
  },

  findByEmail: function(email, callback) {
    var params = [email];
    var sql = 'SELECT uid, email, password, name, role FROM users WHERE email = ?';
    return db.query(sql, [email], callback);
  },

  findById: function(uid, callback) {
    var sql = "SELECT uid, email, password, name, role, DATE_FORMAT(updated, '%d/%m/%Y %H:%i') AS updated FROM users WHERE uid = ?";
    return db.query(sql, [uid], callback);
  },

  update: function(params, callback) {
    var sql = "UPDATE users SET name =?, role = ?, updated = NOW() WHERE uid = ?";
    return db.query(sql, params, callback);
  },

  remove: function(uid, callback) {
    console.log('do');
    var sql = "DELETE FROM users WHERE uid = ?";
    return db.query(sql, [uid], callback);
  },

  find: function(params, orderby, callback) {
    var p = [];
    var sql = 'SELECT uid, email, password, name, role, DATE_FORMAT(updated, \'%d/%m/%Y %H:%i\') AS updated FROM users';
    if(params[0] !='' || params[2] !=''){
      sql += " WHERE";
    if(params[0] !=''){
      sql += " ( name LIKE concat('%',?,'%') OR email LIKE concat('%',?,'%') )";
      p.push(params[0]);
      p.push(params[1]);
    if(params[2] !=''){
      sql += " AND ";
    }
  }
    if(params[2] !==''){
        sql += " role = ?";
        p.push(params[2]);
      }
    }
    sql += " ORDER BY "+ orderby[0] +" "+ orderby[1];
    console.log(sql, p);
    return db.query(sql, p, callback);
  },

  compare: function(cleartext, encrypted) {
    return bcrypt.compareSync(cleartext, encrypted);
  }
};

module.exports = User;
