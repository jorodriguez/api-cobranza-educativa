const cursoDao = require('../dao/cursoDao');
const inscripcionDao = require('../dao/inscripcionDao');
const cargoService = require('../services/cargoService');
const cursoSemanasService = require('../services/cursoSemanasService');
const CONSTANTES = require('../utils/Constantes');


const iniciarCurso = async (uidCurso,genero) => {
        console.log("@IniciarCurso "+uidCurso);
        try {

                const inscripcionesConfirmadas = await inscripcionDao.getInscripcionesConfirmadasCurso(uidCurso);
                
                console.log(`=>generar ${inscripcionesConfirmadas.length} inscripciones`);

                if (inscripcionesConfirmadas && inscripcionesConfirmadas.length > 0) {
                        
                        //guardar las semanas del curso
//                        await cursoSemanasService.guardarSemanasCurso(uidCurso,genero);

                        //for (const element of inscripcionesConfirmadas) {
                        for(let i =0; i < inscripcionesConfirmadas.length; i++){
                                const element = inscripcionesConfirmadas[i];
                                //console.log("==Iniciando Generacion de cargo INSCRIPCION  "+element.alumno);
                                //await cargoService.registrarInscripcion(element.id_curso, element.id_alumno, genero);
                                //console.log("Finalizando generacion de cargo para "+element.alumno);
                                
                                console.log("==Iniciando Generacion de COLEGIATURA "+element.alumno);
                                //await cargoService.registrarColegiatura(element.id_curso,element.id_alumno, genero);
                                await cargoService.registrarColegiaturaAlumnoSemanaActual(element.id_curso,element.id_alumno, genero);

                        }

                        //Inciar curso
                        console.log("MARCANDO CURSO COMO INICIADO");
                        await cursoDao.marcarCursoComoIniciado(uidCurso,genero);

                } else {
                        console.log("No existieron inscripciones confirmadas")
                }
        } catch (e) {
                console.log("XX excepcion "+e);
                return false;
        }

}


const createCurso = async (cursoData) => {
        console.log("@createCurso ");
        try {

                const idCursoCreado =  await cursoDao.createCurso(cursoData);
                
                console.log("curso creado "+idCursoCreado);               
                
                await cursoSemanasService.guardarSemanasCurso(idCursoCreado,cursoData.genero);
                
                return idCursoCreado;

        } catch (e) {
                console.log("XX excepcion "+e);
                return null;
        }
}

const updateCurso = async (id,cursoData) => {
        console.log("@updateCurso ");
        try {
                const uidCursoModificado =  await  cursoDao.updateCurso(id,cursoData);
                
                console.log(uidCursoModificado);               
                //falta modificar las semanas cuando se modifique la fecha
                await cursoSemanasService.modificarSemanasCurso(uidCursoModificado,cursoData.genero);
                
                return uidCursoModificado;

        } catch (e) {
                console.log("XX excepcion "+e);
                return null;
        }
}



module.exports = {
        iniciarCurso:iniciarCurso,
        createCurso,
        updateCurso,
        eliminarCurso: cursoDao.eliminarCurso,
        getCursosActivosInscripcionesAbiertas: cursoDao.getCursosActivosInscripcionesAbiertas,
        getCursosSucursal: cursoDao.getCursosSucursal,        
        getCursosActivoSucursal: cursoDao.getCursosActivoSucursal,
        getCursosInicianProximosDias: cursoDao.getCursosInicianProximosDias,
        getCursoByUid: cursoDao.getCursoByUid,
        cerrarInscripcionesCurso:cursoDao.cerrarInscripcionesCurso,
        abrirInscripcionesCurso:cursoDao.abrirInscripcionesCurso,
};