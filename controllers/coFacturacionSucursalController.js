const handle = require('../helpers/handlersErrors');
const coFacturacionSucursalService = require('../services/coFacturacionSucursalService');

const getAll = async(request, response) => {
    console.log("@getAllFacturacion");
    try {

        const coSucursal = parseInt(request.params.coSucursal);

        const results = await coFacturacionSucursalService.getAll(coSucursal);

        response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const getAdeudoSucursal = async(request, response) => {
    console.log("@getAdeudoSucursal");
    try {

        const coSucursal = parseInt(request.params.coSucursal);

        const results = await coFacturacionSucursalService.getSumaAdeudaSucursal(coSucursal)

        response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const ejecutarProcesoFacturacionSucursal = async(request, response) => {
    console.log("@ejecutarProcesoFacturacionSucursal");
    try {

        const data = request.body;

        const results = await coFacturacionSucursalService.procesoGenerarFacturacion();

        response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const updateComprobante = async(request, response) => {
    console.log("@updateComprobante");
    try {

        const data = { genero } = request.body;

        const id = request.params.id;

        const results = await coFacturacionSucursalService.updateComprobante(id, { genero: genero });

        response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};



const validarPago = async(request, response) => {
    console.log("@updateComprobante");
    try {

        const data = { aceptado, nota_rechazo, genero } = request.body;

        const id = request.params.id;
        let results = null;

        if (aceptado) {
            results = await coFacturacionSucursalService.aceptarPago(id, { genero: genero });
        } else {
            results = await coFacturacionSucursalService.rechazarPago(id, { nota_rechazo: nota_rechazo, genero: genero })
        }


        response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


module.exports = {
    updateComprobante,
    getAll,
    ejecutarProcesoFacturacionSucursal,
    validarPago,
    getAdeudoSucursal
};