const router = require('express').Router();
const  utilerias = require('../controllers/utilerias');
const checkAuth = require('./check-auth');

//utilerias
//router.get('/periodos-curso/:iud',checkAuth, utilerias.getSeriesPeriodosCurso);

module.exports = router;