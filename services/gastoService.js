
const gastoDao = require("../dao/gastoDao");
const notificacionGastoService = require('../utils/NotificacionGastoService');


const registrarGasto = async (gastoData) =>{

    const idGastoRegistrado = await  gastoDao.registrarGasto(gastoData);  
    
    //enviar correo 
    if(idGastoRegistrado){
        notificacionGastoService.enviarNotificacionGasto(idGastoRegistrado,"Registro");
    }

    return idGastoRegistrado;

}

/*
const modificarGasto = (gastoData) => {
    console.log("@modificarGasto");   
    return gastoDao.modificarGasto(gastoData);
  
};


const eliminarGasto = (idGasto,genero) => {
    console.log("@eliminarGasto");   
    return gastoDao.eliminarGasto(idGasto,genero);

};

const getCatalogoTipoGasto = () => {

    return gastoDao.getCatalogoTipoGasto();
  
};


const getGastosPorSucursal = (request, response) => {
    console.log("@getGastosPorSucursal");
    try {
        console.log("request.params.co_sucursal" + request.params.co_sucursal);

        const co_sucursal = request.params.co_sucursal;
        const anio_mes = request.params.anio_mes;
        pool.query(
            `
                select 
                    tipo.nombre as nombre_tipo_gasto, 
                    fpago.nombre as nombre_tipo_pago,
                    suc.nombre as nombre_sucursal,
                    g.fecha::date as fecha,
                    g.*
                from co_gasto g inner join cat_tipo_gasto tipo on g.cat_tipo_gasto = tipo.id
                    inner join co_forma_pago fpago on g.co_forma_pago = fpago.id
                    inner join co_sucursal suc on g.co_sucursal = suc.id
                where suc.id = $1 and g.eliminado  = false  
                        and to_char(g.fecha,'YYYYMM') = $2
                order by g.fecha desc                
            `,
            [co_sucursal, anio_mes],
            (error, results) => {
                if (error) {
                    handle.callbackError(error, response);
                    return;
                }

                response.status(200).json(results.rows);
            });
    } catch (e) {
        handle.callbackErrorNoControlado(e, response);
    }
};


module.exports={registrarGasto,modificarGasto,eliminarGasto,getCatalogoTipoGasto}*/

module.exports = {registrarGasto, 
                modificarGasto: gastoDao.modificarGasto,
                eliminarGasto:gastoDao.eliminarGasto,
                getCatalogoTipoGasto : gastoDao.getCatalogoTipoGasto,
                getGastosPorSucursal : gastoDao.getGastosPorSucursal,
                findById : gastoDao.findById,
                getSumaMesGastosPorSucursal: gastoDao.getSumaMesGastosPorSucursal,
                getGastosAgrupadosPorSucursal: gastoDao.getGastosAgrupadosPorSucursal,
                getGastosCortePorSucursal: gastoDao.getGastosCortePorSucursal,
                getGastosSumaCortePorSucursal: gastoDao.getGastosSumaCortePorSucursal,
                getSumaGastoMesActual : gastoDao.getSumaGastoMesActual,
                findById : gastoDao.findById


};
