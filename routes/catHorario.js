const router = require('express').Router();
const catHorario = require('../controllers/catHorario');
const checkAuth = require('./check-auth');

router.get('/:id_empresa',checkAuth, catHorario.getHorarios);

module.exports = router;