const expressJwt = require('express-jwt');

const User = require('mongoose').model('User');

//token handling middleware
exports.authenticate = expressJwt({
    secret: process.env.SECRET,
    requestProperty: 'auth',
    getToken: function(req) {
    if (req.headers['x-auth-token']) {
        return req.headers['x-auth-token'];
    }
    return null;
    }
});

exports.getCurrentUser = function(req, res, next) {
    User.findById(req.auth.id, function(err, user) {
        if (err) {
            next(err);
        } else {
            req.user = user;
            next();
        }
    });
};

exports.getOne = function (req, res) {
    var user = req.user.toObject();
    
    delete user['twitterProvider'];
    delete user['__v'];
    
    res.json(user);
};

module.exports = exports;