const express = require('express');
const path = require('path');
const logger = require('morgan')
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const connectDB = require('./config/db/connect');
const PORT = process.env.PORT || 3000;

require('dotenv').config();
require('./config/passport')(passport);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const messageRouter = require('./routes/messages');

//Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messageRouter)

const start = async (req, res) => {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log('MongoDB connected.');
    app.listen(PORT, () => {
      console.log(`Server currently running on port ${PORT}.`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
