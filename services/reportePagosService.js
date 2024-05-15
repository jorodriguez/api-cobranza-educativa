const cargoDao = require('../dao/cargoDao');
const cursoDao = require('../dao/cursoDao');
const inscripcionDao = require('../dao/inscripcionDao');
const alumnoService = require('./alumnoService');
const templateService = require('./templateService');
const { TIPO_TEMPLATE } = require('../utils/Constantes');


const getReporteHtmlEstadoCuentaDetallado = async(uuidAlumno) => {

    console.log("@getReporteHtmlEstadoCuentaDetallado");

    const listaInscripcionCurso = await inscripcionDao.getIncripcionCursoAlumno(uuidAlumno);

    const inscripcionCurso = listaInscripcionCurso[0] || null;

    console.log(JSON.stringify(inscripcionCurso));

    const curso = await cursoDao.getCursoByUid(inscripcionCurso.uid_curso);

    const listaSemanas = await cargoDao.obtenerEstadoCuentaDetallado(uuidAlumno, inscripcionCurso.id_curso);

    const listaOtrosCargos = await cargoDao.obtenerOtrosCargosEstadoCuentaDetallado(uuidAlumno);

    const alumno = await alumnoService.getAlumnoPorUId(uuidAlumno);

    const nombreGrupo = `${curso.especialidad}`;

    const turno = `${curso.dia} ${curso.horario}`;

    console.log("@obtener html " + nombreGrupo);

    const params = {
        nombre_sucursal: curso.sucursal,
        direccion_sucursal: curso.direccion_sucursal,
        telefono_sucursal: "",
        nombre_grupo: nombreGrupo,
        nombre_maestro: "",
        turno: turno,
        foto_curso: curso.foto,
        fecha_inicio: curso.fecha_inicio_previsto_format,
        adeudo: alumno.total_adeudo,
        inscripcion: inscripcionCurso,
        semanas: listaSemanas,
        listaOtrosCargos: listaOtrosCargos
    };

    const html = await templateService
        .loadTemplateEmpresa({
            params,
            idEmpresa: curso.co_empresa,
            idUsuario: 1,
            tipoTemplate: TIPO_TEMPLATE.ESTADO_CUENTA_DETALLADO
        });

    return html;
};



module.exports = {
    getReporteHtmlEstadoCuentaDetallado
};