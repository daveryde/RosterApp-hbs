const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load person model
require('../models/Person');
const Person = mongoose.model('people');

// Person retrival route
router.get('/', (req, res) => {
  let person = [];

  if (req.body) {
    person.push({
      text: 'Person recieved',
      name: req.body.name
    });
  }

  if (person.length > 0) {
    res.render('cards/card', {
      text: text,
      name: name
    });
  }
});

module.exports = router;
