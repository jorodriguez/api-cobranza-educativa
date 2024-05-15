const coFacturacionSucursalDao = require('../dao/coFacturacionSucursalDao');

const procesoGenerarFacturacion = async() => {

    const lista = await coFacturacionSucursalDao.getSucursalesAgregarRegistro();
    const ret = [];

    if (!lista) {
        console.log("No existen sucursales para registrar facturación");
        return;
    }

    for (let i = 0; i < lista.length; i++) {

        const suc = lista[i];

        console.log("======================");
        console.log(JSON.stringify(suc));
        console.log("======================");

        const res = await coFacturacionSucursalDao.crear({
            coSucursal: suc.id,
            nombreMensualidad: `${suc.nombre_mes_actual} ${suc.anio_actual}`,
            monto: suc.mensualidad,
            nota: `Monto mensual correspondiente a ${suc.nombre_mes_actual} ${suc.anio_actual}`,
            genero: 1
        });

        ret.push(res);
    }

    return ret;
}



module.exports = { procesoGenerarFacturacion, ...coFacturacionSucursalDao };