const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/hbs');

const User = require('../models/User');
const Profile = require('../models/Profile');

router.get('/createProfile', (req, res) => {
  Profile.find({ user: req.user.id }).then(profile => {
    res.render('dashboard/createProfile', { profile });
  });
});

router.get('/createRoster', (req, res) => {
  Profile.find({ user: req.user.id }).then(profile => {
    res.render('roster/create', { profile });
  });
});

router.get('/my', (req, res) => {
  Profile.find({ user: req.user.id })
    .then(profile => {
      res.render('dashboard/myprofile', { profile });
    })
    .catch(() => {
      req.flash('error_msg', 'Please setup your profile first');
      res.redirect('/users/dashboard');
    });
});

router.get('/findRoster/:id', (req, res) => {
  Profile.find({ user: req.user.id })
    .populate('user')
    .then(profile => {
      if (profile) {
        res.status(200).render('roster/create', { profile });
      }
      // const rosterIndex = profile.roster
      //   .map(roster => roster.id.toString())
      //   .indexOf(req.params.id);
    });
});

router.get('/edit/:id', (req, res) => {
  Profile.findOne({ user: req.params.id }).then(profile => {
    res.render('dashboard/createProfile', { profile });
  });
});

router.post('/add', ensureAuthenticated, (req, res) => {
  // Get user inputs
  const profileFields = {
    user: req.user.id,
    handle: req.body.handle,
    title: req.body.title
  };

  // If no user, then create one
  new Profile(profileFields)
    .save()
    .then(() => {
      req.flash('success_msg', 'Profile successfully created!');
      res.redirect('/users/dashboard');
    })
    .catch(err => res.json(err));
});

router.post('/add/roster', ensureAuthenticated, (req, res) => {
  Profile.findOne({ user: req.user.id }).then(profile => {
    const newRoster = {
      user: req.user.id,
      name: req.body.name,
      number: req.body.number,
      title: req.body.title
    };

    profile.roster.push(newRoster);

    profile.save().then(profile => {
      res.redirect('/profiles/createRoster');
    });
  });
});

router.put('/edit/', (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      profile.title = req.body.title;
      profile.handle = req.body.handle;

      profile.save().then(() => {
        req.flash('success_msg', 'Profile successfully updated');
        res.redirect('/users/dashboard');
      });
    })
    .catch(err => res.json(err));
});

router.delete('/:id', (req, res) => {
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