
const handle = require('../helpers/handlersErrors');
const catMarcaService = require('../services/catMarcaService');

const getAll = async (request, response) => {
    console.log("@getAllMarca");
    try {
                   
            const coEmpresa = parseInt(request.params.coEmpresa);
            
            const results = await catMarcaService.getAll(coEmpresa);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const createMarca = async (request, response) => {
    console.log("@createMarca");
    try {
                  
            const data = request.body;
            
            const results = await catMarcaService.createMarca(data);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const updateMarca = async (request, response) => {
    console.log("@updateMarca");
    try {
                  
            const data = request.body;
            const id = request.params.id;
            
            const results = await catMarcaService.updateMarca(id,data);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const deleteMarca = async (request, response) => {
    console.log("@deleteMarca");
    try {
                  
            const data = request.body;
            const id = request.params.id;
            
            const results = await catMarcaService.deleteMarca(id,data);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};



module.exports = {
    createMarca,
    updateMarca,
    deleteMarca,
    getAll
};