const reporteService = require('../services/reporteService');
const handle = require('../helpers/handlersErrors');
const moment = require('moment');
moment().format('ll');
require('moment/locale/es'); // without this line it didn't work
moment.locale('es');

const getEjecucionReporte = async (request, response) => {
    console.log("@getEjecucionReporte");
    try {

        //const id_sucursal = request.params.id_sucursal;
        
        const {id_reporte,fecha_inicio,fecha_fin,id_sucursal} = request.body;        
        
        console.log(JSON.stringify(request.body))
                
        if (!id_reporte || !id_sucursal || !fecha_inicio ||!fecha_fin ) {
            handle.callbackError("parametros incompletos", response);
            return;
        }

        const _fechaInicio = moment(fecha_inicio).format('YYYY-MM-DD');
        const _fechaFin = moment(fecha_fin).format('YYYY-MM-DD');
        
        const results = await reporteService
                            .getEjecucionReporte({
                                idReporte:id_reporte,
                                idSucursal:id_sucursal,
                                fechaInicio:_fechaInicio,
                                fechaFin:_fechaFin
    });
             

       response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};



const getReportes = async (request, response) => {
    console.log("@getReportes");
    try {

         //const {} request.params
        
        const results = await reporteService.getReportes();             

        response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};



const getReporteInscritosPorAgente = async (request, response) => {
    console.log("@getReporteInscritosPorAgente");
    try {

        const { idSucursal,  idUsuario} = request.params;

        const results = await reporteService.getReporteInscripcionesPorAgenteAnual({idSucursal, idUsuario});

        response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


module.exports = {
    getEjecucionReporte,
    getReportes,
    getReporteInscritosPorAgente
};