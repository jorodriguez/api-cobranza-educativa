const router = require('express').Router();
const asistenciaUsuario = require('../controllers/asistencia_usuario');
const reporteAsistenciaUsuario = require('../controllers/reporte_asistencia_usuario');
const checkAuth = require('./check-auth');

router.get('/por_entrar/:id_sucursal',checkAuth, asistenciaUsuario.getListaUsuarioPorEntrar);
router.get('/por_salir/:id_sucursal',checkAuth, asistenciaUsuario.getListaUsuarioPorSalir);
router.post('/entrada',checkAuth, asistenciaUsuario.registrarEntradaUsuario);
router.post('/salida',checkAuth, asistenciaUsuario.registrarSalidaUsuario);

router.get('/reporte_mes/:id_sucursal/:fecha_inicio/:fecha_fin',checkAuth, asistenciaUsuario.getListaFaltasUsuariosSucursalRangoFecha);
router.get('/usuario/:id_usuario/:fecha_inicio/:fecha_fin', checkAuth,asistenciaUsuario.getDetalleFaltasUsuariosRangoFecha);
//--filtros para usar en el reporte de sueldos
router.get('/filtros_anios/:co_empresa',checkAuth, asistenciaUsuario.getAniosFiltroAsistenciasUsuarios);
router.get('/filtros_quincenas/:co_empresa/:anio',checkAuth, asistenciaUsuario.getMesesFiltroAsistenciasUsuarios);
// reporte de asistencia de usuarios por rh
router.get('/reporte_rh/:id_sucursal/:fecha_inicio/:fecha_fin',checkAuth,reporteAsistenciaUsuario.getReporteAsistenciaUsuario);

module.exports = router;