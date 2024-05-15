
const pagoService = require('../services/pagoService');
const alumnoService = require('../services/alumnoService');
const usuarioService = require('../services/usuarioService');
const handle = require('../helpers/handlersErrors');
//const notificacionService = require('../utils/NotificacionService');
const usuarioNotificacionService = require('../services/usuarioNotificacionService');
const correoService = require('../utils/CorreoService');
const { TEMA_NOTIFICACION } = require('../utils/Constantes');

const registrarPago = async (request, response) => {
    console.log("@registrarPago");
    try {
        //const pagoData = { id_alumno, pago, nota, ids_cargos, cargos_desglosados, cat_forma_pago, identificador_factura, genero } = request.body;
        //const pagoData = { id_alumno, pago, nota, ids_cargos, cargos_desglosados, cat_forma_pago, identificador_factura, genero } = request.body;
        const pagoData =
            {
                uid_alumno,
                pago,
                nota,
                ids_cargos,
                cargos_desglosados,
                ids_cargos_descuento,
                id_descuentos_desglose,
                cat_forma_pago,
                identificador_factura,
                identificador_pago,
                id_sucursal,
                genero
            } = request.body;

                    
        const alumno = await alumnoService.getAlumnoPorUId(uid_alumno);

        console.log("v "+JSON.stringify(pagoData));

        const result = await pagoService.registrarPago({id_alumno:alumno.id,...pagoData});

        //enviar el correo con el comprobante         

        const { agregar_pago_alumno } = result;       
          
        await enviarComprobantePago({id_pago:agregar_pago_alumno});
        
        response.status(200).json(result);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const enviarComprobantePago = async (data = {id_pago}) => {
    try{
        const {id_pago } = data;

        //const usuario = await usuarioService.buscarPorId(id_usuario);

        const pagoInfo = await pagoService.getInfoPagoId(id_pago);

        const html = await pagoService.obtenerPreviewComprobantePago(id_pago,pagoInfo.id_genero,true);       
    
        const asunto = `Comprobante de pago ${pagoInfo.folio} - ${pagoInfo.nombre_sucursal}.`;    

        let para = (pagoInfo.correo_alumno || "");
        let cc = (pagoInfo.correo_copia_usuario || "");
        
        console.log("obtneer correos del tema");
        console.log("Suc "+pagoInfo.id_sucursal+" TEMA_NOTIFICACION.ID_TEMA_NOTIFICACION_PAGOS "+TEMA_NOTIFICACION.ID_TEMA_NOTIFICACION_PAGOS);
        
        //falta ver a quien copiar
        const correosTema = await usuarioNotificacionService.obtenerCorreosPorTemaSucursal({coSucursal:pagoInfo.id_sucursal,coTemaNotificacion:TEMA_NOTIFICACION.ID_TEMA_NOTIFICACION_PAGOS});

        console.log(" correos del tema "+JSON.stringify(correosTema));

        if(correosTema.correos_usuarios.length > 0){            
            //para = para ? para.concat(",").concat(correosTema.correos_usuarios.toString()) : correosTema.correos_usuarios.toString();
            //Se envia en copias el comprobante de pago
            cc = cc ? cc.concat(",").concat(correosTema.correos_usuarios.toString()) : correosTema.correos_usuarios.toString();
            console.log("%% correosTema.tostr "+correosTema.correos_usuarios.toString());
            console.log("%% PARA "+para);
        }
        
        if(correosTema.correos_copia.length > 0){
            cc = cc ? cc.concat(',').concat(correosTema.correos_copia.toString()) : correosTema.correos_copia.toString();
            console.log("%% correosTema.tostr "+correosTema.correos_copia.toString());
            console.log("%% CC "+cc);
        }        

        await correoService.enviarCorreoAsync({para, cc, asunto, html,idEmpresa:pagoInfo.co_empresa});

    }catch(error){
        console.log(`x x x x x x x x x x x x x x x x x x x `);
        console.log("Error al enviar el correo "+ JSON.stringify(error));
        console.log(`x x x x x x x x x x x x x x x x x x x `);
    }
}


const reenviarComprobantePago = async (request, response) => {
    console.log("@reenviar comprobante de Pago");
    try {

        const {
                id_pago                
            } = request.body;

            await enviarComprobantePago({id_pago});

            response.status(200).json({envio:true,error:false});

    } catch (e) {
        console.log("Error"+e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const getPagosByCargoId = (request, response) => {
    console.log("@getPagosByCargoId");
    try {

        const id_cargo_balance_alumno = request.params.id_cargo_balance_alumno;

        pagoService
            .getPagosByCargoId(id_cargo_balance_alumno)
            .then(results => {
                response.status(200).json(results);
            }).catch(error => {
                handle.callbackError(error, response);
            });
    } catch (e) {
        handle.callbackErrorNoControlado(e, response);
    }
};


const imprimirComprobantePago = async (request, response) => {
    console.log("@imprimirComprobantePago");
    try {
        
        const {id_pago,id_usuario } = request.params;

        const html = await pagoService.obtenerPreviewComprobantePago(id_pago,id_usuario);

        response.status(200).send(html);

    } catch (e) {
        handle.callbackErrorNoControlado(e, response);
    }
};

module.exports = {
    registrarPago,
    getPagosByCargoId,
    reenviarComprobantePago,
    imprimirComprobantePago
};