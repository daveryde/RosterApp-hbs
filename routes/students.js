const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/hbs');

const Profile = require('../models/Profile');
const Student = require('../models/Student');

// @route   GET /students
// @desc    Find student by user
// @access  Private
router.get('/', (req, res) => {
  Student.find({ user: req.user._id }).then(student => res.json(student));
});

// @route   POST /students/new
// @desc    Create new student model and redirect ot create page
// @access  Private
router.post('/new', ensureAuthenticated, (req, res) => {
  const newStudents = new Student({
    user: req.user.id,
    classroom: req.body.classroom
  });

  newStudents
    .save()
    .then(student => {
      res.render('roster/add', { student });
    })
    .catch(err => res.json(err));
});

// @route   POST /students/add/roster
// @desc    Add to student roster
// @access  Private
router.post('/add/roster/', ensureAuthenticated, (req, res) => {
  Student.findOne({ user: req.user.id })
    .then(student => {
      const studentInfo = {
        teacher: req.user.id,
        name: req.body.name,
        number: req.body.number
      };

      student.roster.unshift(studentInfo);

      student
        .save()
        .then(student => res.redirect('/profiles/createRoster'))
        .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
});

router.delete('/:id', (req, res) => {
  Student.findOneAndDelete({ _id: req.params.id }).then(student => {
    res.redirect('/profiles/createRoster');
  });
});

module.exports = router;
