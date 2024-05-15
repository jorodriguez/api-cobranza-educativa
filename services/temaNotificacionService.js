const usuarioDao = require('../dao/usuarioDao');
const usuarioNotificacionDao = require('../dao/usuarioNotificacionDao');
const { isEmptyOrNull } = require('../utils/Utils');

function obtenerCorreosPorTema(idSucursal, idTema) {

    return new Promise((resolve, reject) => {
        usuarioDao
            .obtenerCorreosPorTema(idSucursal, idTema)
            .then(results => {
                var correos = [];
                //console.log("======XXXX "+JSON.stringify(results));
                if (!isEmptyOrNull(results)) {
                    let row = results[0] || [];
                    if(row != []){                        
                        let correoUsuarios = row.correos_usuarios || [];
                        let correoCopia = row.correos_copia || [];
                        //correos = correoUsuarios.concat(correoCopia);
                        correos = correos.concat(correoUsuarios,correoCopia);
                        console.log("Correos "+JSON.stringify(correos));
                    }                    
                }
                console.log("Correos de copia "+correos);
                resolve(correos);
            }).catch(error => {
                console.error("Error al extraer los correos copia por tema " + error);
                reject(error);
            });
    });
}

const getCorreosTemaPorEmpresa = async(data)=>{
    return await usuarioNotificacionDao.obtenerCorreosPorTema(data);
}


module.exports = { obtenerCorreosPorTema,
                    getCorreosTemaPorEmpresa,
                    getCorreosPorTemaSucursal:usuarioNotificacionDao.obtenerCorreosPorTemaSucursal,
                    getUsuariosEnvioCorte: usuarioNotificacionDao.getUsuariosEnvioCorte
                    };