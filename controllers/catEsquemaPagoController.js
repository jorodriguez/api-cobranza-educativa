const handle = require('../helpers/handlersErrors');

const catEsquemaPagoService = require('../services/catEsquemaPagoService');

const getEsquemaPago = async(request, response) => {
    console.log("@getEsquemaPago");
    try {

        const results = await catEsquemaPagoService.getEsquemaPago

        response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


module.exports = {
    getEsquemaPago
};