
const handle = require('../helpers/handlersErrors');
const catUnidadMedidaService = require('../services/catUnidadMedidaService');

const getAll = async (request, response) => {
    console.log("@getAllUnidadMedida");
    try {
                   
            const coEmpresa = parseInt(request.params.coEmpresa);
            
            const results = await catUnidadMedidaService.getAll(coEmpresa);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const createUnidadMedida = async (request, response) => {
    console.log("@createUnidadMedida");
    try {
                  
            const data = request.body;
            
            const results = await catUnidadMedidaService.createUnidadMedida(data);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const updateUnidadMedida = async (request, response) => {
    console.log("@updateUnidadMedida");
    try {
                  
            const data = request.body;
            const id = request.params.id;
            
            const results = await catUnidadMedidaService.updateUnidadMedida(id,data);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const deleteUnidadMedida = async (request, response) => {
    console.log("@deleteUnidadMedida");
    try {
                  
            const data = request.body;
            const id = request.params.id;
            
            const results = await catUnidadMedidaService.deleteUnidadMedia(id,data);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


module.exports = {
    createUnidadMedida,
    updateUnidadMedida,
    deleteUnidadMedida,
    getAll
};