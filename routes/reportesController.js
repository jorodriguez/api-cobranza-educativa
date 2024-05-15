const router = require('express').Router();
const reporteAlumnosController = require('../controllers/reporteAlumnosController');
const reporteDashboardController = require('../controllers/reporteDashboardController');
const reportePagosController = require('../controllers/reportePagosController');
const reporteAlumnosCobrarController = require('../controllers/reporteAlumnosCobrarController');
const cargos = require('../controllers/cargos');
const reporte = require('../controllers/reporte');

const checkAuth = require('./check-auth');

router.get('/alumnos/:uidCurso', checkAuth, reporteAlumnosController.getReporteListaAlumnos);
router.get('/alumnos/html/:uidCurso/usuario/:idUsuario', checkAuth, reporteAlumnosController.getHtmlReporteListaAlumnos);

router.get('/contadores/:coEmpresa/sucursal/:coSucursal', checkAuth, reporteDashboardController.getContadoresDashboard);
router.get('/totales-cargos/:coEmpresa/sucursal/:coSucursal', checkAuth, reporteDashboardController.getTotalesCargos);

router.get('/totales-inscripciones/:coEmpresa/sucursal/:coSucursal', checkAuth, reporteDashboardController.getTotalesInscripciones);

router.get('/top-alumnos-deudores/:coEmpresa/sucursal/:coSucursal', checkAuth, reporteDashboardController.getTopAlumnosDeudores);

router.get('/totales-adeudos-por-curso/:coEmpresa/sucursal/:coSucursal', checkAuth, reporteDashboardController.getTotalAdeudoPorCurso);

router.get('/estado-cuenta-detallado/:uidAlumno', checkAuth, reportePagosController.getHtmlReporteEstadoCuentaDetallado);

router.get('/estado-cuenta/:id_alumno', checkAuth, cargos.obtenerEstadoCuentaAlumno);

router.get('/cobranza/alumnos/:coSucursal', checkAuth, reporteAlumnosCobrarController.getReporteListaAlumnosCobrar);


//modulo de reportes
router.get('/lista-reportes', checkAuth, reporte.getReportes);
router.put('/ejecucion-reporte', checkAuth, reporte.getEjecucionReporte);

router.get('/inscripciones-por-agente/:idSucursal/:idUsuario', checkAuth, reporte.getReporteInscritosPorAgente);



module.exports = router;