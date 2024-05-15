const router = require('express').Router();
const movimientoInventarioController = require('../controllers/movimientoInventarioController');
const checkAuth = require('./check-auth');

//router.get('/:id_articulo_sucursal/:limit',checkAuth, movimientoInventarioController.);
router.post('/',checkAuth, movimientoInventarioController.createMovimientoInventario);


module.exports = router;