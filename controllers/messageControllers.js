const { body, validationResult } = require('express-validator');
const Message = require('../models/Messages');

const messageGet = (req, res, next) => {
  Message.find()
    .select()
    .exec(function (error, messages) {
      if (error) next(error);
      res.render('message_page', { name: req.user, title: 'Message', messages });
      console.log(messages)
    });
};

const messagePost = [
  body('title')
    .exists()
    .withMessage('Name of product must be specified.')
    .trim()
    .isLength({ min: 3, max: 20 })
    .escape(),
  body('comment')
    .exists()
    .trim()
    .isLength({ min: 3, max: 200 })
    .escape()
    .withMessage('Name of company must be specified.'),
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
          name: req.user,
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

const messageDeleteGet = (req, res, next) => {
  console.log(req.user)
  const admin = req.user.isAdmin
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
        name: req.user,
        message,
      });
    });
  } else {
    res.status(500).send('You need to be admin.')
  }
}

const messageDeletePost = (req, res, next) => {
  const trimID = req.body.id.trim();
  Message.findByIdAndRemove(trimID, function deleteProd(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/messages');
  });
}

module.exports = {
  messageGet,
  messagePost,
  messageDeleteGet,
  messageDeletePost,
};
