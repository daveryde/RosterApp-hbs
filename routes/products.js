const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/hbs');

// Load the product model
const Product = require('../models/Product');

// @route   GET /products/dashboard
// @desc    Product Dashboard Route
// @access  Private
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard/index');
});

// @route   GET /products/dashboard/roster
// @desc    Display all rosters list route
// @access  Private
router.get('/dashboard/roster', ensureAuthenticated, (req, res) => {
  Product.find()
    .then(product => {
      res.status(200);
      res.render('products/card', { product });
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// @route   GET /products/dashboard/roster
// @desc    Display users roster list route
// @access  Public
router.get('/roster/user/:id', (req, res) => {
  Product.findById({ _id: req.params.id })
    .then(product => {
      res.status(200).json(product);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// @route   GET /products/dashboard/roster/create
// @desc    Display create roster route
// @access  Private
router.get('/dashboard/roster/create', ensureAuthenticated, (req, res) => {
  res.render('products/create');
});

// @route   GET /products/dashboard/roster/class/:id
// @desc    Class specific roster route
// @access  Private
router.get('/dashboard/roster/class/:id', ensureAuthenticated, (req, res) => {
  // Find the product by request id and render to view
  const id = req.params.id;
  Product.findById({ _id: id })
    .populate('user', ['roster'])
    .then(product => {
      let { roster } = product.roster;
      console.log(roster);
      if (product) {
        res.status(200);
        res.render('products/create', {
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

// @route   POST /products/dashboard/roster/:id
// @desc    Class specific roster add product route
// @access  Private
router.post('/dashboard/roster/', ensureAuthenticated, (req, res) => {
  const rosterAdd = new Product({
    title: req.body.title,
    roster: [],
    user: req.user.id
  });

  // Save to the database
  rosterAdd
    .save()
    .then(product => res.json(product))
    .catch(err => {
      res.status(500).json(err);
    });
});

// @route   GET /products/dashboard
// @desc    Class specific roster add product route
// @access  Private
router.post('/', ensureAuthenticated, (req, res) => {
  // Find user by user id
  Product.findOne({ user: req.user.id })
    .then(product => {
      // Set the request values to the Product schema
      const newProduct = {
        name: req.body.name,
        number: req.body.number
      };

      // Add to roster array
      product.roster.unshift(newProduct);

      // Save product to the database and redirect to view
      product
        .save()
        .then(product => res.json(product))
        .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
});

// @route   DELETE /products/:id
// @desc    Product deleted route
// @access  Private
router.delete('/:id', ensureAuthenticated, (req, res) => {
  // Find product in database by id, then delete and redirect to view
  Product.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200);
      res.redirect('/products/dashboard/roster');
    })
    .catch(err => {
      res.status(409).json(err);
    });
});

module.exports = router;
