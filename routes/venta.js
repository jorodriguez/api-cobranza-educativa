const router = require('express').Router();
const ventaController = require('../controllers/ventaController');
const checkAuth = require('./check-auth');

//venta
router.post('/',checkAuth, ventaController.createVenta);
router.get('/ticket/:id',checkAuth, ventaController.getTicket);
router.get('/venta/:id',checkAuth, ventaController.getTicket);
router.put('/sucursal/:id',checkAuth, ventaController.getVentasSucursal);
router.put('/cancelar',checkAuth, ventaController.cancelarVenta);

module.exports = router;