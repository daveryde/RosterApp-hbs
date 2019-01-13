const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/hbs');

// Load the product and user model
const Product = require('../models/Product');

// @route   GET /products/dashboard/roster
// @desc    Display all rosters list route
// @access  Private
router.get('/dashboard/roster', ensureAuthenticated, (req, res) => {
  Product.find({ user: req.user.id })
    .populate('user')
    .then(product => {
      console.log(product);
      res.render('dashboard/index', {
        product: product
      });
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

// @route   GET /products/dashboard/roster/class/:id/roster_id
// @desc    Class specific roster route
// @access  Private
router.get('/dashboard/roster/:roster_id', ensureAuthenticated, (req, res) => {
  // Find the product by request id and render to view
  Product.findById({ _id: req.params.id })
    .then(product => {
      if (
        product.roster.filter(
          roster => roster._id.toString() === req.params.roster_id
        ).length === 0
      ) {
        return res.status(404).json({ rosternotexist: 'No roster to show' });
      }

      if (
        product.roster.filter(
          roster => roster._id.toString() === req.params.roster_id
        ).length === 1
      ) {
        const result = product.roster.map(item => {
          return item;
        });
        return res.status(200).json({ result });
      }
    })
    .catch(err => {
      res.status(500);
      res.render({
        error: err
      });
    });
});

// @route   GET /products/dashboard/roster
// @desc    Display the users list of rosters route
// @access  Public
router.get('/roster/user/:id', (req, res) => {
  Product.findById({ _id: req.params.id })
    .populate('user')
    .then(product => {
      res.status(200).json(product);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// @route   GET /products/dashboard/roster/class/:id/:user_id
// @desc    Class specific roster route
// @access  Private
router.get('/roster/:id', ensureAuthenticated, (req, res) => {
  // Find the product by request id and render to view
  Product.findById({ _id: req.params.id })
    .populate('user')
    .then(product => {
      if (!product) {
        res.status(404).json({ doesnotexist: 'No roster with that id' });
      }
      res.status(200).render('products/create', { product });
    })
    .catch(err => {
      res.status(500);
      res.render({
        error: err
      });
    });
});

// @route   POST /products/dashboard/roster/
// @desc    Class specific roster add product route
// @access  Private
router.post('/dashboard/roster', ensureAuthenticated, (req, res) => {
  // Find the user in the database
  const rosterAdd = new Product({
    user: req.user.id,
    program: req.body.program
  });

  // Save to the database
  rosterAdd
    .save()
    .then(() => res.redirect('/dashboard/roster'))
    .catch(err => {
      res.status(500).json(err);
    });
});

// @route   POST /products/
// @desc    Class specific roster add product route
// @access  Private
router.post('/:product_id', ensureAuthenticated, (req, res) => {
  // Find user by user id
  Product.findOne({ _id: req.params.product_id })
    .then(product => {
      // Set the request values to the Product schema
      const newProduct = {
        name: req.body.name,
        number: req.body.number,
        rosterUser: req.user.id
      };

      // Add to roster array
      product.roster.unshift(newProduct);

      // Save product to the database and redirect to view
      product
        .save()
        .then(product => res.render('products/create', { product }))
        .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
});

// @route   DELETE /products/:id
// @desc    Product deleted route
// @access  Private
router.delete('/roster/:id', ensureAuthenticated, (req, res) => {
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

// @route   DELETE /products/:id
// @desc    Product roster deleted route
// @access  Private
router.delete('/:roster_id', ensureAuthenticated, (req, res) => {
  // Find product in database by id, then delete and redirect to view
  Product.findOne({ user: req.user.id })
    .then(product => {
      if (
        product.roster.filter(
          roster => roster._id.toString() === req.params.roster_id
        ).length === 0 &&
        req.user.id === _id
      ) {
        req.flash('error_msg', 'Unauthorized');
      }
      // Get remove index
      const removeIndex = product.roster
        .map(item => item._id.toString())
        .indexOf(req.params.roster_id);

      // Splice roster out of array
      product.roster.splice(removeIndex, 1);

      product
        .save()
        .then(() => res.redirect('/dashboard/roster'))
        .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
});

module.exports = router;
