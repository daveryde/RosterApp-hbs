const express = require('express');
const router = express.Router();

// Results route
router.get('/', (req, res) => {
  res.render('cards/card');
});

router.post('/', (req, res) => {
  console.log(req);
});

module.exports = router;
