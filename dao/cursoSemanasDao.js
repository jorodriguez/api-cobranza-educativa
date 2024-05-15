const genericDao = require("./genericDao");
const {
    ExceptionDatosFaltantes,
    ExceptionBD,
} = require("../exception/exeption");
const { isEmptyOrNull } = require("../utils/Utils");
const { ID_CARGO_COLEGIATURA } = require('../utils/Constantes');

const guardarCursoSemana = async(semanaData) => {
    console.log("@guardarCursoSemana");
    try {

        const {
            co_curso,
            numero_semana_curso,
            numero_semana_anio,
            fecha_inicio_semana,
            fecha_fin_semana,
            fecha_clase,
            anio,
            genero
        } = semanaData;

        return await genericDao.execute(`
          insert into co_curso_semanas(
            co_curso,            
            numero_semana_curso,
            numero_semana_anio,
            fecha_inicio_semana,
            fecha_fin_semana,
            fecha_clase,
            anio,            
            genero)
          values($1,$2,$3,$4::date,$5::date,$6::date,$7,$8) RETURNING ID;
    `, [co_curso,
            numero_semana_curso,
            numero_semana_anio,
            fecha_inicio_semana,
            fecha_fin_semana,
            fecha_clase,
            anio,
            genero
        ]);

    } catch (e) {
        console.log("Error al insertar la semana del curso " + e);
        throw new ExceptionBD("Error");
    }
};



const modificarCursoSemana = async(semanaData) => {
    console.log("@modificarCursoSemana");
    try {

        const {
            id,
            numero_semana_curso,
            numero_semana_anio,
            fecha_inicio_semana,
            fecha_fin_semana,
            fecha_clase,
            anio,
            genero
        } = semanaData;

        return await genericDao.execute(`
         UPDATE CO_CURSO_SEMANAS
         SET 
              numero_semana_curso = $2,
              numero_semana_anio= $3,
              fecha_inicio_semana = $4::date,
              fecha_fin_semana = $5::date,
              fecha_clase = $6::date,
              anio = $7, 
              fecha_modifico=(getDate('')+getHora(''))::timestamp,
              genero = $8
         WHERE ID = $1 
         RETURNING ID;                    
    `, [id,
            numero_semana_curso,
            numero_semana_anio,
            fecha_inicio_semana,
            fecha_fin_semana,
            fecha_clase,
            anio,
            genero
        ]);

    } catch (e) {
        console.log("Error al modificar la semana del curso " + e);
        throw new ExceptionBD("Error");
    }
};

const guardarRealcionCargoCursoSemana = async(idCursoSemana, idCargo, genero) => {
    console.log("@guardarRealcionCargoCursoSemana");
    try {

        return await genericDao.execute(`
          UPDATE co_curso_semanas
          SET co_cargo_balance_alumno = $2,
              fecha_modifico = (getDate('')+getHora(''))::timestamp,
              modifico = $3
          WHERE ID = $1
          RETURNING ID;
    `, [idCursoSemana, idCargo, genero]);

    } catch (e) {
        console.log("Error al modificar la relacion cargo " + e);
        throw new ExceptionBD("Error");
    }
};



const getSeriesPeriodosCurso = (uidCurso) => {
    return genericDao.findAll(getQueryBaseSeries(), [uidCurso]);
}

const getSemanasColegiaturasParaCargo = (uidCurso, idAlumno) => {

    return genericDao.findAll(`
  select sem.id, 
      curso.id as id_curso,
      especialidad.nombre as especialidad,                  
      sem.numero_semana_anio,
      sem.numero_semana_curso,
      sem.fecha_inicio_semana,
      to_char(sem.fecha_inicio_semana,'DD-MM-YYYY') as fecha_inicio_semana_format,
      sem.fecha_fin_semana,
      to_char(sem.fecha_fin_semana,'DD-MM-YYYY') as fecha_fin_semana_format,
      to_char(sem.fecha_clase,'DD-MM-YYYY') as fecha_clase_format,
      sem.anio,
      (sem.numero_semana_anio < extract(week from getDate(''))::int) as semana_ocurrida,
      (sem.numero_semana_anio = extract(week from getDate(''))::int) as semana_actual,
      (select c.id 
          from co_cargo_balance_alumno c 
        where c.cat_cargo = $2 
            and c.co_alumno = $3 
            and c.co_curso_semanas = sem.id 
            and c.co_curso = sem.co_curso 
            and c.eliminado = false) is not null as tiene_cargo
from co_curso_semanas sem inner join co_curso curso on curso.id = sem.co_curso
                                inner join cat_especialidad especialidad on especialidad.id = curso.cat_especialidad                                                                                                                                            
where  curso.uid = $1 
  and curso.eliminado = false                  
order by sem.fecha_clase
  `, [uidCurso, ID_CARGO_COLEGIATURA, idAlumno]);

}

const getSemanasCursoRecalculados = (uidCurso) => {

    return genericDao.findAll(`
  with periodo as(     		
    select c.id as id_curso,fecha_inicio_previsto::date,fecha_fin_previsto::date
        from co_curso c inner join cat_especialidad e on e.id = c.cat_especialidad                
    where c.uid = $1 and c.eliminado = false      
  ), materias as(
  SELECT 
    curso_semana.id,	
    curso_semana.numero_semana_curso,	
    date_trunc('week', ((p.fecha_inicio_previsto + ((curso_semana.numero_semana_curso - 1) ||' week')::interval)))::date as fecha_inicio_semana,
    (date_trunc('week', ((p.fecha_inicio_previsto + ((curso_semana.numero_semana_curso - 1) ||' week')::interval)))::date + interval '6 days')::date as fecha_fin_semana,
    p.id_curso,
    to_char(((p.fecha_inicio_previsto + ((curso_semana.numero_semana_curso - 1) ||' week')::interval))::date,'DD-MM-YYYY') as fecha_clase_format,
    ((p.fecha_inicio_previsto + ((curso_semana.numero_semana_curso - 1) ||' week')::interval))::date as fecha_clase    
  FROM co_curso_semanas curso_semana  inner join periodo p on p.id_curso = curso_semana.co_curso
  where curso_semana.eliminado = false
  ) select m.*,
      extract(week from m.fecha_clase::date)::int as numero_semana_anio,
      extract(year from m.fecha_clase::date)::int as numero_anio 	 	
  from materias m 
 
  `, [uidCurso]);

}

const getSemanasCurso = (uidCurso) => {
    return genericDao.findAll(getQueryBaseSemanasCurso(" curso.uid = $1 "), [uidCurso]);
}

const getSemanaCursoById = (idSemanaCurso) => {
    return genericDao.findOne(`
  select sem.*,curso.numero_semanas as modulo,curso.numero_semanas as materia_modulo,especialidad.nombre as especialidad
  from 
  co_curso_semanas sem inner join co_curso curso on curso.id = sem.co_curso
    inner join cat_especialidad especialidad on especialidad.id = curso.cat_especialidad    
  where sem.id = $1
      and sem.eliminado = false
  `, [idSemanaCurso]);
}


const getSemanaActualCurso = (idCurso) => {
    return genericDao.findOne(`
      select * 
      from co_curso_semanas
      where co_curso = $1
          and numero_semana_anio =  extract(week from getDate(''))::int 
          and anio = extract(year from getDate(''))::int
          and eliminado = false
  `, [idCurso]);
}

const getSemanasCalculadasPreviewPorFecha = (fecha, numero_semanas, co_empresa) => {
    return genericDao.findAll(`
  with fechas as (    
      SELECT generate_series($1::date,(($1::date)  + interval '${numero_semanas - 1} week')::timestamp,'1 week')::date as dia
  ) select ROW_NUMBER() over ( order by dia) as numero_semana_curso, 	   
          to_char(f.dia,'mm-yyyy') as mes,		    
          m.nombre as nombre_mes,          
          to_char(f.dia,'dd') as numero_dia,		              
          dia.nombre as nombre_dia,     
          m.abreviatura as abreviatura_mes,
          to_char(f.dia,'yyyy-MM-dd') as fecha_clase, 		        
          to_char((f.dia + interval '1 week'),'yyyy-MM-dd')::date as fecha_fin_semana,
          extract(week from f.dia)::int as numero_semana_anio,
          extract(year from f.dia::date)::int as numero_anio,
          lag(to_char(f.dia,'mm-yyyy')) over mes_window is null as generar_cargo_mensual,
          (f.dia < current_date) as es_fecha_pasada,          
          (extract(week from f.dia)::int = extract(week from current_date)::int) as es_semana_actual,
          false as mostrar,
          false as generar_cargo
  from fechas f  inner join si_meses m on m.id = to_char(f.dia,'mm')::integer
                  inner join cat_dia dia on dia.numero_dia  = extract(isodow from f.dia)::integer  		
  where dia.co_empresa = $2                  
  WINDOW mes_window as (partition by to_char(f.dia,'mm-yyyy') order by f.dia)  
  `, [fecha, co_empresa]);
}


const getInformacionCrearColegiaturaSemanaActual = () => {
    return genericDao.findAll(`
    select	
	      c.id as id_semana_actual,
  	    c.co_curso,
  	    c.numero_semana_curso,      		  	  	
      	array_to_json(array_agg(row_to_json((inscripcion.*)))) array_inscripciones,
  	    count(inscripcion.*) as contador_inscripciones,
        inscripcion.cat_esquema_pago
    from co_curso_semanas c inner join co_curso curso on curso.id = c.co_curso
		    		  	inner join co_inscripcion inscripcion on inscripcion.co_curso = c.co_curso
            				inner join co_alumno al on al.id = inscripcion.co_alumno        
    where       	  
      c.fecha_clase = getDate('')
      and inscripcion.cat_esquema_pago = 1 --esquema semanal
      and c.eliminado = false
      and inscripcion.eliminado = false
      and al.eliminado = false
      and curso.eliminado = false
      group by c.id,c.co_curso,c.numero_semana_curso,inscripcion.cat_esquema_pago

  `, []);
}



// Unicamente para generar las colegiaturas que no se generaron 
const getInformacionCrearColegiaturaSemanaNoGeneradas = () => {
    return genericDao.findAll(`
  select	
      c.id as id_semana_actual,
      c.co_curso,
      c.numero_semana_curso,      		  	  	
      array_to_json(array_agg(row_to_json((inscripcion.*)))) array_inscripciones,
      count(inscripcion.*) as contador_inscripciones,
      inscripcion.cat_esquema_pago
  from co_curso_semanas c inner join co_curso curso on curso.id = c.co_curso
              inner join co_inscripcion inscripcion on inscripcion.co_curso = c.co_curso
                  inner join co_alumno al on al.id = inscripcion.co_alumno        
  where       	  
    c.fecha_clase = '2023/01/27'
    and inscripcion.cat_esquema_pago = 1 --esquema semanal
    and c.eliminado = false
    and inscripcion.eliminado = false
    and al.eliminado = false
    and curso.eliminado = false
    group by c.id,c.co_curso,c.numero_semana_curso,inscripcion.cat_esquema_pago

`, []);
}

const getQueryBaseSemanasCurso = (criterio) => `
select sem.id, 
		  curso.id as id_curso,
		  especialidad.nombre as especialidad,		  
		  sem.numero_semana_anio,
		  sem.numero_semana_curso,
      sem.fecha_inicio_semana,
		  to_char(sem.fecha_inicio_semana,'DD-MM-YYYY') as fecha_inicio_semana_format,
		  sem.fecha_fin_semana,
      to_char(sem.fecha_fin_semana,'DD-MM-YYYY') as fecha_fin_semana_format,
		  to_char(sem.fecha_clase,'DD-MM-YYYY') as fecha_clase_format,
		  sem.anio,
		  (sem.numero_semana_anio < extract(week from getDate(''))::int) as semana_ocurrida,
		  (sem.numero_semana_anio = extract(week from getDate(''))::int) as semana_actual,
      bal.id is not null as tiene_cargo
	from co_curso_semanas sem inner join co_curso curso on curso.id = sem.co_curso
						inner join cat_especialidad especialidad on especialidad.id = curso.cat_especialidad						
            left join co_cargo_balance_alumno bal on bal.id = sem.co_cargo_balance_alumno
	where  ${criterio ? criterio+' and ':''} 
		      curso.eliminado = false
          and sem.eliminado = false
  order by sem.fecha_clase

`;

const getQueryBaseSeries = () => `
with fechas_curso as (  
  select c.fecha_inicio_previsto,c.fecha_fin_previsto from co_curso c  where c.uid = $1   and c.eliminado = false  			 			
), fechas as(
select generate_series(fc.fecha_inicio_previsto::timestamp,(fc.fecha_fin_previsto-1)::timestamp,'1 week')::date as dia
from fechas_curso fc 	
) select ROW_NUMBER() over ( order by dia) as numero_semana_curso, 
        f.dia as fecha_clase, 		        
        (f.dia + interval '1 week')::date as fecha_fin_semana,
        extract(week from f.dia)::int as numero_semana_anio,
        extract(year from f.dia::date)::int as numero_anio 	 	
from fechas f

`;




module.exports = {
    guardarCursoSemana,
    modificarCursoSemana,
    getSemanasCursoRecalculados,
    getSeriesPeriodosCurso,
    getSemanaActualCurso,
    getSemanasCurso,
    getSemanaCursoById,
    guardarRealcionCargoCursoSemana,
    getInformacionCrearColegiaturaSemanaActual,
    getSemanasColegiaturasParaCargo,
    getSemanasCalculadasPreviewPorFecha,
    getInformacionCrearColegiaturaSemanaNoGeneradas
};