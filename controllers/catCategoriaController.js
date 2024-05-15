
const handle = require('../helpers/handlersErrors');
const catCategoriaService = require('../services/catCategoriaService');

const getAll = async (request, response) => {
    console.log("@getAllCategoria");
    try {
                   
            const coEmpresa = parseInt(request.params.coEmpresa);
            
            const results = await catCategoriaService.getAll(coEmpresa);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const createCategoria = async (request, response) => {
    console.log("@createCategoria");
    try {
                  
            const data = request.body;
            
            const results = await catCategoriaService.createCategoria(data);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const updateCategoria = async (request, response) => {
    console.log("@updateCategoria");
    try {
                  
            const data = request.body;
            const id = request.params.id;
            
            const results = await catCategoriaService.updateCategoria(id,data);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const deleteCategoria = async (request, response) => {
    console.log("@deleteCategoria");
    try {
                  
            const data = request.body;
            const id = request.params.id;
            
            const results = await catCategoriaService.deleteCategoria(id,data);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


module.exports = {
    createCategoria,
    updateCategoria,
    deleteCategoria,
    getAll
};