const moment = require('moment');
const corteService = require('../services/corteService');
const {TIPO_TEMPLATE} = require('../utils/Constantes');
const handle = require('../helpers/handlersErrors');
const notificacionService = require('../utils/NotificacionService');

const getCorteDiaSucursal = async (request, response) => {
    console.log("@getCorteDiaSucursal");
    try {

        const id_sucursal = request.params.id_sucursal;
        
        const {fechaInicio,fechaFin,id_usuario} = request.body;        
        
        console.log("-----------"+JSON.stringify(request.body));
               
        
        if (!id_sucursal || !fechaInicio ||!fechaFin ) {
            handle.callbackError("parametros incompletos", response);
            return;
        }

        const _fechaInicio = moment(fechaInicio).format('YYYY-MM-DD');
        const _fechaFin = moment(fechaFin).format('YYYY-MM-DD');
        
        console.log("fecha format "+_fechaInicio+" f fin "+_fechaFin);

        const results = await corteService.getCorteDiaSucursal({idSucursal:id_sucursal,fechaInicio:_fechaInicio,fechaFin:_fechaFin});
             

       response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

/*
const getCorteDia = async(idSucursal,idUsuario,fecha)=>{
             
        
    if (!idSucursal || !fecha ) {
        throw "error de validación faltan datos";        
    }

    const _fecha = moment(fecha).format('YYYY-MM-DD');
    
    console.log("fecha format "+_fecha);

    const results = await corteService.getCorteDiaSucursal({idSucursal:idSucursal,idUsuario:idUsuario, fecha:_fecha});

    return results;
}
*/

const getHtmlCorteDiaSucursal = async (request, response) => {
    console.log("@getHtmlCorteDiaSucursal");
    try {

        const id_sucursal = request.params.id_sucursal;
        
        const {fechaInicio,fechaFin,id_usuario} = request.body;        

        if (!id_sucursal || !fechaInicio ||!fechaFin ) {
            handle.callbackError("parametros incompletos", response);
            return;
        }

        const _fechaInicio = moment(fechaInicio).format('YYYY-MM-DD');
        const _fechaFin = moment(fechaFin).format('YYYY-MM-DD');
        
        const html = await corteService.getHtmlCorteDiaSucursal(
                    {
                        idSucursal:id_sucursal,
                        idUsuario:id_usuario,
                        fechaInicio:_fechaInicio,
                        fechaFin:_fechaFin,
                        tipoTemplate:TIPO_TEMPLATE.CORTE_DIARIO}
            );
                
        response.status(200).send(html);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


module.exports = {
    getCorteDiaSucursal,
    getHtmlCorteDiaSucursal,    
};