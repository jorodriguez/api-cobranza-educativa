const router = require('express').Router();
const especialidad = require('../controllers/especialidad');
const checkAuth = require('./check-auth');

//especialidad
router.get('/:id_empresa/:id_sucursal',checkAuth, especialidad.getEspecialidad);
router.get('/:id',checkAuth, especialidad.findById);
router.post('/',checkAuth, especialidad.createEspecialidad);
router.put('/:id',checkAuth, especialidad.updateEspecialidad);
router.patch('/:id',checkAuth, especialidad.deleteEspecialidad);

module.exports = router;