const router = require('express').Router();
const siUsuarioSucursalRolController = require('../controllers/siUsuarioSucursalRolController');
const checkAuth = require('./check-auth');

router.get('/:idUsuario/:idSucursal',checkAuth, siUsuarioSucursalRolController.getAllRolesUsuario);
router.put('/:idUsuarioGenero',checkAuth, siUsuarioSucursalRolController.cambiarEstadoRol);

module.exports = router;