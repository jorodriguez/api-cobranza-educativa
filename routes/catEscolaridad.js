const router = require('express').Router();
const catEscolaridad = require('../controllers/catEscolaridad');
const checkAuth = require('./check-auth');

router.get('/',checkAuth, catEscolaridad.getEscolaridad);

module.exports = router;