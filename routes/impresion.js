const router = require('express').Router();
const impresionController = require('../controllers/impresionController');

const checkAuth = require('./check-auth');

//router.get('/credencial/:uidAlumno/:genero', checkAuth, impresionController.getFormatoCredencial);
router.get('/credencial/:uidAlumno/:format/:genero', impresionController.getFormatoCredencial);

module.exports = router;