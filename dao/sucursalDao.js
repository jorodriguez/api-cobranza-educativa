const genericDao = require('./genericDao');

const registrarSucursal = async(sucursalData) => {
    console.log("@registrarSucursal");

    const { nombre, direccion, class_color, co_empresa, genero } = sucursalData;
    let sql = `INSERT INTO CO_SUCURSAL(nombre,direccion,class_color,co_empresa,foto,genero)
                VALUES($1,$2,$3,$4,$5,$6) returning id;`;

    return await genericDao.execute(sql, [nombre, direccion, class_color, co_empresa, genero]);

};


const modificarSucursal = async(sucursalData) => {
    console.log("@modificarSucursal");

    const { id, nombre, direccion, class_color, genero } = sucursalData;
    let sql = `
    UPDATE CO_SUCURSAL SET 
                    NOMBRE = TRIM(BOTH FROM $2),
                    DIRECCION = TRIM(BOTH FROM $3),                    
                    CLASS_COLOR = TRIM(BOTH FROM $4),                                        
                    MODIFICO = $5,                                                
                    FECHA_MODIFICO = (current_date+current_time)
    WHERE id = $1
    returning id;
    `;

    return await genericDao.execute(
        sql, [id, nombre, direccion, class_color, genero]);
};


const eliminarSucursal = async(id, genero) => {
    console.log("@eliminarSucursal");

    return await genericDao.eliminarPorId("CO_SUCURSAL", id, genero);

};

const getSucursalPorEmpresa = async(idEmpresa) => {
    console.log("@getSucursalPorEmpresa");
    return await genericDao.findAll("SELECT id,nombre,direccion,class_color,co_empresa,telefono FROM co_sucursal WHERE co_empresa =  $1 and eliminado = false order by nombre", [idEmpresa]);
};

const getSucursalPorId = async(idSucursal) => {
    console.log("@getSucursalPorId");
    //return await genericDao.findOne("SELECT id,nombre,direccion,class_color,co_empresa,telefono FROM co_sucursal WHERE id =  $1 and eliminado = false", [idSucursal]);
    return await genericDao.findOne("SELECT * FROM co_sucursal WHERE id =  $1 and eliminado = false", [idSucursal]);

};


module.exports = {
    registrarSucursal,
    modificarSucursal,
    eliminarSucursal,
    getSucursalPorEmpresa,
    getSucursalPorId
};