const correoService = require('./CorreoService');
const templateService = require('../services/templateService');
const temaNotificacionService = require('../services/temaNotificacionService');
const {TIPO_TEMPLATE,TEMA_NOTIFICACION} = require('./Constantes');
const usuarioDao = require('../dao/usuarioDao');
const sucursalDao = require('../dao/sucursalDao');

const enviarCorreoRegistroUsuario = async (data = {id_usuario,clave,genero}) => {    
try{
   
    const {id_usuario,clave,genero} = data; 

   const usuario = await usuarioDao.findById(id_usuario);

   if(!usuario){
       console.log("No se encontro el usuario");
        return;
   }

    const sucursal = await sucursalDao.getSucursalPorId(usuario.co_sucursal);
     
    const params = {        
        nombre: usuario.nombre,        
        alias: usuario.alias,        
        nombre_sucursal: sucursal.nombre,
        correo: usuario.correo,                        
        hora_entrada: usuario.hora_entrada,
        hora_salida: usuario.hora_salida,
        clave: clave,
        ver_clave:true
    };

    const templateHtml = await templateService.loadTemplateEmpresa({
                                            params,
                                            idEmpresa:usuario.co_empresa,
                                            idUsuario:genero,
                                            tipoTemplate:TIPO_TEMPLATE.REGISTRO_EMPLEADO
                                        });
        
    const asunto = `Hola ${usuario.nombre},`;
    
    const para = [usuario.correo];

    const cc =  usuario.copia_correo;

    console.log("HETML ENCVIAR "+templateHtml);

    return await correoService.enviarCorreoAsync({para, cc:cc, asunto:asunto, html:templateHtml,idEmpresa:usuario.co_empresa});

    }catch(e){
        
        console.log("Error al enviar el correo de bienvenida del usuario "+e);

    }

};

module.exports = {
    enviarCorreoRegistroUsuario
};