const express = require('express');
const authController = require('../controllers/AuthController');
const { authRequired } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.post('/login', authLimiter, (req, res, next) => authController.login(req, res, next));
router.get('/me', authRequired, (req, res, next) => authController.me(req, res, next));

module.exports = router;
