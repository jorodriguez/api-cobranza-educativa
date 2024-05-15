
const handle = require('../helpers/handlersErrors');
const articuloService = require('../services/articuloService');

const getArticuloCodigo = async (request, response) => {
    console.log("@getArticuloCodigo");
    try {
       
            const codigo = request.params.codigo;
            const coSucursal = parseInt(request.params.coSucursal);
            console.log("Consultando codigo " + codigo+" sucursal "+coSucursal);

            const results = await articuloService.getArticuloCodigo(coSucursal,codigo);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const getArticuloPorNombre = async (request, response) => {
    console.log("@getArticuloPorNombre");
    try {
       
            const nombre = request.params.nombre;
            const coSucursal = parseInt(request.params.coSucursal);
            console.log("Consultando nombre " + nombre);

            const results = await articuloService.getArticulosPorNombre(coSucursal,nombre);
                        
            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const getArticulosPorCategoria = async (request, response) => {
    console.log("@getArticulosPorCategoria");
    try {
       
            const catCategoria = parseInt(request.params.catCategoria);
            const coSucursal = parseInt(request.params.coSucursal);
            
            const results = await articuloService.getArticulosPorCategoria(coSucursal,catCategoria);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const getArticulosSucursal = async (request, response) => {
    console.log("@getArticulosSucursal");
    try {
                  
            const coSucursal = parseInt(request.params.coSucursal);
            
            const results = await articuloService.getArticulosSucursal(coSucursal);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const getCategoriaArticulos = async (request, response) => {
    console.log("@getCategoriaArticulos");
    try {
                  
            const coSucursal = parseInt(request.params.coSucursal);
            
            const results = await articuloService.getCategoriaArticulos(coSucursal);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const createArticulo = async (request, response) => {
    console.log("@createArticulo");
    try {
                  
            const data = request.body;

                        
            
            const results = await articuloService.createArticulo(data);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const updateArticulo = async (request, response) => {
    console.log("@updateArticulo");
    try {
                  
            const data = request.body;
            const id = request.params.id;

            if(!id){
                handle.callbackError('Error de validación falta el id del producto',response);
            }
           
            const results = await articuloService.updateArticulo(id,data);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const deleteArticulo = async (request, response) => {
    console.log("@deleteArticulo");
    try {
                  
            const data = request.body;

            const id = request.params.id;

            if(!id){
                handle.callbackError('Error de validación falta el id del producto',response);
            }
           
            const results = await articuloService.deleteArticulo(id,data);

            response.status(200).json(results);
            
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


module.exports = {
    createArticulo,
    updateArticulo,
    deleteArticulo,
    getArticuloCodigo,
    getArticuloPorNombre,
    getArticulosPorCategoria,
    getArticulosSucursal,
    getCategoriaArticulos
};