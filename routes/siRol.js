const router = require('express').Router();
const rolController = require('../controllers/siRolController');
const checkAuth = require('./check-auth');

router.get('/',checkAuth, rolController.getAll);

module.exports = router;