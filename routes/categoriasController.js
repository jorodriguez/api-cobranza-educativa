const router = require('express').Router();
const catCategoriaController = require('../controllers/catCategoriaController');
const checkAuth = require('./check-auth');

router.get('/:coEmpresa',checkAuth, catCategoriaController.getAll);
router.post('/',checkAuth, catCategoriaController.createCategoria);
router.put('/:id',checkAuth, catCategoriaController.updateCategoria);
router.patch('/:id',checkAuth, catCategoriaController.deleteCategoria);

module.exports = router;