const genericDao = require('./genericDao');
//const Tables = require('../utils/Tables');
//const {ID_TIPO_MOVIMIENTO_VENTA} = require('../utils/TipoMovimientoArticulo');
//const Dao = require('./Dao');
//const ventaDao = new Dao(Tables.VE_VENTA); 

//const ventaDetalleDao = new Dao(Tables.VE_VENTA_DETALLE); 

//const VeVentaDetalle = require('../models/VeVentaDetalle');


//getDetalleTicket
const getListaDetalleVenta =async (idVenta)=>{
    return await genericDao.findAll(`
    select det.id,
    det.cantidad,
    det.precio,
    det.importe,
    art.nombre as articulo,
    art.codigo,
    det.cat_articulo_sucursal,
    det.ve_venta,    
    marca.nombre as marca,
    medida.nombre as unidad_medida
from ve_venta_detalle det inner join cat_articulo_sucursal ars on det.cat_articulo_sucursal = ars.id
                            inner join cat_articulo art on art.id = ars.cat_articulo
                            inner join cat_marca marca on marca.id = art.cat_marca
                            inner join cat_unidad_medida medida on medida.id = art.cat_unidad_medida
    where det.ve_venta = $1
    `,[idVenta]);
}



module.exports = {
    getListaDetalleVenta
};