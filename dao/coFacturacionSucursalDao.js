const genericDao = require('./genericDao');

const getAll = async(coSucursal) => {
    console.log("@getAllFacturacionSucursal");
    return await genericDao.findAll(queryBase(), [coSucursal]);
};

const getSucursalesAgregarRegistro = async() => {
    console.log("@getAllsucursal");

    return await genericDao.findAll(`
        select (select nombre from si_meses where id = to_char(getDate(''),'MM')::integer and eliminado = false) as nombre_mes_actual,
        (select to_char(getDate(''),'YYYY')) as anio_actual,
                * 
        from co_sucursal
        where id not in (
	        select co_sucursal 
	        from co_facturacion_sucursal f 
	        where f.eliminado = false and to_char(f.fecha_mensualidad,'YYYYMM') = to_char(getDate(''),'YYYYMM')
        ) and eliminado = false
`, []);
};


const getSumaAdeudaSucursal = async(coSucursal) => {
    console.log("@getSumaAdeudaSucursal");

    return await genericDao.findOne(`
                select coalesce(sum(monto),0) as adeuda from co_facturacion_sucursal where (pago_aceptado is null or pago_aceptado=false) and co_sucursal = $1  and eliminado = false
`, [coSucursal]);
};




const aceptarPago = async(id, data) => {
    console.log("@aceptarPago");

    try {

        const dataSeg = { genero } = data;

        const result = await genericDao.execute(`
                    update co_facturacion_sucursal
                        set pago_aceptado = true,
                            fecha_pago_aceptado = (getDate('')+ getHora(''))::timestamp,
                            fecha_modifico = (getDate('')+getHora('')),
                            modifico = $1 
                        where id = $1 returning id;
                        
            `, [id, genero]);

        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}


const rechazarPago = async(id, data) => {
    console.log("@rechazarPago");

    try {

        const dataSeg = { nota, genero } = data;

        const result = await genericDao.execute(`
                    update co_facturacion_sucursal
                        set pago_aceptado = false,
                            fecha_pago_cancelado = (getDate('')+ getHora(''))::timestamp,
                            nota_rechazo,
                            fecha_modifico = (getDate('')+getHora('')),
                            modifico = $1 
                        where id = $1 returning id;
                        
            `, [id, genero]);

        return result;

    } catch (error) {
        console.log(error);
        return null;
    }

}



const updateComprobante = async(id, data) => {
    console.log("@updateComprobante");

    try {

        const dataSeg = { url, genero } = data;

        const result = await genericDao.execute(`
                    update co_facturacion_sucursal
                        set comprobante_pago_url = $2,
                            fecha_adjunto_comprobante = (getDate('')),
                            fecha_modifico = (getDate('')+getHora(''))
                    where id = $1 returning id;
            `, [id, url, genero]);

        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}


const crear = async(data = { coSucursal, nombreMensualidad, nota, monto, genero }) => {
    console.log("@create");
    try {

        const dataSeg = { coSucursal, nombreMensualidad, nota, monto, genero } = data;

        const result = await genericDao.execute(`
                    insert into co_facturacion_sucursal(co_sucursal,nombre_mensualidad,nota,monto,genero) 
                    values($1,$2,$3,$4,$5) returning id;
            `, [coSucursal, nombreMensualidad, nota, monto, genero]);

        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}


const queryBase = () => `
    select f.id,f.fecha_mensualidad,f.nombre_mensualidad,f.nota,f.comprobante_pago_url,f.monto,f.pago_aceptado,f.fecha_pago_aceptado,
        s.nombre as sucursal,s.direccion,s.pago_pendiente,s.mensualidad,s.dia_pago	  
    from co_facturacion_sucursal f inner join co_sucursal s on s.id = f.co_sucursal
    where s.id = $1 and f.eliminado = false and s.eliminado = false
`;






module.exports = {
    getAll,
    rechazarPago,
    aceptarPago,
    crear,
    updateComprobante,
    getSucursalesAgregarRegistro,
    getSumaAdeudaSucursal
};