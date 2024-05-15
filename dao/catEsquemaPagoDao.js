const genericDao = require("./genericDao");
const {
    ExceptionDatosFaltantes,
    ExceptionBD,
} = require("../exception/exeption");
const { isEmptyOrNull } = require("../utils/Utils");

const getEsquemaPago = async() => {
    console.log("@getEsquemaPago");

    return await genericDao.findAll(
        `              
      select *
      from cat_esquema_pago
      where eliminado = false      
      `, [idEmpresa]
    );
};

module.exports = { getEsquemaPago };