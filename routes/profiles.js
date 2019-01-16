const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/hbs');

const Student = require('../models/Student');
const Profile = require('../models/Profile');

// @route   GET /profiles/createProfile
// @desc    Find profile and display profile edit page
// @access  Private
router.get('/createProfile', ensureAuthenticated, (req, res) => {
  Profile.find({ user: req.user.id }).then(profile => {
    res.render('profile/createProfile', { profile });
  });
});

// @route   GET /profiles/createRoster
// @desc    Find profile and display roster add page
// @access  Private
router.get('/createRoster', ensureAuthenticated, (req, res) => {
  Student.find({ user: req.user.id })
    .populate('user', ['-password'])
    .then(profile => {
      res.render('roster/add', { profile });
    });
});

// @route   GET /profile/my
// @desc    Find profile and display user profile details page
// @access  Private
router.get('/my', ensureAuthenticated, (req, res) => {
  Profile.find({ user: req.user.id })
    .then(profile => {
      res.render('profile/myprofile', { profile });
    })
    .catch(() => {
      req.flash('error_msg', 'Please setup your profile first');
      res.redirect('/users/dashboard');
    });
});

// @route   GET /profiles/findRoster
// @desc    Find profile and display student info
// @access  Private
router.get('/findRoster/:id', (req, res) => {
  Student.find({ user: req.params.id })
    .populate('user', ['-password'])
    .then(profile => {
      if (profile) {
        res.render('roster/add', { profile });
      }
    });
});

// @route   GET /profile/edit/:id
// @desc    Find profile by id and display edit details page
// @access  Private
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Profile.findOne({ user: req.params.id }).then(profile => {
    res.render('profile/createProfile', { profile });
  });
});

// @route   POST /profiles/add
// @desc    Create/edit profile and redirect to dashboard
// @access  Private
router.post('/add', ensureAuthenticated, (req, res) => {
  // Get user inputs
  const profileFields = {
    user: req.user.id,
    handle: req.body.handle,
    title: req.body.title
  };

  Profile.find({ user: req.user.id }).then(profile => {
    if (profile.handle) {
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
    } else {
      // If no user, then create one
      new Profile(profileFields)
        .save()
        .then(() => {
          req.flash('success_msg', 'Profile successfully created!');
          res.redirect('/users/dashboard');
        })
        .catch(err => res.json(err));
    }
  });
});

// @route   DELETE /profiles/roster/:id
// @desc    Remove roster from profile by roster id
// @access  Private
router.delete('/roster/:id', ensureAuthenticated, (req, res) => {
  Student.findOne({ user: req.user.id }).then(profile => {
    // Get remove index
    const removeIndex = profile.roster
      .map(item => item.id)
      .indexOf(req.params.id);

    // Splice out of array
    profile.roster.splice(removeIndex, 1);

    // Save
    profile.save().then(profile => res.redirect('/users/dashboard'));
  });
});

// @route   DELETE /profiles/:id
// @desc    Delete user and profile account
// @access  Private
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Profile.findOneAndDelete({ user: req.user.id })
    .then(() => {
      User.findOneAndDelete({ _id: req.user.id }).then(() => {
        req.flash('success_msg', 'User account deleted');
        res.redirect('/users/register');
      });
    })
    .catch(err => res.json(err));
});

module.exports = router;
