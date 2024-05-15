
const { getQueryInstance } = require('../controllers/sqlHelper');
const { castDateToStr } = require('../utils/UtilsDate');
const { ExceptionBD } = require('../exception/exeption');
//const { isEmptyOrNull } = require('../utils/Utils');
const genericDao = require('./genericDao');

const registrarGasto = (gastoData) => {
    console.log("@registrarGasto");
    return new Promise((resolve, reject) => {

      const { cat_tipo_gasto, co_forma_pago, co_sucursal, fecha, gasto, observaciones, genero } = gastoData;

        getQueryInstance(
            `INSERT INTO CO_GASTO(cat_tipo_gasto,co_forma_pago,co_sucursal,fecha,gasto,observaciones,genero,fecha_genero)
                    VALUES($1,$2,$3,$4,$5,$6,$7,(getDate('')+getHora(''))) returning id;`,
            [cat_tipo_gasto, co_forma_pago, co_sucursal, new Date(fecha), gasto, observaciones, genero])
            .then((results) => {
                resolve(results.rowCount > 0 ? results.rows[0].id : 0);
            }).catch((error => {
                reject(new ExceptionBD(error));
            }));
    });
};


const modificarGasto = (gastoData) => {
    console.log("@modificarGasto");

    return new Promise((resolve, reject) => {

        /*  if(!validarGasto(gastoData)){
              reject(new Exception("Datos incompletos","Datos incompletos"));    
              return;            
          }       
  */

        const { id, cat_tipo_gasto, co_forma_pago, fecha, gasto, observaciones, genero } = gastoData;
//
        getQueryInstance(`
            UPDATE CO_GASTO
                SET cat_tipo_gasto = $2,
                    co_forma_pago = $3,                            
                    fecha = $4,
                    gasto = $5,
                    observaciones = $6,
                    modifico = $7,
                    fecha_modifico = (getDate('')+getHora(''))::timestamp
             WHERE ID = $1 returning id;
            `, [id, cat_tipo_gasto, co_forma_pago, fecha, gasto, observaciones, genero])
            .then(result => {
                resolve(result.rowCount > 0 ? result.rows[0].id : 0);
            }).catch(error => {
                reject(new ExceptionBD(error));
            });
    });
};


const eliminarGasto = (idGasto, genero) => {
    console.log("@eliminarGasto");

    return genericDao.eliminarPorId("CO_GASTO", idGasto, genero);

};

const getCatalogoTipoGasto = (idEmpresa) => {
    console.log("@getCatalogoTipoGasto "+idEmpresa);
    return  genericDao.findAll("SELECT * FROM cat_tipo_gasto WHERE  (sistema = true or co_empresa = $1)  AND eliminado = false order by nombre", [idEmpresa]);

};


const getGastosPorSucursal = (idSucursal, anioMes) => {
    console.log("@getGastosPorSucursal");
    console.log("request.params.co_sucursal" + idSucursal);

    const co_sucursal = idSucursal;
    const anio_mes = anioMes;
    return genericDao.findAll(
            queryBaseGastoSucursal(" suc.id = $1 and to_char(g.fecha,'YYYYMM') = $2 ")       
        , [co_sucursal, anio_mes]);
};

const findById = (id) => {
    console.log("@findById");
    console.log("id " + id);
    return genericDao.findOne(
            queryBaseGastoSucursal(" g.id = $1 ")       
        , [id]);
};


const getGastosSumaCortePorSucursal = async (corteData) => {
    
    console.log("@getGastosSumaCortePorSucursal");

    const {idSucursal,fechaInicio,fechaFin} = corteData;
        
    return await genericDao.findOne(
            `select 
            coalesce(sum(g.gasto),0)  as total
            from co_gasto g                 						
            where g.co_sucursal = $1 
                and g.fecha::date between $2::date and $3::date                
                and g.eliminado  = false                        `
        , [idSucursal, castDateToStr(fechaInicio),castDateToStr(fechaFin)]);
};

const getGastosCortePorSucursal = async (corteData) => {
    
    console.log("@getGastosCortePorSucursal");

    const {idSucursal,fechaInicio,fechaFin} = corteData;
    
    console.log("request.params.co_sucursal" + idSucursal);
    return await genericDao.findAll(
            queryBaseGastoSucursal(" suc.id = $1 and g.fecha::date between $2::date and  $3::date ")       
        , [idSucursal, castDateToStr(fechaInicio),castDateToStr(fechaFin)]);
};

const queryBaseGastoSucursal = (criterio)=>`
select 
tipo.nombre as nombre_tipo_gasto, 
fpago.nombre as nombre_tipo_pago,
suc.nombre as nombre_sucursal,
g.fecha,
to_char(g.fecha::date,'dd-mm-yyyy') as fecha_text,
to_char(g.fecha_genero,'dd-mm-yyyy HH24:mm') as fecha_hora_text,
g.id,
g.cat_tipo_gasto,
g.co_forma_pago,
g.co_sucursal,
suc.co_empresa,
g.gasto,
g.observaciones,
(g.fecha_genero::date = getDate('')) as es_nuevo,
u.nombre as registro,
g.genero
from co_gasto g inner join cat_tipo_gasto tipo on g.cat_tipo_gasto = tipo.id
    inner join co_forma_pago fpago on g.co_forma_pago = fpago.id
    inner join co_sucursal suc on g.co_sucursal = suc.id
    inner join usuario u on u.id = g.genero     
where ${criterio ? criterio+" and ":''} 
       g.eliminado  = false          
order by g.fecha desc       
`;

const getSumaMesGastosPorSucursal = (idSucursal) => {
    console.log("@getSumaMesGastosPorSucursal");
   
        console.log("request.params.co_sucursal" + idSucursal);

        return genericDao.findAll(
            `
        with meses AS(
            select generate_series(('2021-12-01'::date),(date_trunc('month',current_date) + '1 month - 1 day')::date,'1 month') as mes
        ) select
                to_char(m.mes,'Mon-YYYY') as mes_anio,
                to_char(m.mes,'YYYYMM') as anio_mes,
                coalesce(sum(gasto.gasto),0) as suma
          from meses m left join co_gasto gasto on to_char(m.mes,'YYYYMM') = to_char(gasto.fecha,'YYYYMM') and gasto.eliminado = false			
                    and gasto.co_sucursal = $1
        group by to_char(m.mes,'Mon-YYYY'),to_char(m.mes,'YYYYMM')
        order by to_char(m.mes,'YYYYMM') desc                             
        `,
            [idSucursal]);
       
};


const getSumaGastoMesActual = (idSucursal) => {
    console.log("@getSumaGastoMesActual"); 
       return genericDao.findOne(
            `
            select coalesce(
                (                
                    select         
                	    sum(g.gasto) as gasto_sucursal
                    from co_gasto g                        
                    where  g.eliminado  = false
                        and g.co_sucursal = $1
                        and to_char(g.fecha,'YYYY-MM') = to_char(getDate(''),'YYYY-MM')                        
                ) ,0) as suma_mensual_sucursal                         
        `,
            [idSucursal]);
       
};




//fix es por mes y sucursal
const getGastosAgrupadosPorSucursal = (idSucursal) => {
    console.log("@getGastosAgrupadosPorSucursal");
          console.log("request.params.co_sucursal" + idSucursal);

       return genericDao.findAll( `               
        select 
            tipo.nombre as nombre_tipo_gasto, 
            fpago.nombre as nombre_tipo_pago,
            suc.nombre as nombre_sucursal,
            sum(g.gasto) as gasto_sucursal
        from co_gasto g inner join cat_tipo_gasto tipo on g.cat_tipo_gasto = g.id
                inner join co_forma_pago fpago on g.co_forma_pago = fpago.id
                inner join co_sucursal suc on g.co_sucursal = suc.id
        where  g.eliminado  = false
        group by tipo.nombre,fpago.nombre,suc.nombre
        `, [idSucursal]);
        
};


module.exports = {
    registrarGasto,
    modificarGasto,
    eliminarGasto,
    getCatalogoTipoGasto,
    getGastosPorSucursal,
    getSumaMesGastosPorSucursal,
    getGastosAgrupadosPorSucursal,
    getGastosCortePorSucursal,
    getGastosSumaCortePorSucursal,
    getSumaGastoMesActual,
    findById

};