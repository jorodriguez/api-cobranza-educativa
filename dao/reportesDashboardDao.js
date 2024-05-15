const {
    getQueryInstance
} = require('../controllers/sqlHelper');
const {
    Exception,
    ExceptionBD
} = require('../exception/exeption');
const {
} = require('../utils/Utils');
const genericDao = require('./genericDao');



const getContadores = (data = {coEmpresa,coSucusal}) => {    
    console.log("@getContadores");
    
    const  { coEmpresa,coSucursal } = data;

    return genericDao.findOne(`
        select 
    	  (
            select count(i.*) as alumnos 
            from co_inscripcion i inner join co_curso curso on curso.id = i.co_curso
    	  					  inner join co_alumno a on a.id = i.co_alumno
    	  	where i.eliminado = false and i.co_empresa = $1 and i.co_sucursal = $2
    	  		and curso.eliminado = false
    	  		and a.eliminado = false  
          ) as alumnos,
	    (select count(*) as talleres from co_curso where eliminado = false and co_empresa = $1 and co_sucursal = $2) as talleres
    ` ,[coEmpresa,coSucursal]);
};

const getTotalAdeudoSucursal = (data = {coEmpresa,coSucusal}) => {    
    console.log("@getTotalAdeudoSucursal");
    
    const  { coSucursal } = data;

    return genericDao.findOne(`
            SELECT		
                sum(b.total) as adeudo_total,				
                count(b.*) as numero_cargos		
            FROM co_cargo_balance_alumno b inner join co_alumno a on b.co_alumno = a.id
                         inner join cat_cargo cargo on b.cat_cargo = cargo.id					                                                                                                    
            WHERE a.co_sucursal = $1
                and b.eliminado = false 
                and a.eliminado = false
                and pagado = false

    ` ,[coSucursal]);
};

const getTotalAdeudoDesgloseCargosSucursal = (data = {coEmpresa,coSucusal}) => {    
    console.log("@getTotalAdeudoDesgloseCargosSucursal");
    
    const  { coSucursal } = data;

    return genericDao.findAll(`
    SELECT		
            cargo.nombre as nombre_cargo,		
            sum(b.total) as total_adeudo,
            sum(b.cargo) as cargo,
            sum(b.total_pagado) as pagado,
            count(b.*) as numero_cargos		
    FROM co_cargo_balance_alumno b inner join co_alumno a on b.co_alumno = a.id
                         inner join cat_cargo cargo on b.cat_cargo = cargo.id					                                                                                                    
        WHERE a.co_sucursal = $1
            and b.eliminado = false 
            and a.eliminado = false
            and pagado = false
        group by cargo.nombre
        ORDER by cargo.nombre desc

    ` ,[coSucursal]);
};



const getTotalInscripciones = (data = {coEmpresa,coSucusal}) => {    
    console.log("@getTotalInscripciones");
    
    const  { coSucursal,coEmpresa } = data;

    return genericDao.findOne(`  
                select 
                (
                            select count(i.*) 
                          from co_inscripcion i inner join co_curso curso on curso.id = i.co_curso
                            inner join co_alumno a on a.id = i.co_alumno
                         where i.co_empresa = $1 and i.co_sucursal = $2 and i.eliminado = false 
                             and curso.eliminado = false
                              and a.eliminado = false
                         and to_char(i.fecha_genero,'yyyy-mm') = to_char(getDate(''),'yyyy-mm')
                    ) as inscritos_mes_actual,
                (
                    select count(i.*) 
                           from co_inscripcion i inner join co_curso curso on curso.id = i.co_curso
                            inner join co_alumno a on a.id = i.co_alumno
                    where i.co_empresa = $1 and i.co_sucursal = $2 and i.eliminado = false 
                            and curso.eliminado = false
                              and a.eliminado = false
                    and to_char(i.fecha_genero,'yyyy-mm') = to_char( (getDate('') - interval '1 month'),'yyyy-mm')) as inscritos_mes_anterior

    ` ,[coEmpresa,coSucursal]);
};

const getTotalInscripcionesDesgloseCurso = (data = {coEmpresa,coSucusal}) => {    
    console.log("@getTotalInscripcionesDesgloseCurso");
    
    const  { coSucursal,coEmpresa } = data;

    return genericDao.findAll(`  
    select count(i.*) as numero_inscripciones,
                esp.nombre as curso
    from co_inscripcion i inner join co_curso curso on curso.id = i.co_curso
     					inner join co_alumno a on a.id = i.co_alumno
                			inner join cat_especialidad esp on esp.id = curso.cat_especialidad
    where 
            curso.eliminado = false 
            and i.eliminado = false
            and a.eliminado = false
            and curso.co_empresa = $1 
            and curso.co_sucursal = $2	
    group by esp.nombre
    order by numero_inscripciones desc         
    ` ,[coEmpresa,coSucursal]);
};


const getTopAlumnosDeudores = (data = {coEmpresa,coSucusal}) => {    
    console.log("@getTopAlumnosDeudores");
    
    const  { coSucursal,coEmpresa } = data;

    return genericDao.findAll(`  
    select alumno.total_adeudo,
    alumno.nombre as alumno,
   	alumno.apellidos as apellidos,
    esp.nombre as curso,
    dia.nombre as dia,
    to_char(curso.hora_inicio,'HH24:mi') as hora_inicio,
    to_char(curso.hora_fin,'HH24:mi') as hora_fin
from co_inscripcion i inner join co_curso curso on curso.id = i.co_curso
                inner join cat_especialidad esp on esp.id = curso.cat_especialidad
                inner join co_alumno alumno on alumno.id = i.co_alumno
                inner join cat_dia dia on dia.id = curso.cat_dia
where 
  curso.eliminado = false 
  and alumno.eliminado = false
  and i.eliminado = false
  and i.co_empresa = $1 
  and i.co_sucursal = $2	
order by alumno.total_adeudo desc
limit 10
    ` ,[coEmpresa,coSucursal]);
};


const getTotalAdeudosPorCurso = (data = {coEmpresa,coSucusal}) => {    
    console.log("@getTotalAdeudosPorCurso");
    
    const  { coSucursal,coEmpresa } = data;

    return genericDao.findAll(`  
    select 
        sum(alumno.total_adeudo) as total_adeudo,        
	  esp.nombre as curso,
	  dia.nombre as dia,
	  to_char(curso.hora_inicio,'HH24:mi') as hora_inicio,
	  to_char(curso.hora_fin,'HH24:mi') as hora_fin
    from co_inscripcion i inner join co_curso curso on curso.id = i.co_curso
				  inner join cat_especialidad esp on esp.id = curso.cat_especialidad
				  inner join co_alumno alumno on alumno.id = i.co_alumno
				  inner join cat_dia dia on dia.id = curso.cat_dia
    where 
	    curso.eliminado = false 
	    and i.eliminado = false
	    and i.co_empresa = $1 
    	and i.co_sucursal = $2
    group by esp.nombre,dia.nombre,curso.id
    order by total_adeudo desc
    ` ,[coEmpresa,coSucursal]);
};

	



module.exports = {
    getContadores,getTotalAdeudoSucursal,getTotalAdeudoDesgloseCargosSucursal,getTotalInscripciones,getTotalInscripcionesDesgloseCurso,getTopAlumnosDeudores,getTotalAdeudosPorCurso
}