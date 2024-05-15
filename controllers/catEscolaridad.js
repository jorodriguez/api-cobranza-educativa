
const handle = require('../helpers/handlersErrors');

const catEscolaridadService = require('../services/catEscolaridadService');

const getEscolaridad = async (request, response) => {
    console.log("@getEscolaridad");
    try {
                
        const results = await catEscolaridadService.getEscolaridad();
        
        response.status(200).json(results);       
       
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


module.exports = {
    getEscolaridad
};