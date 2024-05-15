const genericDao = require("./genericDao");
const {
  ExceptionDatosFaltantes,
  ExceptionBD,
} = require("../exception/exeption");
const { isEmptyOrNull } = require("../utils/Utils");

const getHorarios = async (idEmpresa) => {
  console.log("@getHorarios");

  return await genericDao.findAll(
      `              
      select *
      from cat_horario
      where co_empresa = $1 and eliminado = false
      order by nombre       
      `,
    [idEmpresa]
  );
};

module.exports = { getHorarios };
