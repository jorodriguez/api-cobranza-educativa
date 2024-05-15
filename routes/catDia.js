const router = require('express').Router();
const catDias = require('../controllers/catDias');
const checkAuth = require('./check-auth');


router.get('/:id_empresa',checkAuth, catDias.getDias);

module.exports = router;