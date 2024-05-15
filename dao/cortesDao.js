
const genericDao = require('./genericDao');
const {castDateToStr} = require('../utils/UtilsDate');

const getSumaPagosPorRango = async (corteData) => {
    console.log("@getSumaPagosPorRango");
    
    const {idSucursal,fechaInicio,fechaFin} = corteData;

    const fechaInicioFormat =castDateToStr(fechaInicio);
    const fechaFinFormat =castDateToStr(fechaFin);
   
    return await genericDao.findOne(`            
        select	
            coalesce(sum(rel.pago),0) as total
        from co_pago_cargo_balance_alumno rel inner join co_pago_balance_alumno pago on pago.id = rel.co_pago_balance_alumno
					  		   inner join co_cargo_balance_alumno cargo on cargo.id = rel.co_cargo_balance_alumno
					  		   inner join co_alumno al on al.id = pago.co_alumno
        where pago.fecha::date between $2::date and $3::date
	            and rel.co_sucursal = $1
	            and rel.eliminado = false
	            and pago.eliminado = false
	            and cargo.eliminado = false
`,
        [idSucursal,fechaInicioFormat,fechaFinFormat]);
};

const getDetallePagos = async (corteData) => {
    console.log("@getDetallePagos");
   
    const {idSucursal,fechaInicio,fechaFin} = corteData;

  
    const fechaInicioFormat =castDateToStr(fechaInicio);
    const fechaFinFormat =castDateToStr(fechaFin);

    return await genericDao.findAll(`            
            select rel.id as co_pago_cargo_balance_alumno,		
                rel.pago,
                pago.folio,
                to_char(pago.fecha,'DD-MM-YYYY HH24:mm') as fecha,		
                pago.nota,
                al.foto,
                al.nombre as alumno,
                al.apellidos as apellidos,
                al.total_adeudo,
                fpago.nombre as forma_pago,
                esp.nombre as especialidad,
                semana.numero_semana_curso as numero_semana_curso,
                semana.numero_semana_curso as materia,
                to_char(curso.hora_inicio,'HH24:mi')||' - '||to_char(curso.hora_fin,'HH24:mi') as horario,
                tipo_cargo.nombre as nombre_cargo                
            from co_pago_cargo_balance_alumno rel inner join co_pago_balance_alumno pago on pago.id = rel.co_pago_balance_alumno
                            inner join co_cargo_balance_alumno cargo on cargo.id = rel.co_cargo_balance_alumno
                            inner join cat_cargo tipo_cargo on tipo_cargo.id = cargo.cat_cargo
                            inner join co_alumno al on al.id = pago.co_alumno
                            inner join co_forma_pago fpago on fpago.id = pago.co_forma_pago
                            left join co_curso curso on curso.id = cargo.co_curso                            
                            left join cat_especialidad esp on esp.id = curso.cat_especialidad
                            left join co_curso_semanas semana on semana.id = cargo.co_curso_semanas                            
            where pago.fecha::date between $2::date and $3::date
                    and rel.co_sucursal = $1
                    and rel.eliminado = false
                    and pago.eliminado = false
                    and cargo.eliminado = false
            order by pago.folio

`,
        [idSucursal,fechaInicioFormat,fechaFinFormat]);
};


module.exports = {    
    getDetallePagos,
    getSumaPagosPorRango
}