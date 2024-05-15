const router = require('express').Router();
const cargos = require('../controllers/cargos');
const checkAuth = require('./check-auth');

router.get('/colegiaturas/:id_sucursal',checkAuth, cargos.getColegiaturasPendientesCobranza);

module.exports = router;