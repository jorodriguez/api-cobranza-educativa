
const handle = require('../helpers/handlersErrors');

const catMateriaService = require('../services/catMateriaService');

const getMateriasEspecialidad = async (request, response) => {
    console.log("@getMateriasEspecialidad");
    try {
        
        const {id_especialidad } = request.params;        
        const results = await catMateriaService.getMateriasEspecialidad(id_especialidad);
        response.status(200).json(results);       
       
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};



module.exports = { getMateriasEspecialidad };