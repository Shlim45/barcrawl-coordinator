const jwt = require('jsonwebtoken');

exports.createToken = function(auth) {
    return jwt.sign({
        id: auth.id,
    }, process.env.SECRET,
    {
        expiresIn: 60 * 120
    });
};
    
exports.generateToken = function(req, res, next) {
    req.token = exports.createToken(req.auth);
    return next();
};
    
exports.sendToken = function(req, res) {
    res.setHeader('x-auth-token', req.token);
    return res.status(200).send(JSON.stringify(req.user));
};

module.exports = exports;