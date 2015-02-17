'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
  .get('/', passport.authenticate('facebook', {
    scope: ['email', 'public_profile', 'user_friends'],
    failureRedirect: '/login',
    session: false
  }))

  .get('/callback', passport.authenticate('facebook', {
    failureRedirect: '/login',
    session: false
  }), auth.setTokenCookie);

module.exports = router;