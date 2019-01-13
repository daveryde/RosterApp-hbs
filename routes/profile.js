const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const { ensureAuthenticated } = require('../helpers/hbs');

const User = require('../models/User');
const Profile = require('../models/Profile');

router.get('/createProfile', (req, res) => {
  res.render('dashboard/createProfile');
});

router.get('/my', (req, res) => {
  Profile.find({ user: req.user.id })
    .populate('user')
    .then(profile => {
      res.render('dashboard/myprofile', { profile });
    });
});

router.get('/find', (req, res) => {
  Profile.find().then(profiles => {
    res.status(200).json(profiles);
  });
});

router.post('/add', ensureAuthenticated, (req, res) => {
  // Get user inputs
  const profileFields = {};
  profileFields.user = req.user.id;
  if (profileFields.handle) profileFields.handle = req.body.handle;
  if (profileFields.title) profileFields.title = req.body.title;
  console.log(profileFields);

  Profile.findOne({ user: req.user.id })
    .then(user => {
      // Update user if user exists
      if (user) {
        Profile.findOneAndUpdate({
          user: req.user.id,
          $set: profileFields,
          new: true
        }).then(profile => res.json(profile));
      } else {
        // Check handle to prevent duplicate handles
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            req.flash('error_msg', 'Handle is already in use. :(');
            res.status(400).json({ handleerror: 'Handle is already in use' });
          }

          // If no user, then create one
          new Profile(profileFields).save().then(profile => {
            req.flash('success_msg', 'Profile successfully created!');
            res.redirect('/products/dashboard/roster');
          });
        });
      }
    })
    .catch(err => res.json(err));
});

router.get('/:id', (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        req.flash('success_msg', 'User account deleted');
        res.redirect('/users/register');
      });
    })
    .catch(err => res.json(err));
});

module.exports = router;
