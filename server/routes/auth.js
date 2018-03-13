const passport = require('passport');
const express = require('express');
const request = require('request');

const mongoose = require('../mongoose');
const tokens = require('../modules/token');

const router = express.Router();

mongoose();
// must import middleware after running mongoose(), requires UserSchema
const middleware = require('../middleware');

const TWITTER_KEY = process.env.TWITTER_KEY;
const TWITTER_SECRET = process.env.TWITTER_SECRET;

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
    }, tokens.generateToken, tokens.sendToken);


router.route('/auth/me')
  .get(middleware.authenticate, middleware.getCurrentUser, middleware.getOne);
    
module.exports = router;