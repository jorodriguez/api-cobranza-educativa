const router = require('express').Router();
const catMateria = require('../controllers/catMateria');
const checkAuth = require('./check-auth');


router.get('/:id_especialidad',checkAuth, catMateria.getMateriasEspecialidad);

module.exports = router;