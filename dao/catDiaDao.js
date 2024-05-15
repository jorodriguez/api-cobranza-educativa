const genericDao = require("./genericDao");
const {
  ExceptionDatosFaltantes,
  ExceptionBD,
} = require("../exception/exeption");
const { isEmptyOrNull } = require("../utils/Utils");

const getDias = async (idEmpresa) => {
  console.log("@getDias");

  return await genericDao.findAll(
      `              
      select *,false as checked
      from cat_dia
      where co_empresa = $1 and eliminado = false
      order by numero_dia       
      `,
    [idEmpresa]
  );
};

module.exports = { getDias };
