const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const passport = require('passport');
const methodOverride = require('method-override');

// Initial express
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Load routes
const products = require('./routes/products');
const users = require('./routes/users');
const profiles = require('./routes/profile');

// Passport Config
require('./config/passport')(passport);

// Load database keys
const db = require('./config/keys').mongoURI;

// Connect to the database
mongoose
  .connect(
    db,
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

const { formatDate, isAuthor } = require('./helpers/hbs');

// Load Handlebars middleware
app.engine(
  'handlebars',
  exphbs({
    helpers: {
      formatDate,
      isAuthor
    },
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Routes
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Roster App'
  });
});

app.get('/about', (req, res) => {
  res.render('home');
});

app.use('/products', products);
app.use('/users', users);
app.use('/profiles', profiles);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
