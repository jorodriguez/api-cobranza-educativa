const genericDao = require('./genericDao');

const getEmpresaId = async (idEmpresa) => {
    console.log("@getEmpresaId");
    return await genericDao.findOne(
    `select * from co_empresa where id = $1 and eliminado = false and activa = true `, [idEmpresa]);
};

const getCuentasEmpresa = async () => {
    console.log("@getCuentasEmpresa");
    return await genericDao.findAll(
    `select * from co_empresa where  eliminado = false and activa = true `, []);
};


module.exports = {
    getEmpresaId,
    getCuentasEmpresa
};