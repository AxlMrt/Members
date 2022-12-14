const express = require('express');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const router = express.Router();

const { indexGet, dashboardGet } = require('../controllers/indexControllers');

router.get('/', forwardAuthenticated, indexGet);

router.get('/dashboard', ensureAuthenticated, dashboardGet);

module.exports = router;
