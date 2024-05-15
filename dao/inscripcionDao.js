const genericDao = require("./genericDao");
const {
    ExceptionDatosFaltantes,
    ExceptionBD,
} = require("../exception/exeption");
const { isEmptyOrNull } = require("../utils/Utils");


const guardarInscripcion = async(idAlumno, inscripcionData) => {
    console.log("@guardarInscripcion");
    const { co_curso, co_empresa, co_sucursal, co_alumno, cat_esquema_pago, costo_colegiatura, costo_inscripcion, nota, usuario_inscribe, genero } = inscripcionData;

    return genericDao.execute(`
          INSERT INTO CO_INSCRIPCION(co_curso,co_empresa,co_sucursal,co_alumno,cat_esquema_pago,costo_colegiatura,costo_inscripcion,nota,usuario_inscribe,genero)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING ID;
  `, [co_curso, co_empresa, co_sucursal, idAlumno, cat_esquema_pago, costo_colegiatura, costo_inscripcion, nota, usuario_inscribe, genero]);
}

const confirmarInscripcion = async(idInscripcion, inscripcionData) => {
    console.log("@confirmarInscripcion");
    const { confirmacion, nota, genero } = inscripcionData;

    return genericDao.execute(`
          UPDATE CO_INSCRIPCION 
            SET CONFIRMADO = $2,
                FECHA_CONFIRMADO = (getDate('')+getHora(''))::timestamp,
                FECHA_MODIFICO = (getDate('')+getHora(''))::timestamp,
                NOTA = $3,
                USUARIO_CONFIRMO = $4,                
                MODIFICO = $4
          WHERE id = $1 RETURNING ID;              
  `, [idInscripcion, confirmacion, nota, genero]);
}



const modificarColegiaturaInscripcion = async(idInscripcion, inscripcionData) => {
    console.log("@modificarColegiaturaInscripcion");
    const { costo_colegiatura, cat_esquema_pago, nota, genero } = inscripcionData;

    return genericDao.execute(`
          UPDATE CO_INSCRIPCION 
            SET COSTO_COLEGIATURA = $2,                
                CAT_ESQUEMA_PAGO = $3,
                FECHA_MODIFICO = (getDate('')+getHora(''))::timestamp,
                NOTA = (NOTA ||' \n '||to_char((getDate('')+getHora('')),'DD-MM-YYYY HH24:MI') ||' '|| $4),                
                MODIFICO = $5
          WHERE id = $1 RETURNING ID;              
  `, [idInscripcion, costo_colegiatura,cat_esquema_pago, nota, genero]);
}


const getInscripcionesAlumno = async(uidAlumno) => {
    console.log("@guardarInscripcionesA1lumno");
    return await genericDao.findAll(getQueryBase(' a.uid = $1 '), [uidAlumno]);
}

//corte
const getInscripcionesCorteFecha = async(idSucursal, fecha) => {
    console.log("@getInscripcionesCorteFecha");
    return await genericDao.findAll(getQueryBase(' suc.id = $1 and i.fecha_genero::date = $2 '), [idSucursal, fecha]);
}

const getInscripcionesActivasAlumno = async(uidAlumno) => {
    console.log("@getInscripcionesActivasAlumno");
    return await genericDao.findAll(getQueryBase(' a.uid = $1 '), [uidAlumno]);
}

const getInscripciones = async(idSucursal) => {
    console.log("@getInscripciones");
    return await genericDao.findAll(getQueryBase(' suc.id = $1 '), [idSucursal]);
};

const getInscripcionesSucursalCurso = async(idSucursal, idCurso) => {
    console.log("@getInscripcionesSucursalCurso");
    return await genericDao.findAll(getQueryBase(' suc.id = $1 AND curso.id = $2 '), [idSucursal, idCurso]);
};


const getInscripcionAlumnoCurso = async(idAlumno, idCurso) => {
    console.log("@getInscripciones");
    //return await genericDao.findOne(` select * from co_inscripcion where co_curso = and co_alumno = and eliminado = false; `,[idSucursal]);
    return genericDao.findOne(getQueryBase(" a.id = $1 and curso.id = $2 "), [idAlumno, idCurso]);
};

const actualizarCampoInscripcion = async(idInscripcion, idCargoInscripcion, genero) => {
    console.log("@actualizarCampoInscripcion");
    console.log("actualizer co_cargo_inscripcion de co_inscripcion idCArgo=" + idCargoInscripcion);
    return genericDao.execute(` UPDATE CO_INSCRIPCION 
                              SET co_cargo_inscripcion = $2,
                                   fecha_modifico = (getDate('')+getHora(''))::timestamp,
                                   modifico = $3
                              WHERE 
                                id=$1
                              returning id;`, [idInscripcion, idCargoInscripcion, genero]);
};

const actualizarTotalAdeudaInscripcion = async(idAlumno, idCurso, genero) => {
    console.log("@actualizarTotalAdeudaInscripcion");

    return genericDao.execute(` UPDATE CO_INSCRIPCION SET 
                                  total_adeuda = (select case when sum(total) is null then 0 else sum(total) end from co_cargo_balance_alumno where co_alumno = $1 and co_curso = $2 and eliminado = false),
                                  fecha_modifico = (getDate('')+getHora(''))::timestamp,
                                  modifico = $3
                            WHERE 
                                  co_alumno=$1 and co_curso = $2
                              returning id`, [idAlumno, idCurso, genero]);
};





const getInscripcionesCurso = async(uidCurso) => {
    console.log("@getIncripcionesCurso");

    return await genericDao.findAll(getQueryBase(" curso.uid = $1 "), [uidCurso]);
}

const getInscripcionesConfirmadasCurso = async(uidCurso) => {
    console.log("@getInscripcionesConfirmadasCurso");

    //return await genericDao.findAll(getQueryBase(" curso.uid = $1 AND  i.confirmado "),[uidCurso]);
    return await genericDao.findAll(getQueryBase(" curso.uid = $1  "), [uidCurso]);
}

const getIncripcionesCursoIniciaHoy = async(idCurso) => {
    console.log("@getIncripcionesIniciarCursoHoy id=" + idCurso);
    return await genericDao.findAll(getQueryBase(" curso.id = $1 and curso.fecha_inicio::date <= getDate('') and curso.semana_actual = 0 and curso.activo = false "), [idCurso]);
}

const getIncripcionesIniciarCursoHoyPorSucursal = (idSucursal) => {
    console.log("@getIncripcionesIniciarCursoHoyPorSucursal");

    return genericDao.findAll(getQueryBase("  curso.fecha_inicio::date <= getDate('') and a.co_sucursal = $1 and curso.semana_actual = 0  and curso.activo = false "), [idSucursal]);
}

const getIncripcionCursoAlumno = (uuidAlumno) => {
    console.log("@getIncripcionCursoAlumno");

    return genericDao.findAll(getQueryBase(" a.uid = $1 "), [uuidAlumno]);
}

const findById = async(id) => {
    console.log("@findById");
    return await genericDao.findOne(getQueryBase(" i.id = $1 "), [id]);
}

const getInscripcionesMensualesMesActual = () => {

    console.log("@getInscripcionesMensuales");

    return genericDao.findAll(`
    select		 
        (select nombre||' '||to_char(getDate(''),'YY') from si_meses where to_char(getDate(''),'MM')::int = id) as nombre_mes,	     
        inscripcion.co_curso,
        inscripcion.co_alumno,
        to_char(getDate(''),'YYYY-MM-DD') as fecha_mes  	      
    from co_inscripcion inscripcion inner join co_curso curso on  inscripcion.co_curso = curso.id
                                inner join co_alumno al on al.id = inscripcion.co_alumno        
    where       	        
        inscripcion.cat_esquema_pago = 2 --esquema mensual
        and inscripcion.eliminado = false
        and al.eliminado = false
        and curso.eliminado = false`, []);

}

const getQueryBase = (criterio) => `               
  select i.id as id_inscripcion,
    curso.id as id_curso,
    curso.uid as uid_curso,
    curso.semana_actual,	  
    esp.duracion as duracion_curso,
    curso.fecha_inicio_previsto,  
    to_char(curso.fecha_inicio_previsto,'DD-MM-YYYY') as fecha_inicio_previsto,
    to_char(curso.fecha_inicio_previsto,'DD Mon YY') as fecha_inicio_previsto_format,          
    to_char(curso.fecha_fin_previsto,'DD-MM-YYYY') as fecha_inicio_previsto,
    to_char(curso.fecha_fin_previsto,'DD Mon YYYY') as fecha_inicio_previsto_format,
    to_char(curso.fecha_inicio,'DD-MM-YYYY') as fecha_inicio,
    to_char(curso.fecha_inicio,'DD Mon YY') as fecha_inicio_format,          
    to_char(curso.fecha_fin,'DD-MM-YYYY') as fecha_fin,
    to_char(curso.fecha_fin,'DD Mon YY') as fecha_fin_format,          
    to_char(i.fecha_genero,'DD Mon YY HH24:MI') as fecha_inscripcion_format,          
    dia.nombre as dias,
    i.costo_colegiatura,
    i.costo_inscripcion,
    i.nota as nota_inscripcion,
    i.total_pagado,
    i.pagado,
    esp.id as id_especialidad,
    esp.foto as logo_taller,
    esp.nombre as especialidad,
    esp.color as color_especialidad,     
    to_char(curso.hora_inicio,'HH24:MI')||' - '||to_char(curso.hora_fin,'HH24:MI') as horario,
    a.id as id_alumno,
    a.nombre as alumno,
    a.matricula,
    a.direccion as direccion,
    a.apellidos,
    a.telefono,
    a.correo,
    a.foto,
    to_char(a.fecha_nacimiento,'DD-MM-YYYY') as fecha_nacimiento_format,          
    (a.fecha_nacimiento::date = getDate('')) as cumpleanos,
    a.total_adeudo,    
    a.uid,    
    curso.foto as foto_curso,
    curso.activo,
    curso.co_empresa,
    curso.co_sucursal,
    curso.numero_semanas,
    asesor.nombre as inscribio,
    usuario_genero.nombre as nombre_genero,    
    esquema.id as cat_esquema_pago,
    esquema.nombre as esquema_pago,    
    i.genero
from co_inscripcion i inner join co_curso curso on curso.id = i.co_curso
    inner join cat_especialidad esp on esp.id = curso.cat_especialidad    
    inner join cat_dia dia on dia.id = curso.cat_dia
    inner join co_alumno a on a.id = i.co_alumno
    inner join co_sucursal suc on suc.id = i.co_sucursal
    inner join usuario usuario_genero on usuario_genero.id = i.genero
    inner join cat_esquema_pago esquema on esquema.id = i.cat_esquema_pago
    left join usuario asesor on asesor.id = i.usuario_inscribe
where ${criterio}
  and a.eliminado =false
  and i.eliminado = false
  and curso.eliminado = false  
order by i.fecha_genero desc
`;



module.exports = {
    getInscripciones,
    actualizarCampoInscripcion,
    actualizarTotalAdeudaInscripcion,
    getInscripcionAlumnoCurso,
    getIncripcionesIniciarCursoHoyPorSucursal,
    getIncripcionesCursoIniciaHoy,
    confirmarInscripcion,
    guardarInscripcion,
    getInscripcionesAlumno,
    getInscripcionesCurso,
    getInscripcionesConfirmadasCurso,
    getInscripcionesActivasAlumno,
    getInscripcionesSucursalCurso,
    modificarColegiaturaInscripcion,
    findById,
    getInscripcionesCorteFecha,
    getIncripcionCursoAlumno,
    getInscripcionesMensualesMesActual,
};