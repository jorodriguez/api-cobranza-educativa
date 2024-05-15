const reportesAlumnoDao = require('../dao/reportesAlumnoDao');
const cursoDao = require('../dao/cursoDao');
const templateService = require('../services/templateService');
const { TIPO_TEMPLATE } = require('../utils/Constantes');




const getReporteHtmlListaAlumnosCurso = async (uidCurso,idUsuario) => {
    
    console.log("@getReporteHtmlListaAlumnosCurso");
   
    const curso = await cursoDao.getCursoByUid(uidCurso);

    const lista = await reportesAlumnoDao.getReporteListaAlumnosCurso({ uidCurso });

    console.log("@lista "+lista && lista.length);

    const nombreGrupo = `${curso.especialidad}`;
    
    const turno = `${curso.dia} ${curso.horario}`;
    
    console.log("@obtener html "+nombreGrupo);

    const params = {
                    nombre_sucursal:curso.sucursal,
                    direccion_sucursal: curso.direccion_sucursal,
                    telefono_sucursal:"",
                    nombre_grupo: nombreGrupo,
                    nombre_maestro:"",
                    turno : turno,
                    foto_curso:curso.foto,
                    fecha_inicio:curso.fecha_inicio_previsto_format,
                    alumnos: lista
                };
 
    const html = await templateService
                       .loadTemplateEmpresa({
                                        params,
                                        idEmpresa : curso.co_empresa,
                                        idUsuario,
                                        tipoTemplate: TIPO_TEMPLATE.LISTA_ALUMNOS
        });

    return html;
};



module.exports = { 
        getReporteListaAlumnosCurso:reportesAlumnoDao.getReporteListaAlumnosCurso,
        getReporteHtmlListaAlumnosCurso
};