const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load person model
require('../models/Person');
const Person = mongoose.model('people');

// Person retrival route
router.get('/', (req, res) => {
  if (!req.body) return res.sendStatus(400);

  res.send('welcome, ' + req.body.name);
});

module.exports = router;
