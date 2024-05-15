const articuloDao = require('../dao/articuloDao');


module.exports = { 
                    getArticuloCodigo:articuloDao.getArticuloCodigo,
                    getArticulosPorNombre:articuloDao.getArticulosPorNombre,
                    getArticulosPorCategoria:articuloDao.getArticulosPorCategoria,
                    getCategoriaArticulos:articuloDao.getCategoriaArticulos,
                    getArticulosSucursal:articuloDao.getArticulosSucursal,                    
                    createArticulo:articuloDao.createArticulo,
                    updateArticulo:articuloDao.updateArticulo,
                    deleteArticulo:articuloDao.deleteArticulo,
                    updatePrecio:articuloDao.updatePrecio                                      
                 };
