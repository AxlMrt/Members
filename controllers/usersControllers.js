const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const registerGet = (req, res, next) => {
  res.render('register');
};

const registerPost = (req, res, next) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please, fill in all fields.' });
  }

  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match.' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters.' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: 'Email is already registered.' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in.'
                );
                res.redirect('/users/login');
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
};

const loginGet = (req, res, next) => {
  res.render('login');
};

const loginPost = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
};

const logoutGet = (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err) }
    req.flash('success_msg', 'You are logout');
    res.redirect('/users/login');
  });
};

module.exports = {
  registerGet,
  registerPost,
  loginGet,
  loginPost,
  logoutGet,
};
