
const handle = require('../helpers/handlersErrors');

const catHorarioService = require('../services/catHorarioService');

const getHorarios = async (request, response) => {
    console.log("@getHorarios");
    try {
        
        const { id_empresa } = request.params;

        const results = await catHorarioService.getHorarios(id_empresa);
        
        response.status(200).json(results);       
       
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


module.exports = {
    getHorarios
};