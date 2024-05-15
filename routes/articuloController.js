const router = require('express').Router();
const articuloController = require('../controllers/articuloController');
const checkAuth = require('./check-auth');

router.get('/sucursal/:coSucursal',checkAuth, articuloController.getArticulosSucursal);
router.get('/:codigo/:coSucursal',checkAuth, articuloController.getArticuloCodigo);
router.get('/nombre/:nombre/:coSucursal',checkAuth, articuloController.getArticuloPorNombre);
router.get('/categoria/:catCategoria/:coSucursal',checkAuth, articuloController.getArticulosPorCategoria);
router.post('/',checkAuth, articuloController.createArticulo);
router.put('/:id',checkAuth, articuloController.updateArticulo);
router.patch('/:id',checkAuth, articuloController.deleteArticulo);


module.exports = router;