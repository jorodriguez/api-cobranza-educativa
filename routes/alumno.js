const router = require('express').Router();
const alumno = require('../controllers/alumno');
const checkAuth = require('./check-auth');

//alumno
//router.post('/',checkAuth, alumno.createAlumno);
router.get('/:id_sucursal',checkAuth, alumno.getAlumnos);
router.get('/:id_sucursal/eliminados/:eliminado?',checkAuth, alumno.getAlumnos);
router.get('/id/:uid',checkAuth, alumno.getAlumnoUId);
router.get('/inscripciones/:uid',checkAuth, alumno.getAlumnoUId);
router.put('/:id',checkAuth, alumno.modificarAlumno);
router.put('/baja/:id',checkAuth, alumno.bajaAlumno);
router.put('/activar/:id',checkAuth, alumno.activarAlumnoEliminado);
router.get('/curso/:uidCurso',checkAuth, alumno.getAlumnosCurso);

module.exports = router;