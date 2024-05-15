const router = require('express').Router();
const usuarioService = require('../controllers/usuario');
const checkAuth = require('./check-auth');
const reporteAsistenciaUsuario = require('../controllers/reporte_asistencia_usuario');


router.post('/',usuarioService.desactivarUsuarioReporte);
router.get('/:id_sucursal',checkAuth,reporteAsistenciaUsuario.getUsuariosAsistencias);

module.exports = router;