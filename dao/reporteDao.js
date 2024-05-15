
const genericDao = require('./genericDao');
const {castDateToStr} = require('../utils/UtilsDate');
const { Exception } = require('../exception/exeption');


const getReportes = async () => {
    console.log("@getReportes");      
      
    return await genericDao.findAll(`SELECT id,nombre,columnas,rango_fecha,criterio_busqueda FROM SI_REPORTE WHERE ELIMINADO = FALSE`,[]);
};



const getEjecucionReporte = async (parametrosData) => {
    console.log("@getEjecucionReporte");
  
    const {idReporte,idSucursal,fechaInicio,fechaFin} = parametrosData;
    console.log("ID REPORTE = "+idReporte);
    const reporte = await genericDao
                        .findOne(
                            `SELECT id,nombre,consulta,columnas,rango_fecha,criterio_busqueda FROM SI_REPORTE WHERE ID = $1 AND ELIMINADO = FALSE`,
                            [idReporte]
                        );            
    console.log("REGISTRO "+reporte);

    if(!reporte){
        throw new Exception("No se encuentra el reporte");
    }
  
    const fechaInicioFormat =castDateToStr(fechaInicio);
    const fechaFinFormat =castDateToStr(fechaFin);

    let params = [];
    
    params[0] = idSucursal;

    if(reporte.rango_fecha){
        params[1] = fechaInicioFormat;
        params[2] = fechaFinFormat;        
    }

    console.log("CONSULTA "+reporte.consulta);

    console.log(`Parametros ${params}`);

    return await genericDao.findAll(`${reporte.consulta}`,params);
};

const getReporteInscripcionesPorAgenteAnual = async (parametrosData) => {
    console.log("@getReporteInscripcionesPorAgenteAnual");
  
    const {idSucursal,idUsuario} = parametrosData;

    const reporte = await genericDao
                        .findAll(                           
        `
    with universo as (  
        select
            inscribio.nombre as inscribio,
            to_char(a.fecha_genero,'MM') as mes,	 
            count(i.*) as numero_inscripciones,	  
            array_to_json(array_agg(to_json(a.*)))::text as alumnos	
        from co_inscripcion i inner join co_alumno a on a.id = i.co_alumno
              inner join usuario inscribio on inscribio.id = i.usuario_inscribe
              inner join co_curso c on c.id = i.co_curso
              inner join cat_especialidad esp on esp.id = c.cat_especialidad
              inner join cat_dia dia on dia.id = c.cat_dia
              inner join usuario promotor on promotor.id = i.usuario_inscribe
              inner join cat_esquema_pago esquema on esquema.id = i.cat_esquema_pago
              inner join cat_genero genero on genero.id = a.cat_genero
        where 
            a.co_sucursal = $1
            and i.eliminado = false	 
            and to_char(a.fecha_genero,'YYYY') = to_char(current_date,'YYYY')
            and inscribio.id = $2
        group by inscribio.nombre,to_char(a.fecha_genero,'MM')        
            order by to_char(a.fecha_genero,'MM')    
    ) 
    select m.nombre as nombre_mes, u.*
    from universo u inner join si_meses m on m.id = u.mes::integer
                            `,
                            [idSucursal,idUsuario]
                        );                

    return reporte || [];
    
};



module.exports = {    
    getReportes    ,
    getEjecucionReporte,
    getReporteInscripcionesPorAgenteAnual
}