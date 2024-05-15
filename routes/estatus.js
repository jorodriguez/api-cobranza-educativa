const router = require('express').Router();
const estatus = require('../controllers/estatus');
const checkAuth = require('./check-auth');

router.get('/',checkAuth, estatus.getEstatus);

module.exports = router;