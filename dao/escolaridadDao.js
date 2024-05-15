const genericDao = require("./genericDao");
const {
  ExceptionDatosFaltantes,
  ExceptionBD,
} = require("../exception/exeption");
const { isEmptyOrNull } = require("../utils/Utils");

const getEscolaridad = async () => {
  console.log("@getEscolaridad");

  return await genericDao.findAll(
      `              
      select id,
            nombre        
      from cat_escolaridad
      where eliminado = false
      order by id
      `,
    []
  );
};



module.exports = {
  getEscolaridad
};
