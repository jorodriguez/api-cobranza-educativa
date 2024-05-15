const router = require('express').Router();
const catUnidadMedidaController = require('../controllers/catUnidadMedidaController');
const checkAuth = require('./check-auth');

router.get('/:coEmpresa',checkAuth, catUnidadMedidaController.getAll);
router.post('/',checkAuth, catUnidadMedidaController.createUnidadMedida);
router.put('/:id',checkAuth, catUnidadMedidaController.updateUnidadMedida);
router.patch('/:id',checkAuth, catUnidadMedidaController.deleteUnidadMedida);

module.exports = router;