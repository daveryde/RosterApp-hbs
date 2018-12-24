const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load person model
require('../models/Person');
const Person = mongoose.model('people');

// Person retrival route
router.get('/:id', (req, res) => {
  const id = req.params.id;
  Person.findById(id)
    .then(person => {
      console.log(person);
      if (person) {
        res.status(200).json(person);
      } else {
        res.status(404).json({ message: 'No one found with that id' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  const people = new Person({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    number: req.body.number
  });
  people
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Person.deleteOne({ _id: id }).then(person => {
    res
      .status(200)
      .json({ message: id + 'Successfully removed' })
      .catch(err => {
        res.status(404).json(err);
      });
  });
});

module.exports = router;
