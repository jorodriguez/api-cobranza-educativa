
const router = require('express').Router();
const authController = require('../auth/AuthController');

router.post('/login', authController.login);

module.exports = router;