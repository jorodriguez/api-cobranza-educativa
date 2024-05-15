
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



module.exports = {
    getAll
};