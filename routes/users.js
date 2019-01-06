const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../config/keys');
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
  const { firstName, lastName, email, password } = req.body;
  let errors = [];

  if (!firstName || !lastName || !email || !password) {
    errors.push({ msg: 'Oops! Please complete each field' });
  }

  if (password.length < 4) {
    errors.push({ msg: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('../views/users/register', {
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

router.post('/login', (req, res) => {
  // Error check
  const { email, password } = req.body;
  let errors = [];

  if (!email || !password) {
    errors.push({ msg: 'Oops! Please complete each field' });
  }

  if (password.length < 4) {
    errors.push({ msg: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.status(400);
    res.render('../views/users/login', {
      errors,
      email,
      password
    });
  } else {
    // Find user by email
    User.findOne({ email })
      .then(user => {
        if (!user) {
          errors.push('No such email exists');
          res.status(404);
          res.render('../views/users/login', {
            errors,
            password
          });
        }

        // Check password
        // bcrypt.compare(password, user.password, (err, response) => {
        //   if (response == true) {
        //     res.status(200);
        //     // res.json({ msg: 'Success' });
        //     res.redirect('/products');
        //   } else {
        //     errors.push('Unauthorized');
        //     res.status(400);
        //     res.render('../views/users/login', {
        //       errors
        //     });
        //   }
        // });

        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
          if (isMatch) {
            // User matched
            const payload = {
              id: user.id,
              name: user.name
            };

            // Sign JWT Token
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              }
            );
          } else {
            errors.push({ msg: 'Password incorrect' });
            return res.render('../views/users/login', {
              errors
            });
          }
        });
      })
      .catch(err => {
        res.status(409).json(err);
      });
  }
});

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
