const moment = require('moment');
moment().format('ll');
require('moment/locale/es'); // without this line it didn't work
moment.locale('es');
const gastoDao = require('../dao/gastoDao');
const cortesDao = require('../dao/cortesDao');
const ventaDao = require('../dao/ventaDao');
const inscripcionDao = require('../dao/inscripcionDao');
const utilDao = require('../dao/utilDao');
const sucursalDao = require('../dao/sucursalDao');
const templateService = require('./templateService');
const temaNotificacionService = require('./temaNotificacionService');
const correoService = require('../utils/CorreoService');
const { TEMPLATES, TEMA_NOTIFICACION, USUARIO_DEFAULT, TIPO_TEMPLATE } = require('../utils/Constantes');
const { formatCurrency } = require('../utils/format');

const getCorteDiaSucursal = async(corteData) => {
    console.log("@getCorteDiaSucursal");

    const { idSucursal, fechaInicio, fechaFin, idUsuario } = corteData;

    const sumaIngreso = await cortesDao.getSumaPagosPorRango({ idSucursal: parseInt(idSucursal), fechaInicio: fechaInicio, fechaFin: fechaFin });

    const resultsIngreso = await cortesDao.getDetallePagos({ idSucursal: parseInt(idSucursal), fechaInicio: fechaInicio, fechaFin: fechaFin });

    const sumaGastos = await gastoDao.getGastosSumaCortePorSucursal({ idSucursal: parseInt(idSucursal), fechaInicio: fechaInicio, fechaFin: fechaFin });

    const resultsGastos = await gastoDao.getGastosCortePorSucursal({ idSucursal: parseInt(idSucursal), fechaInicio: fechaInicio, fechaFin: fechaFin });

    const sumaIngresoVentas = await ventaDao.getSumaVentaSucursal({ idSucursal: parseInt(idSucursal), fechaInicio: fechaInicio, fechaFin: fechaFin });

    const sumaIngresoSucursal = (parseFloat(sumaIngreso.total) + parseFloat(sumaIngresoVentas.total));

    const totalCaja = (parseFloat(sumaIngresoSucursal) - parseFloat(sumaGastos.total));

    console.log("Fecha " + fechaInicio + "  fecha fin" + fechaFin);
    console.log("suc " + idSucursal);
    console.log("sumaIngreso " + formatCurrency(sumaIngreso.total));
    console.log("sumaVenta " + formatCurrency(sumaIngresoVentas.total));
    console.log("sumaGastos " + formatCurrency(sumaGastos.total));
    console.log("sumaIngresoSucursal " + formatCurrency(sumaIngresoSucursal));
    console.log("totalCaja " + formatCurrency(totalCaja));


    return {
        fecha: fechaInicio,
        fechaFin: fechaFin,
        totalIngreso: (sumaIngreso ? sumaIngreso.total : 0),
        detalleIngreso: resultsIngreso,
        totalGasto: (sumaGastos ? sumaGastos.total : 0),
        detalleGasto: resultsGastos,
        totalIngresoVenta: sumaIngresoVentas.total,
        totalIngresoSucursal: sumaIngresoSucursal,
        totalCaja: totalCaja
    };
};


const getHtmlCorteDiaSucursal = async(corteData) => {
    console.log("@getHtmlCorteDiaSucursal");

    const corte = await getCorteDiaSucursal(corteData);

    const { idSucursal } = corteData;
    const sucursal = await sucursalDao.getSucursalPorId(idSucursal);

    //leer el template
    const params = {
        dia_corte_inicio: corte.fecha,
        dia_corte_fin: corte.fechaFin,
        total_ingreso: formatCurrency(corte.totalIngreso),
        total_ingreso_venta: formatCurrency(corte.totalIngresoVenta),
        total_ingreso_sucursal: formatCurrency(corte.totalIngresoSucursal),
        total_gasto: formatCurrency(corte.totalGasto),
        total_caja: formatCurrency(corte.totalCaja),
        nombre_sucursal: sucursal.nombre,
        direccion_sucursal: sucursal.direccion,
        telefono_sucursal: sucursal.telefono
    };

    const html = await templateService
        .loadTemplateEmpresa({
            params: params,
            idEmpresa: sucursal.co_empresa,
            idUsuario: corteData.idUsuario,
            tipoTemplate: corteData.tipoTemplate //TIPO_TEMPLATE.CORTE_DIARIO
        });

    return html;
};
/*
const getHtmlCorteDiaSucursalEnvioCorreo = async (corteData)=>{
    console.log("@getHtmlCorteDiaSucursalEnvioCorreo");
    
    const corte = await getCorteDiaSucursal(corteData);

    const {idSucursal} = corteData;
    const sucursal =  await sucursalDao.getSucursalPorId(idSucursal);    

   //leer el template
   const params = {
        dia_corte:corte.fecha,
        total_ingreso:corte.totalIngreso ,
        total_gasto:corte.totalGasto ,
        total_caja: (corte.totalIngreso-corte.totalGasto),
        nombre_sucursal:sucursal.nombre,
        direccion_sucursal:sucursal.direccion,
        telefono_sucursal:sucursal.telefono
   };
   const html = await  templateService
   .loadTemplateEmpresa({
           params:params,
           idEmpresa:sucursal.co_empresa,
           idUsuario:corteData.idUsuario,
           tipoTemplate:TIPO_TEMPLATE.CORTE_DIARIO_ENVIO_CORREO
       });
      
    return html;
};*/




const enviarCorteEmpresaCorreo = async(corteData) => {

    console.log("@enviarCorteEmpresaCorreo");

    // enviar junto todos los cortes de las sucursales de la empresa por c
    const { coEmpresa } = corteData;

    const informacionFecha = await utilDao.getFechaHoy();

    console.log(`enviado corte de ${JSON.stringify(informacionFecha)}`)

    const fechaHoy = new Date(`${informacionFecha.fecha_actual_format} 00:00:00`);

    console.log("FECHA " + fechaHoy)

    //obtener las sucursales de la empresa
    const listaSucursales = await sucursalDao.getSucursalPorEmpresa(coEmpresa);

    if (listaSucursales == null && listaSucursales.length == 0) {
        console.log("CORREO NO ENVIADO -  NO HAY SUCURSALES DE LA EMPRESA " + coEmpresa);
        return;
    }


    let cortesSucursal = new Map();

    console.log("LLENAR EL MAP DE CORTES");

    for (let i = 0; i < listaSucursales.length; i++) {

        const sucursal = listaSucursales[i];

        let htmlCorteDiaSucursal = '';

        console.log(`===== SUCURSAL ${sucursal.nombre}===== `)

        const htmlCorteDiario = await getHtmlCorteDiaSucursal({
            idUsuario: USUARIO_DEFAULT,
            idSucursal: sucursal.id,
            fecha: fechaHoy,
            tipoTemplate: TIPO_TEMPLATE.CORTE_DIARIO_ENVIO_CORREO
        });

        htmlCorteDiaSucursal = htmlCorteDiaSucursal.concat(htmlCorteDiario);

        //corte semanal
        const htmlCorteSemanalSucursal = await getCorteSemanalSucursal(informacionFecha, sucursal);

        //Contador de inscripciones
        const htmlCorteInscripciones = await getCorteInscripcionesSucursal(informacionFecha.fecha_actual_format, sucursal);

        htmlCorteDiaSucursal = htmlCorteDiaSucursal.concat(htmlCorteSemanalSucursal).concat(htmlCorteInscripciones);

        cortesSucursal.set(sucursal.id, htmlCorteDiaSucursal);

    }

    let infoEnvio = { enviado: 'pendiente' };


    //obtener los usuarios con el rol de direccion
    //const usuariosEnviar = await temaNotificacionService.getCorreosTemaPorEmpresa({coEmpresa:coEmpresa,coTemaNotificacion:TEMA_NOTIFICACION.ID_TEMA_CORTE_DIARIO})
    const infoCorreosEnviarCorte = await temaNotificacionService.getUsuariosEnvioCorte(coEmpresa);

    if (!infoCorreosEnviarCorte) {
        console.log("XXXXX NO existen correos del tema para enviar el corte XXXXXX");
        return;
    }

    let asunto = `Corte del ${informacionFecha.fecha_actual_asunto}`;

    const body = `<p><strong>Corte correspondiente al día ${informacionFecha.fecha_actual_asunto}</strong></p> 
    <p><small>Enviado ${informacionFecha.fecha_actual_asunto} ${informacionFecha.hora_actual_format}</small></p>`;


    for (let i = 0; i < infoCorreosEnviarCorte.length; i++) {

        const infoCorreosEnviar = infoCorreosEnviarCorte[i];

        const sucursalesEnviar = JSON.parse(infoCorreosEnviar.sucursales || []);

        const para = infoCorreosEnviar.correos || [];

        console.log(` ENVIADO CORTE A LA SUCS ${sucursalesEnviar} correos ${para}`);

        let cc = ''; //usuariosEnviar.correos_copia || [];

        //obtener la informacion html ya creada en el mapa        

        let htmlSucursalesEnviar = body; //  Object.assign(htmlSucursalesEnviar,body);

        for (let s = 0; s < sucursalesEnviar.length; s++) {
            const idSucursal = sucursalesEnviar[s];
            const htmlCorte = cortesSucursal.get(idSucursal);
            if (s > 0) {
                htmlSucursalesEnviar = htmlSucursalesEnviar.concat("<br/>");
            }
            htmlSucursalesEnviar = htmlSucursalesEnviar.concat(htmlCorte || '');
        }

        const htmlMergeTemplateMain = await templateService.loadAndMergeHtmlTemplateEmpresa({
            params: {},
            html: htmlSucursalesEnviar,
            idEmpresa: coEmpresa
        });

        console.log("=========================");
        console.log(htmlMergeTemplateMain);
        console.log("=========================")

        infoEnvio = await correoService.enviarCorreoAsync({ para: para, cc: cc, asunto: asunto, html: htmlMergeTemplateMain, idEmpresa: coEmpresa });
        console.log("=== ENVIO DE CORTE ==" + JSON.stringify(infoEnvio))

        console.log("======= ENVIO DE CORREO =====");
    }

    return infoEnvio;

};


const enviarCorreoPrueba = async() => {

    const html = `<p>Calando emojis  😄 </p> <br/> <p style="color:red;">I am red</p> <p style="color:blue;">I am blue</p>
    <p style="font-size:50px;">I am big</p>`;

    const infoEnvio = await correoService.enviarCorreoAsync({ para: 'htienda@ihsa.mx,jorodriguez@ihsa.mx', cc: "sia@ihsa.mx", asunto: " PRUEBA FROM NODE", html: html, idEmpresa: 3 });
    console.log("=== ENVIO  ==" + JSON.stringify(infoEnvio))
}



const getCorteSemanalSucursal = async(informacionFecha, sucursalData) => {


        const fechasSemana = informacionFecha.fechas_semana_ocurriendo || [];

        let table = `<br/><table width="100%" border="0" cellspacing="0" cellpadding="0" style="vertical-align: middle;text-align: center;"> `;
        let tdDiasNombre = `<tr style="background-color:#DBDBDB;padding:0px 0px 0px 10px;" ><td></td>`;
        let tdDias = `<tr style="background-color:#DBDBDB;padding:0px 0px 0px 10px;" ><td></td>`;
        let tdValoresIngreso = `<tr><td style="vertical-align: middle;text-align: left;border-left: 1px solid #BBBBBB;border-right: 1px solid #BBBBBB;" ><span class="h2"> <strong> Ingreso</strong></span></td>`;
        let tdValoresVentas = `<tr><td style="vertical-align: middle;text-align: left;border-left: 1px solid #BBBBBB;border-right: 1px solid #BBBBBB;" ><span class="h2"> <strong> Ventas</strong></span></td>`;
        let tdValoresGasto = `<tr><td style="vertical-align: middle;text-align: left;border-left: 1px solid #BBBBBB;border-right: 1px solid #BBBBBB;"><span class="h2"><strong>Gasto</strong></span></td>`;
        let tdValoresCaja = `<tr><td class="borderbottomTotal borderbottom"  style="vertical-align: middle;text-align: left;border-left: 1px solid #BBBBBB;border-right: 1px solid #BBBBBB;"><span class="h2"><strong>Caja</strong></span></td>`;

        for (let f = 0; f < fechasSemana.length; f++) {

            const fecha = fechasSemana[f];

            const isFechaDespuesFechaCorte = moment(fecha).isAfter(informacionFecha.fecha_actual_format);
            const esHoy = (informacionFecha.fecha_actual_format == fecha);

            const _fechaFormatNombre = moment(new Date(`${fecha} 00:00:00`)).format('dddd');
            //const _fechaFormat = moment(new Date(`${fecha} 00:00:00`)).format('MMM dd YY');
            const _fechaFormat = moment(new Date(`${fecha} 00:00:00`)).format('D MMM');

            const estiloValores = `${esHoy ? 'font-size:13px;border-left: 2px solid #3CA473;border-right: 2px solid #3CA473;background-color:#BAE1CF':'font-size:13px;border-left: 1px solid #BBBBBB;border-right: 1px solid #BBBBBB;'}`;

            tdDiasNombre = tdDiasNombre.concat(`<td style="font-size:11px;${estiloValores}" >${_fechaFormatNombre}</td>`)
            tdDias = tdDias.concat(`<td style="font-size:12px;${estiloValores}">${_fechaFormat}</td>`);

            const corteDiaSemana = await getCorteDiaSucursal({
                idSucursal: sucursalData.id,
                fechaInicio: new Date(`${fecha} 00:00:00`),
                fechaFin: new Date(`${fecha} 00:00:00`),
                idUsuario: USUARIO_DEFAULT
            });
            //ingreso



            tdValoresIngreso = tdValoresIngreso.concat(`<td style="${estiloValores}">  ${isFechaDespuesFechaCorte ?  '': '$'+  formatCurrency(corteDiaSemana.totalIngreso)}</td>`);
            tdValoresVentas = tdValoresVentas.concat(`<td style="${estiloValores}">  ${isFechaDespuesFechaCorte ?  '': '$'+  formatCurrency(corteDiaSemana.totalIngresoVenta)}</td>`);
            tdValoresGasto = tdValoresGasto.concat(`<td style="${estiloValores}">${isFechaDespuesFechaCorte ?  '' : '$'+formatCurrency(corteDiaSemana.totalGasto)}</td>`);
            tdValoresCaja = tdValoresCaja.concat(`<td class="borderbottomTotal borderbottom" style="${estiloValores}" ><strong>${ isFechaDespuesFechaCorte ? '' : '$'+formatCurrency(corteDiaSemana.totalIngreso - corteDiaSemana.totalGasto)}</strong></td>`);

        }

        const corteSemana = await getCorteDiaSucursal({
            idSucursal: sucursalData.id,
            fechaInicio: new Date(`${informacionFecha.fecha_inicio_semana_format} 00:00:00`),
            fechaFin: new Date(`${informacionFecha.fecha_fin_semana_format} 00:00:00`),
            idUsuario: USUARIO_DEFAULT
        });


        tdDias = tdDias.concat("</tr>");
        tdValoresIngreso = tdValoresIngreso.concat("</tr>");
        tdValoresVentas = tdValoresVentas.concat("</tr>");
        tdValoresGasto = tdValoresGasto.concat("</tr>");
        tdValoresCaja = tdValoresCaja.concat("</tr>");

        //let totalSemana = `<h4>Ingreso Semana : $${corteSemana.totalIngreso}</h4>`;
        //totalSemana = totalSemana.concat(`<h4>Gasto Semana : $${corteSemana.totalGasto}</h4>`);
        //totalSemana = totalSemana.concat(`<h4>Caja Semana : $${corteSemana.totalIngreso - corteSemana.totalGasto}</h4>`);

        let totalSemana = `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="vertical-align: middle;text-align: left;"> 
                        <tr >
                            <td width="80%"><span > + Cobranza Semanal</span></td>
                            <td><span ><strong>$${formatCurrency(corteSemana.totalIngreso)}<strong></span></td>
                        </tr>
                        ${ corteSemana.totalIngresoVenta > 0 && `<tr >
                            <td width="80%"><span > + Ventas Semanal</span></td>
                            <td><span ><strong>$${formatCurrency(corteSemana.totalIngresoVenta)}<strong></span></td>
                        </tr>`}
                        <tr >
                            <td width="80%">
                                <span>- Gasto Semanal</span>
                            </td>
                            <td >
                                <span ><strong>$${formatCurrency(corteSemana.totalGasto)}</strong></span>
                            </td>
                        </tr>
                        <tr >
                            <td  class="borderbottomTotal" style="background-color:#BAE1CF" width="80%">
                                <span ><strong> En caja (Semanal en ${sucursalData.nombre ||''}) </strong></span>
                            </td>
                            <td class="borderbottomTotal borderbottom" style="background-color:#BAE1CF">
                                <span><strong>$${formatCurrency(corteSemana.totalCaja)}</strong></span>
                            </td>
                        </tr>
                       </table>

                       `;

    //formateo final
    //let htmlHistorialSemana =  `<br/><h5>Semana del ${moment(new Date(`${informacionFecha.fecha_inicio_semana_format} 00:00:00`)).format('D MMM')} al ${moment(new Date(`${informacionFecha.fecha_fin_semana_format} 00:00:00`)).format('D MMM')}</h5>`;            
    table = table.concat(`<tr><td colspan="8"> <span class="h2"> Semana del ${moment(new Date(`${informacionFecha.fecha_inicio_semana_format} 00:00:00`)).format('D MMMM')} al ${moment(new Date(`${informacionFecha.fecha_fin_semana_format} 00:00:00`)).format('D MMM')} </span></td></tr>`);
    table = table.concat(tdDiasNombre).concat(tdDias).concat(tdValoresIngreso).concat( corteSemana.totalIngresoVenta > 0 ? tdValoresVentas:'').concat(tdValoresGasto).concat(tdValoresCaja).concat("</table>");
    table = table.concat(`<br/>`).concat(totalSemana);

    return table;

}


const getCorteInscripcionesSucursal = async(fecha,sucursalData)=>{
                   
    //const fechasSemana = informacionFecha.fechas_semana_ocurriendo || [];        

    let html ="";

    const _fechaFormatNombre = moment(new Date(`${fecha} 00:00:00`)).format('dddd');      

    const inscripciones = await inscripcionDao.getInscripcionesCorteFecha(sucursalData.id,new Date(`${fecha} 00:00:00`));

    html = `<br/><table width="100%" border="0" cellspacing="0" cellpadding="0" style="vertical-align: middle;text-align: left;border:1px solid #C5C5C5"> `;
    
    if(inscripciones != null && inscripciones.length > 0){           
       
        html =html.concat(`<tr> <td colspan="4" style="vertical-align: middle;text-align: center;"><strong>(${inscripciones.length}) Inscripciones hoy ${_fechaFormatNombre} </strong></td></tr>`);
        
        let head =` <tr>                        
                        <td>Inscripción</td>
                        <td style="vertical-align: middle;text-align: center;">Cole.</td>
                        <td style="vertical-align: middle;text-align: center;">Inscr.</td>
                   </tr>`;
        
                   html = html.concat(head);

        let intercalar = false;
        for(let f =0; f < inscripciones.length;f++){   
            const inscripcion = inscripciones[f];
            let fila =`<tr style="background-color: ${intercalar ? '#A1CBE6':'#fff'} " >                       
                       <td width="50%">
                            <p style="margin:0px; padding: 0px;"><strong>${inscripcion.matricula}</strong></p>
                            <p style="margin:0px; padding: 0px;">${inscripcion.alumno} ${inscripcion.apellidos}</p>
                            <small>${inscripcion.especialidad} ${inscripcion.dias} horario ${inscripcion.horario}</small>
                            <small>Inicia ${inscripcion.fecha_inicio_previsto} <small>
                       </td>
                       <td style="vertical-align: middle;text-align: center;" width="20%">
                            $${inscripcion.costo_colegiatura}
                       </td>
                       <td style="vertical-align: middle;text-align: center;" width="20%">
                            $${inscripcion.costo_inscripcion}
                       </td>
                    </tr>
                    <tr style="background-color: ${intercalar ? '#A1CBE6':'#fff'} ">
                        <td colspan="3">
                            Nota: ${inscripcion.nota_inscripcion}
                        </td>
                    </tr>
             `;              
            html = html.concat(fila);
            intercalar = !intercalar;
        }            

    }else{
        html =html.concat(`<tr> <td>(0)Inscripciones hoy ${_fechaFormatNombre} </td></tr>`);
    }

    html = html.concat(`</table>`);

    return html;

}

/*
--envio completo por sucursal todas las sucursales activas
const enviarCorteEmpresaCorreo = async (corteData)=>{

    console.log("@enviarCorteEmpresaCorreo");
   
    // enviar junto todos los cortes de las sucursales de la empresa por c
    const {coEmpresa} = corteData;

    const informacionFecha = await utilDao.getFechaHoy();

    console.log(`enviado corte de ${JSON.stringify(informacionFecha)}`)

    const fechaHoy = new Date(`${informacionFecha.fecha_actual_format} 00:00:00`);
    
    console.log("FECHA "+fechaHoy)

    //obtener los usuarios de la empresa de usuario notificacion    
    const usuariosEnviar = await temaNotificacionService.getCorreosTemaPorEmpresa({coEmpresa:coEmpresa,coTemaNotificacion:TEMA_NOTIFICACION.ID_TEMA_CORTE_DIARIO})

    if(usuariosEnviar == null && usuariosEnviar.length == 0){
            console.log("CORREO NO ENVIADO -  NO HAY USUARIOS EN CO_CORREO_TEMA_NOTIFICACION");
            return ;
    }
    
    //obtener las sucursales de la empresa
    const listaSucursales = await sucursalDao.getSucursalPorEmpresa(coEmpresa);    
    
    if(listaSucursales == null && listaSucursales.length == 0){
        console.log("CORREO NO ENVIADO -  NO HAY SUCURSALES DE LA EMPRESA "+coEmpresa);
        return ;
    }
    
  //  let corteSucursales=[];
    let html = `<p><strong>Corte correspondiente al día ${informacionFecha.fecha_actual_asunto}</strong></p> 
                <p><small>Enviado ${informacionFecha.fecha_actual_asunto} ${informacionFecha.hora_actual_format}</small></p>` ;
    
    for(let i =0; i< listaSucursales.length;i++){

        const sucursal = listaSucursales[i];

        console.log(`===== SUCURSAL ${sucursal.nombre}===== `)
           
        const htmlGen = await getHtmlCorteDiaSucursal(
                    {   idUsuario:USUARIO_DEFAULT ,
                        idSucursal:sucursal.id,
                        fecha:fechaHoy,
                        tipoTemplate: TIPO_TEMPLATE.CORTE_DIARIO_ENVIO_CORREO
                    });            
        
        html = html.concat(htmlGen);               
        //historial semana
        
        let htmlHistorialSemana =  `<br/><h5>Semana de ${informacionFecha.fecha_inicio_semana_format} al ${informacionFecha.fecha_fin_semana_format}</h5>`;            
                
        const fechasSemana = informacionFecha.fechas_semana_ocurriendo || [];        

        let table = `<table width="100%" border="1" cellspacing="0" cellpadding="0" style="vertical-align: middle;text-align: left;"> `;
        let tdDiasNombre = `<tr tyle="background-color:#DBDBDB;padding:0px 0px 0px 10px ;color:#CC59C5" ><td></td>`;
        let tdDias = `<tr tyle="background-color:#DBDBDB;padding:0px 0px 0px 10px ;color:#CC59C5" ><td></td>`;
        let tdValoresIngreso = "<tr><td><strong>Ingreso</strong></td>";
        let tdValoresGasto = "<tr><td><strong>Gasto</strong></td>";
        let tdValoresCaja = "<tr><td><strong>Caja</strong></td>";

        for(let f =0; f < fechasSemana.length;f++){

            const fecha = fechasSemana[f];
            
            const _fechaFormatNombre = moment(new Date(`${fecha} 00:00:00`)).format('dddd');
            const _fechaFormat = moment(new Date(`${fecha} 00:00:00`)).format('MMM Do YY');

            tdDiasNombre = tdDiasNombre.concat(`<td><${_fechaFormatNombre}}</td>`)
            tdDias = tdDias.concat(`<td>${_fechaFormat}</td>`);
            
              const corteDiaSemana = await getCorteDiaSucursal({idSucursal:sucursal.id,
                                                            fechaInicio:new Date(`${fecha} 00:00:00`),
                                                            fechaFin:new Date(`${fecha} 00:00:00`),           
                                                            idUsuario:USUARIO_DEFAULT});
            //ingreso
            tdValoresIngreso = tdValoresIngreso.concat(`<td>$${corteDiaSemana.totalIngreso}</td>`);
            tdValoresGasto = tdValoresGasto.concat(`<td>$${corteDiaSemana.totalGasto}</td>`);            
            tdValoresCaja = tdValoresCaja.concat(`<td><strong>$${corteDiaSemana.totalIngreso - corteDiaSemana.totalGasto}</strong></td>`);            
                  
        }

        const corteSemana = await getCorteDiaSucursal({idSucursal:sucursal.id,
            fechaInicio:new Date(`${informacionFecha.fecha_inicio_semana_format} 00:00:00`),
            fechaFin:new Date(`${informacionFecha.fecha_fin_semana_format} 00:00:00`),
            idUsuario:USUARIO_DEFAULT});


        tdDias = tdDias.concat("</tr>");
        tdValoresIngreso = tdValoresIngreso.concat("</tr>");
        tdValoresGasto = tdValoresGasto.concat("</tr>");
        tdValoresCaja = tdValoresCaja.concat("</tr>");

        let totalSemana = `<h4>Ingreso Semana : $${corteSemana.totalIngreso}</h4>`;
        totalSemana = totalSemana.concat(`<h4>Gasto Semana : $${corteSemana.totalGasto}</h4>`);
        totalSemana = totalSemana.concat(`<h4>Caja Semana : $${corteSemana.totalIngreso - corteSemana.totalGasto}</h4>`);

        table = htmlHistorialSemana.concat(table).concat(tdDiasNombre).concat(tdDias).concat(tdValoresIngreso).concat(tdValoresGasto).concat(tdValoresCaja).concat("</table>");
        table = table.concat(`<br/>`).concat(totalSemana);

        html = html.concat(table);
                
    }   

    console.log("=================")
    console.log(`${html}`)
    console.log("=================")

    let infoEnvio = {enviado:'pendiente'};


    //enviar correo
    //if(html){
        let asunto = `Corte del ${informacionFecha.fecha_actual_asunto}`;
        let para = usuariosEnviar.correos_usuarios || [];        

        console.log(`usuariosEnviar ${JSON.stringify(usuariosEnviar)}`)

        let cc = usuariosEnviar.correos_copia || [];
        
        const htmlMergeTemplateMain = await templateService.loadAndMergeHtmlTemplateEmpresa({
                             params:{},
                             html:html,
                             idEmpresa:coEmpresa
            
         });        

        infoEnvio = await correoService.enviarCorreoAsync({para:para,cc:cc,asunto:asunto,html:htmlMergeTemplateMain,idEmpresa:coEmpresa});

        console.log("=== ENVIO DE CORTE =="+ JSON.stringify(infoEnvio))
        console.log("======= ENVIO DE CORREO =====");
    //}

    return infoEnvio;

};

*/


module.exports = {
    getCorteDiaSucursal,
    getHtmlCorteDiaSucursal,
    enviarCorteEmpresaCorreo,
    enviarCorreoPrueba
};