const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const router = express.Router();
const request = require('request');
const mongoose = require('../mongoose');

mongoose();

const User = require('mongoose').model('User');

const TWITTER_KEY = process.env.TWITTER_KEY;
const TWITTER_SECRET = process.env.TWITTER_SECRET;

const createToken = function(auth) {
    return jwt.sign({
        id: auth.id,
    }, process.env.SECRET,
    {
        expiresIn: 60 * 120
    });
};
    
const generateToken = function(req, res, next) {
    req.token = createToken(req.auth);
    return next();
};
    
const sendToken = function(req, res) {
    res.setHeader('x-auth-token', req.token);
    return res.status(200).send(JSON.stringify(req.user));
};

// TWITTER AUTH ROUTES

router.route('/auth/twitter/reverse')
    .post(function(req, res) {
        request.post({
            url: 'https://api.twitter.com/oauth/request_token',
            oauth: {
                oauth_callback: "https%3A%2F%2Ffcc-dynamic-shlim45.c9users.io",
                consumer_key: TWITTER_KEY,
                consumer_secret: TWITTER_SECRET
            }
        }, function(err, r, body) {
            if (err) {
                return res.send(500, { message: err.message });
            }
            
            const jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
            res.send(JSON.parse(jsonStr));
        });
    });
    
router.route('/auth/twitter')
    .post((req, res, next) => {
        request.post({
            url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
            oauth: {
                consumer_key: TWITTER_KEY,
                consumer_secret: TWITTER_SECRET,
                token: req.query.oauth_token
            },
            form: { oauth_verifier: req.query.oauth_verifier }
        }, function (err, r, body) {
            if (err) {
                return res.send(500, { message: err.message });
            }
            
            const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
            const parsedBody = JSON.parse(bodyString);
            
            req.body['oauth_token'] = parsedBody.oauth_token;
            req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
            req.body['user_id'] = parsedBody.user_id;
            
            next();
        });
    }, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }
    
        // prepare token for API
        req.auth = {
            id: req.user.id
        };
    
        return next();
    }, generateToken, sendToken);

//token handling middleware
const authenticate = expressJwt({
    secret: 'my-secret',
    requestProperty: 'auth',
    getToken: function(req) {
    if (req.headers['x-auth-token']) {
        return req.headers['x-auth-token'];
    }
    return null;
    }
});

const getCurrentUser = function(req, res, next) {
    User.findById(req.auth.id, function(err, user) {
        if (err) {
            next(err);
        } else {
            req.user = user;
            next();
        }
    });
};

const getOne = function (req, res) {
    var user = req.user.toObject();
    
    delete user['twitterProvider'];
    delete user['__v'];
    
    res.json(user);
};

router.route('/auth/me')
  .get(authenticate, getCurrentUser, getOne);
    
module.exports = router;