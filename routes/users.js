const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const router = express.Router();

require('../models/User');
const User = mongoose.model('user');

// Test route
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// Get users
router.get('/', (req, res) => {
  User.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// Redirect to register user route
router.get('/register', (req, res) => {
  res.render('../views/users/register');
});

// Redirect to login user route
router.get('/login', (req, res) => {
  res.render('../views/users/login');
});

// Create user route
router.post('/register', (req, res) => {
  // Check for errors in the required form fields
  let errors = [];

  if (
    req.body.firstName === '' ||
    req.body.lastName === '' ||
    req.body.email === '' ||
    req.body.password === ''
  ) {
    errors.push('Oops! Please complete each field');
  }

  if (req.body.password.length < 4) {
    errors.push('Password must be at least 4 characters');
  }

  if (errors.length > 0) {
    res.render('../views/users/register', {
      errors: errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    });
  }
  // Determine whether user email has already been used
  else
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        res.redirect('/products');
      } else {
        // Store users in the database
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password
        });

        // Use bcrypt to encrypt user password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                console.log(user);
                res.redirect('/products');
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

router.post('/login', (req, res) => {});

module.exports = router;
