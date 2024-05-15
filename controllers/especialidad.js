
const handle = require('../helpers/handlersErrors');

const especialidadService = require('../services/especialidadService');

const getEspecialidad = async (request, response) => {
    console.log("@getEspecialidad");
    try {
        
        const { id_empresa,id_sucursal } = request.params;

        const results = await especialidadService.getEspecialidad(id_empresa,id_sucursal);
        
        response.status(200).json(results);       
       
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const findById = async (request, response) => {
    console.log("@findById");
    try {
        
        const { id } = request.params;

        const results = await especialidadService.findById(id);
        
        response.status(200).json(results);       
       
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const createEspecialidad = async (request, response) => {
    console.log("@createEspecialidad");
    try {
                  
            const data = request.body;
            
            const results = await especialidadService.createEspecialidad(data);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const updateEspecialidad = async (request, response) => {
    console.log("@updateEspecialidad");
    try {
                  
            const data = request.body;

            const id = request.params.id;
            
            const results = await especialidadService.updateEspecialidad(id,data);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const deleteEspecialidad = async (request, response) => {
    console.log("@deleteEspecialidad");
    try {
                  
            const data = request.body;

            const id = request.params.id;
            
            const results = await especialidadService.deleteEspecialidad(id,data);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

module.exports = {
    getEspecialidad,
    createEspecialidad,
    updateEspecialidad,
    deleteEspecialidad,
    findById
};