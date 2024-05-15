const genericDao = require('./genericDao');
const Tables = require('../utils/Tables');
const {MOVIMIENTO_ENTRADA,MOVIMIENTO_SALIDA,MOVIMIENTO_AJUSTE_LIBRE} = require('../utils/Movimientos');
const Dao = require('./Dao');
const movimientoDao = new Dao(Tables.VE_MOVIMIENTO); 
const tipoMovimientoDao = new Dao(Tables.CAT_TIPO_MOVIMIENTO); 
const catArticuloSucursalDao = new Dao(Tables.CAT_ARTICULO_SUCURSAL); 
const VeMovimiento = require('../models/VeMovimiento');


const createMovimientoArticulo = async (catArticuloSucursal,cantidadAfectacion,data) => {
    console.log("@createMovimientoArticulo");

    try {
        //co_empresa,co_sucursal,cat_tipo_movimiento,cat_articulo_sucursal,cantidad,cantidad_anterior,cantidad_posterior
        const movimientoData = Object.assign(new VeMovimiento(),data);        

        //console.log("Movimiento data "+JSON.stringify(movimientoData));
        //console.log("catArticuloSucursal "+catArticuloSucursal);

        const articuloSucursal = await catArticuloSucursalDao.findById(catArticuloSucursal);
        
        //console.log("ArticuloSucursal data "+JSON.stringify(articuloSucursal));

        const tipoMovimiento = await tipoMovimientoDao.findById(movimientoData.cat_tipo_movimiento);                      

        console.log("Tipo de movimiento a actualizar "+tipoMovimiento.nombre);
      
        let cantidadActualizar = 0;
        
        if(tipoMovimiento.afectacion == MOVIMIENTO_ENTRADA){
            console.log("MOVIMIENTO_ENTRADA ");
            cantidadActualizar = (parseInt(articuloSucursal.cantidad_existencia) + parseInt(cantidadAfectacion));
        }
        
        if(tipoMovimiento.afectacion == MOVIMIENTO_SALIDA){
            console.log("MOVIMIENTO_SALIDA ");
            cantidadActualizar = (parseInt(articuloSucursal.cantidad_existencia) - parseInt(cantidadAfectacion));
        }

        if(tipoMovimiento.afectacion == MOVIMIENTO_AJUSTE_LIBRE){
            console.log("MOVIMIENTO_AJUSTE_LIBRE ");
            cantidadActualizar =  parseInt(cantidadAfectacion);
        }

        const cantidadAnteriorActualizar = articuloSucursal.cantidad_existencia;
        const cantidadPosteriorActualizar = cantidadActualizar;
         
        const { transaction } = data;
        
        let rowMovimiento;

        const movimientoInsert = movimientoData.setCantidad(cantidadAfectacion)
                                                .setCantidadAnterior(cantidadAnteriorActualizar)
                                                .setCantidadPosterior(cantidadPosteriorActualizar)
                                                .setFechaModifico(new Date())
                                                .setModifico(data.genero)                                                
                                                .build();

        if(transaction){            
          
            
            rowMovimiento  =  await transaction(Tables.VE_MOVIMIENTO).insert(movimientoInsert).returning("*");     
            
            await transaction(Tables.CAT_ARTICULO_SUCURSAL).update(                                            
                                            {
                                                cantidad_existencia:cantidadActualizar,                                                
                                                fecha_modifico:new Date(),
                                                modifico:data.genero
                                            }).where('id','=',catArticuloSucursal);

        }else{
            
            rowMovimiento = await movimientoDao.insert(movimientoInsert);

            await catArticuloSucursalDao.update(catArticuloSucursal,
                                    {
                                        cantidad_existencia:cantidadActualizar,                                                   
                                        fecha_modifico:new Date(),
                                        modifico:data.genero
                                    });
        }        
        
        return rowMovimiento;

    }catch(error){
        console.log(error);
        return false;
    }
}



module.exports = {
    createMovimientoArticulo
};