const router = require('express').Router();
const curso = require('../controllers/curso');
const semanasCurso = require('../controllers/semanasCurso');
const cargos = require('../controllers/cargos');

const checkAuth = require('./check-auth');

//periodosCurso
router.get('/curso/:uid', checkAuth, curso.getSeriesPeriodosCurso);
router.get('/meses/pendientes/:uidCurso/:idAlumno', checkAuth, cargos.obtenerMesesAdeudaMensualidad);
router.get('/semanas/pendientes/:uidCurso/:idAlumno', checkAuth, semanasCurso.getSemanasColegiaturasParaCargo);
router.get('/semanas/calculadas/:fecha_inicio/:numero_semanas/:co_empresa', semanasCurso.getSemanasCalculadasPreviewPagosCurso);


module.exports = router;