const router = require('express').Router();
const usuarioController = require('../controllers/usuario');
const checkAuth = require('./check-auth');


router.get('/:id_sucursal',checkAuth, usuarioController.getUsuariosPorSucursal);
router.get('/buscar/:id_usuario',checkAuth, usuarioController.buscarUsuarioPorId);
router.get('/asesores/:id_sucursal',checkAuth, usuarioController.getAsesoresPorSucursal);
router.get('/docentes/:id_sucursal',checkAuth, usuarioController.getDocentesPorSucursal);
router.post('/',checkAuth, usuarioController.crearUsuario);
router.post('/reiniciar-clave',checkAuth, usuarioController.reiniciarClave);
router.put('/', checkAuth,usuarioController.modificarUsuario);
router.put('/:id_usuario',checkAuth, usuarioController.desactivarUsuario);
router.put('/bloquear-acceso/:id_usuario',checkAuth, usuarioController.bloquearAccesoSistema);


module.exports = router;