const especialidadDao = require('../dao/especialidadDao');

module.exports = {          
    getEspecialidad    :especialidadDao.getEspecialidad,
    findById           :especialidadDao.findById,
    createEspecialidad :especialidadDao.createEspecialidad,
    updateEspecialidad :especialidadDao.updateEspecialidad,
    deleteEspecialidad :especialidadDao.deleteEspecialidad
};