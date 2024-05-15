const genericDao = require("./genericDao");

const getCatCargo = async (idCatCargo) => {
  console.log("@getCatCargo");
  return await genericDao.findOne(` select * from cat_cargo where id = $1 and eliminado = false`,[idCatCargo]);
};

module.exports = { getCatCargo };
