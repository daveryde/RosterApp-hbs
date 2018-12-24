const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load person model
require('../models/Person');
const Person = mongoose.model('people');

// Results route
router.get('/', (req, res) => {
  Person.find()
    .then(person => {
      console.log(person);
      res.status(200).json(person);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

module.exports = router;
