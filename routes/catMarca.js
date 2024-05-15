const router = require('express').Router();
const catMarcaController = require('../controllers/catMarcaController');
const checkAuth = require('./check-auth');

router.get('/:coEmpresa',checkAuth, catMarcaController.getAll);
router.post('/',checkAuth, catMarcaController.createMarca);
router.put('/:id',checkAuth, catMarcaController.updateMarca);
router.patch('/:id',checkAuth, catMarcaController.deleteMarca);

module.exports = router;