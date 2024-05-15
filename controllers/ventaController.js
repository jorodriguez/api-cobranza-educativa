
const handle = require('../helpers/handlersErrors');
const ventaService = require('../services/ventaService');

const createVenta = async (request, response) => {
    console.log("@createVenta");
    try {
       
            //venta,detalleVenta,co_empresa,co_sucursal,genero

            const data =  {venta,detalleVenta,co_empresa,co_sucursal,genero} = request.body;            

            if(!venta || !detalleVenta || !co_empresa || !co_sucursal || !genero){
                console.log(`venta ${!venta} detalleVenta ${!detalleVenta} co_empresa ${!co_empresa} co_sucursal ${!co_sucursal} genero ${!genero}`);
                handle.callbackError("error de validación",response);
                return;
            }
                   
            const results = await ventaService.createVenta(data);

            console.log("Venta = "+JSON.stringify(results));

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const cancelarVenta = async (request, response) => {
    console.log("@cancelarVenta");
    try {
       
            //id_venta,id_estatus,motivo,genero
           
            const data =  {id_venta,id_estatus,motivo,genero} = request.body;            

            console.log("id_venta,id_estatus,motivo,genero" + id_venta +" "+ id_estatus +" "+ motivo +" "+ genero);

            if(!id_venta || !id_estatus || !motivo || !genero){                
                handle.callbackError("error de validación faltan datos",response);
                return;
            }
                   
            const results = await ventaService.cancelarVenta({id_venta,id_estatus,motivo,genero});
          

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

// getTicket
const getTicket = async (request, response) => {
    console.log("@getTicket");
    console.log("Consultando ticket para impresion");
    try {
       
            //venta,detalleVenta,co_empresa,co_sucursal,genero

            const {id} = request.params;            

            if(!id){
                console.log(`el id de la venta es requerido `);
                handle.callbackError("error de validación, el id de venta es requerido",response);
                return;
            }
                   
            const results = await ventaService.getHtmlTicket(id);

            response.status(200).send(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const getVentaById = async (request, response) => {
    console.log("@getVentaById");
    console.log("Consultando venta");
    try {
       
            const {id} = request.params;            

            if(!id){
                console.log(`el id de la venta es requerido `);
                handle.callbackError("error de validación, el id de venta es requerido",response);
                return;
            }
                   
            const results = await ventaService.getHtmlTicket(id);

            response.status(200).send(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};



// getVentasSucrusal
const getVentasSucursal = async (request, response) => {
    console.log("@getVentasSucursal");    
    try {
       
           const {id} = request.params;            
           const {fecha} = request.body;            

           console.log("suc "+id);
           console.log("fecha "+fecha);

            if(!id || !fecha){
                console.log(`el idSucursal es  requerido `);
                handle.callbackError("error de validación, la sucursal es requerida",response);
                return;
            }
                   
            const results = await ventaService.getVentasSucursal({idSucursal:id,fecha:fecha});

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};



module.exports = {
    createVenta,
    cancelarVenta,
    getVentasSucursal,
    getTicket
};