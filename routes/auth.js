const express = require('express');

const router = express.Router();
const passport = require('../middleware/auth');

router.get(
  '/login',
  passport.authenticate('google', {
    scope: ['email profile openid'],
    accessType: 'offline',
    prompt: 'consent',
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    if (req.user.banned) {
      return res.redirect('/logout');
    }
    return res.redirect(process.env.CLIENT_URL);
  },
);

router.get('/me', (req, res) => {
  if (!req.user) {
    return res.json(null);
  }
  const {
    googleId, googleAccessToken, googleRefreshToken, ...result
  } = req.user.toJSON();

  return res.json(result);
});

router.get('/logout', (req, res) => {
  if (!req.user) {
    return res.redirect(process.env.CLIENT_URL);
  }
  req.session.destroy();
  req.logout();
  return res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
