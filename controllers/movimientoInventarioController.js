
const handle = require('../helpers/handlersErrors');
const movimientoInventarioService = require('../services/movimientoInventarioService');


const createMovimientoInventario = async (request, response) => {
    console.log("@createMovimientoInventario");
    try {
                  
            const data = request.body;                       
            
            const results = await movimientoInventarioService.guardarMovimientoInventario(data);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};



module.exports = {
    createMovimientoInventario
    
};