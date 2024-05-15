const moment = require('moment');
const estatusService = require('../services/estatusService');
const handle = require('../helpers/handlersErrors');

const getEstatus = async (request, response) => {
    console.log("@getEstatus");
    try {                                    
        const results = await estatusService.getEstatus();

       response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

module.exports = {
    getEstatus
};