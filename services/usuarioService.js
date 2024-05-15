const usuarioDao = require('../dao/usuarioDao');
const { TIPO_USUARIO } = require('../utils/Constantes');
const { MensajeRetorno } = require('../utils/MensajeRetorno');
const { enviarCorreoRegistroUsuario } = require('../utils/NotificacionUsuarioService');
const { generarRandomPassword } = require('../dao/utilDao');


function getUsuariosPorSucursal(idSucursal) {
    return usuarioDao.getUsuarioPorSucursal(idSucursal);
}

const crearUsuarioConCorreo = async (usuarioData) => {
    console.log("@crearUsuarioConCorreo");

    console.log("@@@@@ PARAMS "+JSON.stringify(usuarioData));
    const busquedaCorreo = await usuarioDao.validarCorreoUsuario(usuarioData.correo);
        
    if(busquedaCorreo.encontrado){

        return new MensajeRetorno(false, "El correo ya se encuentra registrado", null);

    }

    const passwordData = await generarRandomPassword();   

    usuarioData.password_encriptado = passwordData.encripted;

    usuarioData.acceso_sistema = true;
    
    const usuarioId = await insertarUsuario(usuarioData);

    console.log("@usuario insertado "+usuarioId);

    await enviarCorreoRegistroUsuario({ id_usuario: usuarioId,clave:passwordData.password, genero : usuarioData.genero });

    return new MensajeRetorno(true, "Se registró el usuario", null);
      
}

function insertarUsuario(usuarioData) {
    return usuarioDao.insertarUsuario(usuarioData);
}

function crearUsuario(usuarioData) {
    console.log("@crearUsuario");
    return new Promise((resolve, reject) => {
        insertarUsuario(usuarioData)
            .then(result => {
                resolve(
                    new MensajeRetorno(true, "Se registró el usuario", null)
                );
            }).catch(error => reject(new MensajeRetorno(false, "Error", error)));
    });
}

const reiniciarClave = async (usuarioId,idGenero) =>{

    const usuario = await usuarioDao.findById(usuarioId);

    if(!usuario){
        throw new Error("no existe el usuario");
    }

    const passwordData = await generarRandomPassword();   

    await usuarioDao.updateClave(usuario.id,{clave_encriptada:passwordData.encripted, genero:idGenero });

    return await enviarCorreoRegistroUsuario({id_usuario: usuarioId,clave:passwordData.password,genero:idGenero});
}


function editarUsuario(usuarioData) {
    console.log("USERDATA " + JSON.stringify(usuarioData));
    return usuarioDao.modificarUsuario(usuarioData);
}

function modificarUsuarioConCorreo(usuarioData) {
    return new Promise((resolve, reject) => {
        usuarioDao
            .buscarCorreo(usuarioData.correo)
            .then(results => {
                console.log("RESUL " + JSON.stringify(results));
                let cont = results.length;
                var proceder = false;

                if (cont == 0) {
                    console.log("proceder con modificacion no existe el correo");
                    proceder = true;
                } else {
                    if (cont == 1) {
                        console.log("el correo existe una vez, validar que sea del mismo usaurios");
                        //validar que sea el mismo usuario
                        let u = results[0];
                        proceder = (usuarioData.id == u.id);
                    }
                }

                if (proceder) {
                    console.log("USERDATA OOO " + JSON.stringify(usuarioData));
                    editarUsuario(usuarioData)
                        .then(result => {
                            resolve(
                                new MensajeRetorno(true, "Se modificó el usuario", null)
                            );
                        }).catch(error => reject(new MensajeRetorno(false, "Error", error)));

                } else {
                    console.log("El correo ya existe");
                    resolve(
                        new MensajeRetorno(false, "El correo ya se encuentra registrado", null)
                    );
                }
            });
    });
}

function modificarUsuario(usuarioData) {
    return new Promise((resolve, reject) => {
        editarUsuario(usuarioData)
            .then(result => {
                resolve(
                    new MensajeRetorno(true, "Se modificó el usuario", null)
                );
            }).catch(error => reject(new MensajeRetorno(false, "Error", error)));
    });

}


function modificarContrasena(idUsuario, usuarioData) {
    //enviar correo de confirmacion de contraseña
    return usuarioDao.modificarContrasena(idUsuario, usuarioData);
}

function desactivarUsuario(idUsuario, usuarioData) {
    //enviar correo de desactivacion de usuario a rol miss de al suc
    return new Promise((resolve, reject) => {
        usuarioDao.desactivarUsuario(idUsuario, usuarioData)
            .then(result => {
                if (result > 0) {
                    resolve(
                        new MensajeRetorno(true, "Se Eliminó el usuario", null)
                    );
                } else {
                    reject(new MensajeRetorno(false, "Error", null));
                }
            }).catch(error => reject(new MensajeRetorno(false, "Error", error)));
    });
    //return 
}



function buscarPorId(idUsuario) {
    return usuarioDao.buscarUsuarioId(idUsuario);
}

function getSucursalesUsuario(idUsuario){
    return usuarioDao.getSucursalesUsuario(idUsuario);
}

const desactivarUsuarioReporte  =(usuarioData) =>{
    return usuarioDao.desactivarUsuarioReporte(usuarioData);
};

const bloquearAccesoSistema  =(usuarioData) =>{
    return usuarioDao.modificarAccesoSistema(usuarioData);
};

module.exports = {
    getUsuariosPorSucursal,
    crearUsuarioConCorreo, crearUsuario, modificarContrasena,
    modificarUsuario,
    desactivarUsuario,
    buscarPorId,
    modificarUsuarioConCorreo,
    getSucursalesUsuario,
    desactivarUsuarioReporte,
    reiniciarClave,
    bloquearAccesoSistema,
    getUsuariosAsesoresPorSucursal: usuarioDao.getUsuariosAsesoresPorSucursal
};