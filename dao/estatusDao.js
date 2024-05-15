
const genericDao = require('./genericDao');

const getEstatus = async () => {

    console.log("@getEstatus");  
    
    return await genericDao.findAll(`select id,nombre from si_estatus  where eliminado = false`,[]);
};


module.exports = {    
    getEstatus
}