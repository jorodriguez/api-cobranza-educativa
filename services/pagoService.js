

const pagoDao = require('../dao/pagoDao');
const templateService = require('./templateService');
const {TIPO_TEMPLATE} = require('../utils/Constantes');
const obtenerPreviewComprobantePago = async (idPago,idUsuario,isCorreo)=>{
    
    const params = await pagoDao.getInfoPagoId(idPago);  

    console.log(JSON.stringify(params));
    
    const template = isCorreo ? TIPO_TEMPLATE.RECIBO_PAGO_CORREO : TIPO_TEMPLATE.RECIBO_PAGO;

     const html = await  templateService
                            .loadTemplateEmpresa({
                                    params,
                                    idEmpresa:params.co_empresa,
                                    idUsuario,
                                     tipoTemplate: template
                                });
    
     return html;
};



module.exports = {
    obtenerPreviewComprobantePago,
    ...pagoDao
};

