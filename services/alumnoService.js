const alumnoDao = require('../dao/alumnoDao');

function getCorreosTokenAlumno(idAlumno) {
    console.log("@getCorreosTokenAlumno");
    return  alumnoDao.getCorreosTokensAlumno(idAlumno);    
}

const getAlumnos = (idSucursal,eliminados)=>{
    return  eliminados ? alumnoDao.getAlumnosEliminados(idSucursal) : alumnoDao.getAlumnos(idSucursal);
}



module.exports = { 
                    getAlumnos,
                    getAlumnosCurso:alumnoDao.getAlumnosCurso,
                    getAlumnosIniciarCursoHoy:alumnoDao.getAlumnosIniciarCursoHoy,
                    modificarAlumno:alumnoDao.modificarAlumno,
                    getCorreosTokenAlumno,                    
                    bajaAlumno:alumnoDao.bajaAlumno,
                    activarAlumnoEliminado:alumnoDao.activarAlumnoEliminado,
                    getAlumnoPorUId:alumnoDao.getAlumnoPorUId,
                    modificarCorreoAlumno:alumnoDao.modificarCorreoAlumno
                 };
