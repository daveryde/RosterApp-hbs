const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
require('../models/User');
const User = mongoose.model('user');

// Passport Local Strategy Boilerplate
module.exports = function(passport) {
  //Error Check
  const errors = [];

  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match User
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          errors.push({ msg: 'No User Found' });
          return done(null, false, { errors });
        }

        // Bcrypt - Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            throw err;
          }
          if (isMatch) {
            return done(null, user);
          } else {
            errors.push({ msg: 'Password Incorrect' });
            return done(null, false, { errors });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
