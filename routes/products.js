const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load product model
require('../models/Product');
const Product = mongoose.model('product');

// Product retrieval route
router.get('/:id', (req, res) => {
  const id = req.params.id;
  Product.findById(id)
    .then(product => {
      // console.log(product);
      if (product) {
        res.status(200);
        res.render('../views/cards/individual', {
          product
        });
      } else {
        res.status(404);
        res.render({
          error: 'No one found with that id'
        });
      }
    })
    .catch(err => {
      res.status(500);
      res.render({
        error: err
      });
    });
});

// Product added route
router.post('/', (req, res) => {
  // Set the request values to the Product schema
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    number: req.body.number
  });

  // Save product to the database
  product
    .save()
    .then(result => {
      res.status(201);
      res.redirect('/results');
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Product deleted route
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Product.deleteOne({ _id: id })
    .then(product => {
      // console.log(product + "was deleted")
      res.redirect('/results');
    })
    .catch(err => {
      res.status(409).json(err);
    });
});

module.exports = router;
