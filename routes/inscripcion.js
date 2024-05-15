const router = require('express').Router();
const inscripcion = require('../controllers/inscripcion');
const checkAuth = require('./check-auth');
//const {validarSchema} = require('./validacionMiddle');

//inscripcion
router.post('/',checkAuth, inscripcion.guardarInscripcion);
router.post('/reenviar_correo_bienvenida',checkAuth, inscripcion.enviarCorreoBienvenida);
//router.put('/confirmar/:id_inscripcion',checkAuth, inscripcion.confirmarInscripcion);
router.put('/:id_inscripcion',checkAuth, inscripcion.modificarColegiaturaInscripcion);
router.get('/:id_sucursal',checkAuth, inscripcion.getInscripciones);
router.get('/sucursal/:id_sucursal/curso/:id_curso',checkAuth, inscripcion.getInscripcionesSucursalCurso);
router.get('/alumno/:uid',checkAuth, inscripcion.getInscripcionesAlumno);
router.get('/inscripciones_activas/:uid_alumno',checkAuth, inscripcion.getInscripcionesCursoActivoAlumno);
router.get('/curso/:uid',checkAuth, inscripcion.getInscripcionesCurso);
/*router.get('/:id_sucursal/eliminados/:eliminado?',checkAuth, alumno.getAlumnos);
router.get('/id/:id',checkAuth, alumno.getAlumnoById);
*/
module.exports = router;