const router = require('express').Router();
const coFacturacionSucursalController = require('../controllers/coFacturacionSucursalController');
const checkAuth = require('./check-auth');

router.get('/:coSucursal', checkAuth, coFacturacionSucursalController.getAll);
router.get('/:coSucursal/adeudo', checkAuth, coFacturacionSucursalController.getAdeudoSucursal);
router.put('/:id', checkAuth, coFacturacionSucursalController.updateComprobante);

module.exports = router;