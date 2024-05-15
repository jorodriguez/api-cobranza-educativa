const ventaDao = require('../dao/ventaDao');
const detalleVentaDao = require('../dao/detalleVentaDao');
const templateService = require('./templateService');
const movimientoInventarioService = require('./movimientoInventarioService');
const {TIPO_TEMPLATE} = require('../utils/Constantes');
const {ID_TIPO_CANCELACION_VENTA,ID_TIPO_DEVOLUCION_VENTA} = require('../utils/TipoMovimientoArticulo');
const {SI_ESTATUS} = require('../utils/Constantes');

const getTicketData = async(idVenta)=>{
    
    const ventaRow = await ventaDao.getVentaById(idVenta);
    
    if(!ventaRow){
            console.log("No existe la venta");
            return null;
    }

    const detalleVenta = await detalleVentaDao.getListaDetalleVenta(idVenta);
    
   return {venta:ventaRow,detalle:detalleVenta};

}

const getHtmlTicket = async (idVenta)=>{
    console.log("@getHtmlTicket");
    
    const ticketData = await getTicketData(idVenta);

    const {venta,detalle} = ticketData;

    console.log("--"+JSON.stringify(ticketData));

    const params = {
        ...venta,
        detalle:detalle,
        nombre_sucursal:venta.nombre_sucursal,
        direccion_sucursal:venta.direccion_sucursal,
        telefono_sucursal:venta.telefono_sucursal
   };

   const html = await  templateService
   .loadTemplateEmpresa({
           params,
           idEmpresa: venta.co_empresa,
           idUsuario:venta.genero,
           tipoTemplate:TIPO_TEMPLATE.TICKET_VENTA
    });

    console.log(`html Corte ${html}`);
      
    return html;
};


const cancelarVenta = async (data = {id_venta,id_estatus,motivo,genero})=>{
      console.log("@cancelarVenta");

      const {id_venta,id_estatus,motivo,genero} = data;

      const ventaEncontrada = await ventaDao.findById(id_venta);

      const detalle = await detalleVentaDao.getListaDetalleVenta(id_venta);    

      /*let catTipoMovimiento = "";

      console.log("=== "+id_estatus);

      if(id_estatus ==  SI_ESTATUS.VENTA_CANCELADA){          
          catTipoMovimiento = ID_TIPO_CANCELACION_VENTA;
      }

      if(id_estatus ==  SI_ESTATUS.VENTA_ELIMINADA){
        catTipoMovimiento = ID_TIPO_DEVOLUCION_VENTA;
       }*/

       console.log("Inicianco devolucion de productos")

      for(let i = 0; i < detalle.length; i++){
        
            //data = {id_articulo_sucursal,cat_tipo_movimiento,existencia_nueva,precio_nuevo,co_empresa,co_sucursal,nota,genero}          
            

            const item = detalle[i];

            console.log("---- devolviendo producto "+item.articulo+" cantidad "+item.cantidad);

            await movimientoInventarioService.guardarMovimientoInventario({
                    id_articulo_sucursal:item.cat_articulo_sucursal,
                    cat_tipo_movimiento:ID_TIPO_CANCELACION_VENTA,
                    existencia_nueva:item.cantidad,
                    precio_nuevo:item.precio,
                    co_empresa:ventaEncontrada.co_empresa,
                    co_sucursal:ventaEncontrada.co_sucursal,
                    nota:motivo,
                    genero:genero
            });

      }           

    const result =  await ventaDao.cancelarVenta(data);      

      //enviar correo de cancelacion de venta


    return result;
};





module.exports = { 
                    getHtmlTicket,
                    createVenta:ventaDao.createVenta,
                    //cancelarVenta:ventaDao.cancelarVenta,
                    cancelarVenta,
                    getVentasSucursal: ventaDao.getVentasSucursal
                 };
