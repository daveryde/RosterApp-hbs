const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

require('../models/User');
const User = mongoose.model('user');

router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// Get users
router.get('/', (req, res) => {
  User.find()
    .then(users => {
      res.status(200);
      res.json(users);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// Redirect to register user route
router.get('/register', (req, res) => {
  res.render('../views/users/register');
});

// Create user route
router.post('/', (req, res) => {
  let errors = [];

  if (req.body.firstName.value === '') {
    errors.push({ message: 'Please enter your first name' });
  }
  if (req.body.lastName.value === '') {
    errors.push({ message: 'Please enter your last name' });
  }
  if (req.body.email.value === '') {
    errors.push({ message: 'Please enter an email address' });
  }
  if (req.body.password.value === '') {
    errors.push({ message: 'Please enter a password' });
  }

  if (errors > 0) {
    res.render('../views/users/register', {
      errors: errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        res.redirect('/');
      } else {
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password
        });

        newUser
          .save()
          .then(user => {
            res.status(201);
            res.json(user);
          })
          .catch(err => {
            res.status(400).json(err);
          });
      }
    });
  }
});

module.exports = router;
