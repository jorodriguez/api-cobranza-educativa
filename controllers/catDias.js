
const handle = require('../helpers/handlersErrors');

const catDiaService = require('../services/catDiaService');

const getDias = async (request, response) => {
    console.log("@getDias");
    try {
        
        const { id_empresa } = request.params;

        const results = await catDiaService.getDias(id_empresa);
        
        response.status(200).json(results);       
       
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


module.exports = {
    getDias
};