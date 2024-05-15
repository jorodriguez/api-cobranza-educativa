const router = require('express').Router();
const curso = require('../controllers/curso');
const checkAuth = require('./check-auth');

//curso
router.post('/',checkAuth, curso.createCurso);
router.post('/iniciar',checkAuth, curso.iniciarCurso);
router.put('/eliminar/:id',checkAuth, curso.deleteCurso);
router.put('/cerrar/:id',checkAuth, curso.cerrarInscripcionesCurso);
router.put('/abrir/:id',checkAuth, curso.abrirInscripcionesCurso);
router.put('/:id',checkAuth, curso.updateCurso);
router.get('/sucursal/:id',checkAuth, curso.getCursosSucursal);
router.get('/sucursal/:id_sucursal/activo/:activo',checkAuth, curso.getCursosSucursalActivados);
router.get('/uid/:uid',checkAuth, curso.getCursosByUid);
router.get('/:id_sucursal/:id_especialidad',checkAuth, curso.getCursosActivosInscripcionesAbiertas);


module.exports = router;