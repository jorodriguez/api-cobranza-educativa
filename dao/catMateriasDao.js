const genericDao = require("./genericDao");

const getMateriasEspecialidad = async (idEspecialidad) => {
  console.log("@getMateriasEspecialidad");

  return await genericDao.findAll(
      `                  
      select *,
      (select array_to_json(array_agg(to_json(mat.*))) from co_materia_modulo_especialidad mat where mat.co_modulo_especialidad = m.id and mat.eliminado = false) as materias
      from co_modulo_especialidad m 
    where 
      m.cat_especialidad = $1
      and m.eliminado = false
      order by m.numero_orden 
      `,
    [idEspecialidad]
  );
};

module.exports = { getMateriasEspecialidad };
