const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/hbs');

const User = require('../models/User');
const Profile = require('../models/Profile');

// Redirect to login user route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// Redirect to register user route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// @route   GET /products/dashboard
// @desc    Product Dashboard Route
// @access  Private
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Profile.find({ user: req.user.id })
    .populate('user', ['firstName', 'lastName'])
    .then(profile => {
      res.render('dashboard/index', { profile });
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Create user route
router.post('/register', (req, res) => {
  // Check for errors in the required form fields
  const { firstName, lastName, email, password } = req.body;
  let errors = [];

  if (!firstName || !lastName || !email || !password) {
    errors.push({ message: 'Oops! Please complete each field' });
  }

  if (password.length < 4) {
    errors.push({ message: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      firstName,
      lastName,
      email,
      password
    });
  }
  // Determine whether user email has already been used
  else
    User.findOne({ email }).then(user => {
      if (user) {
        req.flash('error_msg', 'Email already registered');
        res.redirect('/');
      } else {
        // Store users in the database
        const newUser = new User({
          firstName,
          lastName,
          email,
          password
        });

        // Use bcrypt to encrypt user password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser
              .save()
              .then(() => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in!'
                );
                res.redirect('/users/dashboard');
              })
              .catch(err => {
                console.log(err);
                return;
              }); // end of database storing
          });
        });
      }
    });
});

// Logout User
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

// Get users
router.get('/all', (req, res) => {
  Product.find({ user: req.user.id })
    .populate('product')
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// Delete User
router.delete('/delete', (req, res) => {
  User.findOneAndDelete({ _id: req.user.id })
    .then(() => res.json({ success: 'User was removed from the database' }))
    .catch(() =>
      res.json({ failure: 'Could not find the user in the database' })
    );
});

module.exports = router;
