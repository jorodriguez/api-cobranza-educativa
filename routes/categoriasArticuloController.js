const router = require('express').Router();
const articuloController = require('../controllers/articuloController');
const checkAuth = require('./check-auth');

//--es para mostrar las categorias en el carrito de compras en los filtros
router.get('/:coSucursal',checkAuth, articuloController.getCategoriaArticulos);

module.exports = router;