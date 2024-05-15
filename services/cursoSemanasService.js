const cursoDao = require('../dao/cursoDao');
const cursoSemanasDao = require('../dao/cursoSemanasDao');
const CONSTANTES = require('../utils/Constantes');

const guardarSemanasCurso = async(idCurso, genero) => {
    console.log("@guardarSemanasCurso " + idCurso);
    try {

        const curso = await cursoDao.getCursoById(idCurso);

        if (curso && curso.activo == true) {
            console.log("                                          ");
            console.log("-----------EL CURSO YA ESTA ACTIVO - YA SE GENERARON LAS SEMANAS -------");
            console.log("                                          ");
            return true;
        }

        const semanasCurso = await cursoSemanasDao.getSeriesPeriodosCurso(curso.uid);

        if (semanasCurso && semanasCurso.length > 0) {

            for (let i = 0; i < semanasCurso.length; i++) {
                const element = semanasCurso[i];
                console.log("agregando la semana del año " + element.numero_semana_anio + " no semana del curso " + element.numero_semana_curso);

                await cursoSemanasDao.guardarCursoSemana({
                    co_curso: curso.id,
                    numero_semana_curso: element.numero_semana_curso,
                    numero_semana_anio: element.numero_semana_anio,
                    fecha_inicio_semana: element.fecha_clase,
                    fecha_fin_semana: element.fecha_fin_semana,
                    fecha_clase: element.fecha_clase,
                    anio: element.numero_anio,
                    genero: genero

                });
            }

        } else {
            console.log("No existieron semanas del curso")
        }
    } catch (e) {
        console.log("XX excepcion " + e);
        return false;
    }
}


const modificarSemanasCurso = async(idCurso, genero) => {
    console.log("@modificarSemanasCurso " + idCurso);
    try {

        const curso = await cursoDao.getCursoById(idCurso);

        const semanasCurso = await cursoSemanasDao.getSemanasCursoRecalculados(curso.uid);

        if (semanasCurso && semanasCurso.length > 0) {

            for (let i = 0; i < semanasCurso.length; i++) {
                const element = semanasCurso[i];
                console.log("modificando la semana del año " + element.numero_semana_anio + " no semana del curso " + element.numero_semana_curso);

                await cursoSemanasDao.modificarCursoSemana({
                        id: element.id,
                        numero_semana_curso: element.numero_semana_curso,
                        numero_semana_anio: element.numero_semana_anio,
                        fecha_inicio_semana: element.fecha_inicio_semana,
                        fecha_fin_semana: element.fecha_fin_semana,
                        fecha_clase: element.fecha_clase,
                        anio: element.numero_anio,
                        genero: genero

                    }

                );


            }

        } else {
            console.log("No existieron semanas del curso")
        }
    } catch (e) {
        console.log("XX excepcion " + e);
        return false;
    }
}




module.exports = {
    guardarSemanasCurso,
    modificarSemanasCurso,
    getSeriesPeriodosCurso: cursoSemanasDao.getSeriesPeriodosCurso,
    getSemanaActualCurso: cursoSemanasDao.getSemanaActualCurso,
    getInformacionCrearColegiaturaSemanaActual: cursoSemanasDao.getInformacionCrearColegiaturaSemanaActual,
    getInformacionCrearColegiaturaSemanaNoGeneradas: cursoSemanasDao.getInformacionCrearColegiaturaSemanaNoGeneradas,
    getSemanasCurso: cursoSemanasDao.getSemanasCurso,
    getSemanaCursoById: cursoSemanasDao.getSemanaCursoById,
    guardarRealcionCargoCursoSemana: cursoSemanasDao.guardarRealcionCargoCursoSemana,
    getSemanasColegiaturasParaCargo: cursoSemanasDao.getSemanasColegiaturasParaCargo,
    getSemanasCalculadasPreviewPorFecha: cursoSemanasDao.getSemanasCalculadasPreviewPorFecha
};