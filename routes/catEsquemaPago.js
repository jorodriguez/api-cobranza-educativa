const router = require('express').Router();
const catEsquemaPago = require('../controllers/catEsquemaPagoController');
const checkAuth = require('./check-auth');

router.get('/', checkAuth, catEsquemaPago.getEsquemaPago);

module.exports = router;