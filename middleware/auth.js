const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const UserController = require('../src/user/user.controller');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UserController.getById(id).then(
    (user) => {
      done(null, user);
    },
    (err) => {
      done(err, null);
    },
  );
});

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER}/auth/google/callback`,
  },
  (accessToken, refreshToken, profile, done) => {
    const user = {};

    user.name = profile.displayName;
    user.email = profile.email;
    user.picture = profile.photos[0].value.replace('?sz=50', '');
    user.googleId = profile.id;
    user.googleAccessToken = accessToken;
    user.googleRefreshToken = refreshToken;

    UserController.updateOrCreate(user).then(newUser => done(null, newUser));
  },
));

module.exports = passport;
