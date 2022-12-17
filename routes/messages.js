const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const {
  messageGet,
  messagePost,
  messageDeleteGet,
  messageDeletePost,
  messageUpdateGet,
  messageUpdatePost,
} = require('../controllers/messageControllers');

router.get('/', ensureAuthenticated, messageGet);
router.post('/', messagePost);

router.get('/:id', ensureAuthenticated, messageDeleteGet);
router.post('/:id', messageDeletePost);

router.get('/update/:id', ensureAuthenticated, messageUpdateGet);
router.post('/update/:id', messageUpdatePost);

module.exports = router;