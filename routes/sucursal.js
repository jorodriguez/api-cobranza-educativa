const router = require('express').Router();
const sucursal = require('../controllers/sucursal');
const checkAuth = require('./check-auth');

//alumno
router.get('/:id', checkAuth, sucursal.getSucursalPorId);

module.exports = router;