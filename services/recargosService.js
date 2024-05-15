const recargoDao = require('../dao/recargosDao');
const { CRITERIO } = require('../dao/recargosDao');
const cargoService = require('./cargoService');
const CONSTANTES = require('../utils/Constantes');
const { existeValorArray, isEmptyOrNull } = require('../utils/Utils');
const notificacionRecargosService = require('../utils/NotificacionRecargosService');
const notificacionService = require('../utils/NotificacionService');


//enviar notificacion a mises por sucursar de los recargos que se van a realizar mañana
//enviar la lista completa a los dueños
//Enviarlo a las 10:00am que vence mañana 
function enviarRecordatorioPagoPadresAlumno() {
    recargoDao.getMensualidadesParaRecargoTodasSucursales(CRITERIO.VENCEN_MANANA)
        .then(results => {
            if (existeValorArray(results)) {
                let listaSucursales = results;
                for (let index in listaSucursales) {

                    let sucursal = listaSucursales[index];

                    if (!isEmptyOrNull(sucursal)) {
                        console.log("Enviar recordatorio para la sucursal " + sucursal.nombre_sucursal + " VENCIDAS " + sucursal.mensualidades_vencidas);

                        let listaMensualidades = sucursal.mensualidades_vencidas;

                        if (sucursal.existen_mensualidades_vencidas) {
                            for (let ind in listaMensualidades) {
                                let cargoMes = listaMensualidades[ind];
                                if (!isEmptyOrNull(cargoMes)) {
                                    notificacionRecargosService
                                        .enviarRecordatorioPagoMesualidad(
                                            cargoMes.id_alumno,
                                            [cargoMes],
                                            cargoMes.fecha_limite_pago_mensualidad_formateada
                                        );
                                }
                            }
                            //Enviar el correo para las maestras de cada suc
                            notificacionRecargosService.enviarReporteProxRecargos(sucursal, listaMensualidades);
                        }
                    }
                }
            }
        }).catch(error => {
            console.error("[recargosService] Error al ejecutar el proceso de envio de recargos para mañana " + JSON.stringify(error));
        });
}




function obtenerPagosVencenSemanaActual(idSucursal) {
    console.log("@obtenerPagosVencenSemanaActual sucursal "+idSucursal);
    try {
        return recargoDao.getMensualidadesParaRecargoPorSucursal(CRITERIO.VENCIDOS,idSucursal);
      //return recargoDao.getMensualidadesParaRecargoPorSucursal(CRITERIO.VENCEN_SEMANA_ACTUAL,idSucursal);

    } catch (e) {
        console.log( e);
    }

}

const obtegerMensualidadesRecargo = async ()=>{
    console.log("@obtegerMensualidadesRecargo");
    return await recargoDao.getMensualidadesParaRecargoTodasSucursales(CRITERIO.AGREGAR_RECARGO);
};


module.exports = {  enviarRecordatorioPagoPadresAlumno ,obtenerPagosVencenSemanaActual,obtegerMensualidadesRecargo};