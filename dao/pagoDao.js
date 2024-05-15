

const genericDao = require('./genericDao');

//agregar_pago_alumno(IN id_alumno integer,pago_param numeric ,nota text ,id_genero integer,OUT retorno boolean) 
//registrar pagos
const registrarPago = (pagoData) => {
    console.log("@registrarPago");
    console.log("=====>> " + JSON.stringify(pagoData));
    return new Promise((resolve, reject) => {
        const { id_alumno, pago, nota, ids_cargos, cargos_desglosados,ids_cargos_descuento,id_descuentos_desglose, cat_forma_pago, identificador_factura,identificador_pago,id_sucursal, genero } = pagoData;
        
        console.log("identificador_pagoidentificador_pagoidentificador_pago "+identificador_pago);

        const SQL = `SELECT agregar_pago_alumno(
            '${ids_cargos}',
            '${cargos_desglosados}',
            '${ids_cargos_descuento}',
            '${id_descuentos_desglose}',                        
            ${id_alumno},
            ${pago},
            '${nota}',
            ${cat_forma_pago},
            '${identificador_factura}',
            '${identificador_pago}',
            '${id_sucursal}',            
            ${genero});`;

        console.log(SQL);
        
        genericDao
            .executeProcedure(SQL)
            .then(results => {
                if (results.rowCount > 0) {
                    var retorno = results.rows[0];
                    console.log("Retorno el ID " + JSON.stringify(results.rows));

                      //notificacionService.notificarReciboPago(id_alumno, retorno.agregar_pago_alumno);
                    resolve(retorno);
                } else {
                    reject(null);
                }
            }).catch(error => {
                console.error("No se guardo el pago "+error);
                reject(error);
            });      
    });

};


const getPagosByCargoId = (idCargoBalanceAlumno) => {
    console.log("@getPagosByCargoId");

    console.log("request.params.id_cargo_balance_alumno " + idCargoBalanceAlumno);
    return genericDao.findAll(
        `
              SELECT forma_pago.id as id_forma_pago,
                    forma_pago.nombre as nombre_forma_pago,
                    pago.identificador_factura ,
                    pago.identificador_pago,
                    r.id,                    
                    r.fecha,
                    to_char(pago.fecha,'dd-mm-yyyy HH24:MI') as fecha_format,
                    r.co_pago_balance_alumno,
                    r.co_cargo_balance_alumno,
                    r.pago,
                    pago.id as id_pago,
                    pago.nota,
                    pago.co_forma_pago,
                    pago.folio,
                    r.folio_factura                    
               FROM co_pago_cargo_balance_alumno r inner join co_pago_balance_alumno pago on r.co_pago_balance_alumno = pago.id
                                                   inner join co_forma_pago forma_pago on pago.co_forma_pago = forma_pago.id
               WHERE r.co_cargo_balance_alumno = $1 and r.eliminado = false and pago.eliminado = false
               ORDER BY pago.fecha DESC`,
        [idCargoBalanceAlumno]);
};


const getInfoPagoId= async (idPago)=>{

    return await genericDao.findOne(`
    WITH relacion_cargos AS (	              
        SELECT  cargo.id,            
            rel.pago,
            cat.nombre as nombre_cargo,			
            cargo.texto_ayuda, --nombre del mes
            cargo.pagado,
            cargo.nota as nota_cargo,
            cargo.cantidad,
            cargo.cargo,
            cargo.total,
            cargo.descuento,
            cargo.total_pagado,
            esp.nombre as especialidad,
            'Semana '||semana.numero_semana_curso as numero_semana_curso,
            'Semana '||semana.numero_semana_curso as materia
        FROM co_pago_cargo_balance_alumno rel inner join co_cargo_balance_alumno cargo on rel.co_cargo_balance_alumno = cargo.id									
                                        inner join cat_cargo cat on cat.id = cargo.cat_cargo												                                                
                                        left join co_curso curso on curso.id = cargo.co_curso
                                        left join cat_especialidad esp on esp.id =  curso.cat_especialidad
                                        left join co_curso_semanas semana on semana.id =  cargo.co_curso_semanas                                        
         WHERE rel.co_pago_balance_alumno = $1 and cargo.eliminado = false 		                 
    ) select pago.id,
            pago.folio as folio,
            pago.pago,
            fpago.nombre as forma_pago,
            fpago.permite_factura as permite_factura_forma_pago,
            pago.identificador_factura,
            pago.identificador_pago,
            TO_CHAR(pago.fecha, 'dd-mm-yyyy HH24:mi') as fecha,		            
            al.nombre as nombre_alumno,
            al.correo as correo_alumno,
            al.apellidos as apellidos_alumno,                                        
            suc.id as id_sucursal,
            suc.nombre as nombre_sucursal,
            suc.direccion as direccion_sucursal,		
            suc.telefono as telefono_sucursal,		
            count(cargo.id) as count_cargos,		
            suc.co_empresa,
            u.id as id_genero,
            u.nombre as nombre_usuario,            
            case when u.correo_copia is not null then u.correo||','||u.correo_copia else u.correo end as correo_copia_usuario,
            array_to_json(array_agg(to_json(cargo.*))) AS cargos
        from co_pago_balance_alumno pago inner join co_pago_cargo_balance_alumno rel on pago.id = rel.co_pago_balance_alumno
                            inner join relacion_cargos cargo on rel.co_cargo_balance_alumno = cargo.id
                            inner join co_forma_pago fpago on fpago.id = pago.co_forma_pago									
                            inner join co_alumno al on al.id = pago.co_alumno																		                            
                            inner join co_sucursal suc on al.co_sucursal = suc.id									
                            inner join usuario u on u.id = pago.genero
        where pago.id = $1
        group by pago.id,fpago.permite_factura,fpago.nombre,al.nombre,al.apellidos,al.correo,suc.id,suc.nombre,suc.direccion,suc.co_empresa,u.nombre,u.correo_copia,u.id

    `,[idPago]);

}

/*
const getAlumnoByPagoId = (idPago) => {
    console.log("@getPagosByCargoId");

    console.log("request.params.id_cargo_balance_alumno " + idCargoBalanceAlumno);
    return genericDao.findAll(
        `
              SELECT forma_pago.id as id_forma_pago,
                    forma_pago.nombre as nombre_forma_pago,
                    pago.identificador_factura ,
                    pago.identificador_pago,
                    r.id,                    
                    r.fecha,
                    to_char(pago.fecha,'dd-mm-yyyy HH24:mm') as fecha_format,
                    r.co_pago_balance_alumno,
                    r.co_cargo_balance_alumno,
                    r.pago,
                    pago.nota,
                    pago.co_forma_pago,
                    r.folio_factura                    
               FROM co_pago_cargo_balance_alumno r inner join co_pago_balance_alumno pago on r.co_pago_balance_alumno = pago.id
                                                   inner join co_forma_pago forma_pago on pago.co_forma_pago = forma_pago.id
               WHERE r.co_cargo_balance_alumno = $1 and r.eliminado = false and pago.eliminado = false
               ORDER BY pago.fecha DESC`,
        [idCargoBalanceAlumno]);
};*/




module.exports = {
    registrarPago,
    getPagosByCargoId,
    getInfoPagoId

}