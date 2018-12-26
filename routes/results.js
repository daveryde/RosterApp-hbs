const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load product model
require('../models/Product');
const Product = mongoose.model('product');

// Results route
router.get('/', (req, res) => {
  Product.find()
    .exec()
    .then(product => {
      res.status(200);
      res.render('../views/cards/card', {
        product
      });
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

module.exports = router;
