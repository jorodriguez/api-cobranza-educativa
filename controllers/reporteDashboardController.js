
const handle = require('../helpers/handlersErrors');
const reporteDashboardService = require('../services/reporteDashboardService');

const getContadoresDashboard = async (request, response) => {
    console.log("@getContadoresDashboard");
    try {

        const { coEmpresa,coSucursal } = request.params;
        
        const contadores = await reporteDashboardService.getDashboardContadores({coEmpresa,coSucursal});

        response.status(200).json(contadores);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const getTotalesCargos = async (request, response) => {
    console.log("@getTotalesCargos");
    try {

        const { coEmpresa,coSucursal } = request.params;
        
        const totalAdeudoSucursal = await reporteDashboardService.getTotalAdeudoSucursal({coEmpresa,coSucursal});
        
        const totalAdeudoDesgloseCargos = await reporteDashboardService.getTotalAdeudoDesgloseCargosSucursal({coEmpresa,coSucursal});
        
        response.status(200).json({...totalAdeudoSucursal,totalAdeudoDesgloseCargos});

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const getTotalesInscripciones = async (request, response) => {
    console.log("@getTotalesInscripciones");
    try {

        const parametros = { coEmpresa,coSucursal } = request.params;
        
        const totalInscripciones = await reporteDashboardService.getTotalInscripciones(parametros);
        
        const totalInscripcionesDesgloseCurso = await reporteDashboardService.getTotalInscripcionesDesgloseCurso(parametros);
        
        response.status(200).json({...totalInscripciones,totalInscripcionesDesgloseCurso});

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const getTopAlumnosDeudores = async (request, response) => {
    console.log("@getTopAlumnosDeudores");
    try {

        const parametros = { coEmpresa,coSucursal } = request.params;
        
        const topAlumnosDeudores = await reporteDashboardService.getTopAlumnosDeudores(parametros);
                
        response.status(200).json(topAlumnosDeudores);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const getTotalAdeudoPorCurso = async (request, response) => {
    console.log("@getTotalAdeudoPorCurso");
    try {

        const parametros = { coEmpresa,coSucursal } = request.params;
        
        const totalAdeudosPorCurso = await reporteDashboardService.getTotalAdeudoPorCurso(parametros);
                
        response.status(200).json(totalAdeudosPorCurso);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};



module.exports = {
    getContadoresDashboard,getTotalesCargos,getTotalesInscripciones,getTopAlumnosDeudores,getTotalAdeudoPorCurso
};
