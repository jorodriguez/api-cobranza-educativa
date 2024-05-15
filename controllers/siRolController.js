
const handle = require('../helpers/handlersErrors');
const siRolService = require('../services/siRolService');

const getAll = async (request, response) => {
    console.log("@getAllRol");
    try {
                   
            //const coEmpresa = parseInt(request.params.coEmpresa);
            
            const results = await siRolService.getAll();

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};



module.exports = {    
    getAll
};