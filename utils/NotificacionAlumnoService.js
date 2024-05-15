const correoService = require('./CorreoService');
const templateService = require('../services/templateService');
const temaNotificacionService = require('../services/temaNotificacionService');
const {TIPO_TEMPLATE,TEMA_NOTIFICACION} = require('../utils/Constantes');
const inscripcionDao = require('../dao/inscripcionDao');
const usuarioDao = require('../dao/usuarioDao');

const enviarCorreoBienvenida = async (data) => {    
try{
   const {id_inscripcion,co_empresa,co_sucursal,genero}=data; 

   const inscripcion = await inscripcionDao.findById(id_inscripcion);

   const usuarioGenero = await usuarioDao.findById(genero);
   
   const params = {
        matricula_alumno:inscripcion.matricula,
        nombre_alumno:inscripcion.alumno,
        apellidos_alumno:inscripcion.apellidos,
        direccion_alumno:inscripcion.direccion,
        correo_alumno:inscripcion.correo,
        telefono_alumno:inscripcion.telefono,
        fecha_nacimiento_alumno:inscripcion.fecha_nacimiento_format,
        logo_taller:inscripcion.logo_taller,
        nombre_taller:inscripcion.especialidad,
        horario_taller:inscripcion.horario,
        dia_taller:inscripcion.dias
   };

   const templateHtml = await templateService.loadTemplateEmpresa({params,
                                        idEmpresa:co_empresa,
                                        idUsuario:genero,
                                        tipoTemplate:TIPO_TEMPLATE.BIENVENIDA_ALUMNO});
    
    const asunto = `Bienvenido ${inscripcion.alumno}`;
    
    const para =  [inscripcion.correo]; //(inscripcion.correo || '' )+(usuarioGenero.correo_copia || '');   

    if(usuarioGenero.correo_copia != null){
        para.push(usuarioGenero.correo_copia);
    }

    const usuariosTema = await temaNotificacionService.getCorreosPorTemaSucursal(
                                {
                                    coSucursal:co_sucursal,
                                    coTemaNotificacion:TEMA_NOTIFICACION.ID_TEMA_ALTA_ALUMNO
                                }
                       );
    
    let copia = [].concat(usuariosTema.correos_usuarios || []).concat(usuariosTema.correos_copia || []);

    console.log("correo copia "+copia);
   
    const cc = copia;

    await correoService.enviarCorreoAsync({para, cc:cc, asunto:asunto, html:templateHtml,idEmpresa:co_empresa});
    }catch(e){
        
        console.log("Error al enviar el correo de bienvenida "+e);

    }

};

module.exports = {
    enviarCorreoBienvenida
};