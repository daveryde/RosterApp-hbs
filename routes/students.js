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
router.post('/add/roster/:id', ensureAuthenticated, (req, res) => {
  Student.findOne({ _id: req.params.id })
    .then(student => {
      const studentInfo = {
        teacher: req.user.id,
        name: req.body.name,
        number: req.body.number
      };

      student.roster.unshift(studentInfo);

      student
        .save()
        .then(student => res.redirect(`/profiles/findRoster/${req.params.id}`))
        .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
});

router.delete('/:roster_id/:student_id', ensureAuthenticated, (req, res) => {
  Student.findOne({ _id: req.params.student_id })
    .then(student => {
      const personIndex = student.roster
        .map(person => person._id.toString())
        .indexOf(req.params.roster_id);

      // console.log(student.roster[personIndex]._id);

      student.roster.splice(personIndex, 1);

      student
        .save()
        .then(student =>
          res.redirect(`/profiles/findRoster/${req.params.student_id}`)
        );
    })
    .catch(err => res.json(err));
});

module.exports = router;
