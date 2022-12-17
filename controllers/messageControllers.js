const async = require('async');
const Message = require('../models/Messages');
const { body, validationResult } = require('express-validator');

const messageGet = (req, res, next) => {
  Message.find()
    .select()
    .exec(function (error, messages) {
      if (error) next(error);
      res.render('message_page', {
        user: req.user,
        title: 'Message',
        subTitle: `Leave us a comment, ${req.user.name}`,
        messages,
      });
      console.log(messages);
    });
};

const messagePost = [
  body('title')
    .exists()
    .withMessage('Name of message must be specified.')
    .trim()
    .isLength({ min: 3, max: 20 })
    .escape(),
  body('comment')
    .exists()
    .trim()
    .isLength({ min: 3, max: 200 })
    .escape()
    .withMessage('A content must be specified.'),
  (req, res, next) => {
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      comment: req.body.comment,
    });

    if (!errors.isEmpty()) {
      //there are errors, render the form again with remarks considered.
      Message.find().exec(function (err, results) {
        if (err) {
          return next(err);
        }
        res.render('message_page', {
          user: req.user,
          title: 'Message',
          errors: errors.array(),
          messages: message,
        });
      });
      return;
    } else {
      message.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/messages');
      });
    }
  },
];

const messageUpdateGet = (req, res, next) => {
  async.parallel(
    {
      message(cb) {
        Message.findById(req.params.id).exec(cb);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.message === null) {
        const err = new Error('Message not found');
        err.status(404);
        return next(err);
      }
      res.render('update_page', {
        title: 'Message',
        subTitle: 'Are you sure you want to update this message ?',
        message: results.message
      });
    }
  );
};

const messageUpdatePost = [
  body('title')
    .exists()
    .withMessage('Name of message must be specified.')
    .trim()
    .isLength({ min: 3, max: 20 })
    .escape(),
  body('comment')
    .exists()
    .trim()
    .isLength({ min: 3, max: 200 })
    .escape()
    .withMessage('A content must be specified.'),

  (req, res, next) => {
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      comment: req.body.comment,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      Message.find().exec(function (err, results) {
        if (err) {
          return next(err);
        }
        res.render('message_page', {
          title: 'Message',
          message: results.message,
          errors: errors.array(),
        });
      });
      return;
    } else {
      Message.findByIdAndUpdate(
        req.params.id,
        message,
        {},
        function (err, themessage) {
          if (err) {
            return next(err);
          }
          res.redirect('/messages');
        }
      );
    }
  },
];

const messageDeleteGet = (req, res, next) => {
  console.log(req.user);
  const admin = req.user.isAdmin;
  if (admin) {
    Message.findById(req.params.id).exec(function (err, message) {
      if (err) {
        return next(err);
      }
      if (message === null) {
        res.redirect('/messages');
      }
      res.render('delete_page', {
        title: 'Message',
        user: req.user,
        subTitle: 'Are you sure you want to update this message ?',
        message,
      });
    });
  } else {
    res.status(500).send('You need to be admin.');
  }
};

const messageDeletePost = (req, res, next) => {
  const trimID = req.body.id.trim();
  Message.findByIdAndRemove(trimID, function deleteProd(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/messages');
  });
};

module.exports = {
  messageGet,
  messagePost,
  messageUpdateGet,
  messageUpdatePost,
  messageDeleteGet,
  messageDeletePost,
};
