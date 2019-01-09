const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { isAuthenticated } = require('../helpers/hbs');

// Load product model
require('../models/Product');
const Product = mongoose.model('product');

// Product Dashboard
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('../views/dashboard/dashboard');
});

// All products retrival route
router.get('/dashboard/roster', isAuthenticated, (req, res) => {
  Product.find()
    .exec()
    .then(product => {
      res.status(200);
      res.render('../views/products/card', {
        product
      });
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// Product retrieval route
router.get('/:id', isAuthenticated, (req, res) => {
  // Find the product by request id and render to view
  const id = req.params.id;
  Product.findById(id)
    .then(product => {
      // console.log(product);
      if (product) {
        res.status(200);
        res.render('../views/products/individual', {
          product
        });
      } else {
        res.status(404);
        res.render('/', {
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
router.post('/', isAuthenticated, (req, res) => {
  // Set the request values to the Product schema
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    number: req.body.number
  });

  // Save product to the database and redirect to view
  product
    .save()
    .then(() => {
      res.status(201);
      res.render('../views/products/individual', {
        errors
      });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Product deleted route
router.delete('/:id', isAuthenticated, (req, res) => {
  // Find product in database by id, then delete and redirect to view
  Product.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200);
      res.redirect('/products');
    })
    .catch(err => {
      res.status(409).json(err);
    });
});

module.exports = router;
