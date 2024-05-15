const correoService = require('./CorreoService');
const templateService = require('../services/templateService');
const temaNotificacionService = require('../services/temaNotificacionService');
const {TIPO_TEMPLATE,TEMA_NOTIFICACION} = require('../utils/Constantes');
const gastoDao = require('../dao/gastoDao');
const usuarioDao = require('../dao/usuarioDao');
const { formatCurrency } = require('./format');


const enviarNotificacionGasto = async (id_gasto,movimiento) => {    
    console.log("@enviarNotificacionGasto");
try{
   
   const registroGasto = await gastoDao.findById(id_gasto);
   const gastoMensual = await gastoDao.getSumaGastoMesActual(registroGasto.co_sucursal);
         
   const params = {
        movimiento: movimiento || '',
        forma_pago: registroGasto.nombre_tipo_pago,
        fecha: registroGasto.fecha_hora_text,
        monto:  formatCurrency(registroGasto.gasto),
        tipo: registroGasto.nombre_tipo_gasto,
        observaciones : registroGasto.observaciones,
        gasto_mensual: formatCurrency(gastoMensual.suma_mensual_sucursal)
       
   };

   const templateHtml = await templateService.loadTemplateEmpresa({params,
                                        idEmpresa: registroGasto.co_empresa,
                                        idUsuario: registroGasto.genero,
                                        tipoTemplate:TIPO_TEMPLATE.NOTIFICACION_GASTO});
    
    const asunto = `${movimiento} de gasto - ${registroGasto.nombre_tipo_gasto} `;
    
    //const para =  []; //(inscripcion.correo || '' )+(usuarioGenero.correo_copia || '');   

  /*  if(usuarioGenero.correo_copia != null){
        para.push(usuarioGenero.correo_copia);
    }
*/
    const usuariosTema = await temaNotificacionService.getCorreosPorTemaSucursal(
                                {
                                    coSucursal: registroGasto.co_sucursal,
                                    coTemaNotificacion:TEMA_NOTIFICACION.ID_TEMA_CORTE_DIARIO
                                }
                       );
    
    const para = [].concat(usuariosTema.correos_usuarios || []).concat(usuariosTema.correos_copia || []);


    console.log("correo para "+para);
   
    console.log("=== "+templateHtml);
    //const cc = copia;

    await correoService.enviarCorreoAsync({para, cc:"", asunto:asunto, html:templateHtml,idEmpresa: registroGasto.co_empresa});
    }catch(e){
        
        console.log("Error al enviar el correo de gasto "+e);

    }

};

module.exports = {
    enviarNotificacionGasto
};