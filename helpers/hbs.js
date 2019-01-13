const moment = require('moment');

module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Not Authorized');
    res.redirect('/users/login');
  },
  formatDate: function(date, format) {
    return moment(date).format(format);
  },
  isAuthor: function(rosterId, userId) {
    if (rosterId === userId) {
      return `
      {{!-- Delete button --}}
      <div class="row justify-content-around">
        <form action="/products/roster/{{id}}?_method=DELETE" method="post">
          <input type="hidden" name="_method" value="DELETE">
          <button type="submit" class="btn btn-danger btn-block print-hidden">
            Delete</button>
        </form>
        <a href="/products/roster/{{id}}" class="btn btn-success">View Roster</a>
      </div>`;
    } else {
      return null;
    }
  }
};
