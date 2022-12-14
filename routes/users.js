const express = require('express');
const router = express.Router();
const { forwardAuthenticated } = require('../config/auth');

const {
  registerGet,
  registerPost,
  loginGet,
  loginPost,
  logoutGet
} = require('../controllers/usersControllers');

router.get('/login', forwardAuthenticated, loginGet);
router.post('/login', loginPost)

router.get('/register', forwardAuthenticated, registerGet);
router.post('/register', registerPost);

router.get('/logout', logoutGet)

module.exports = router;
