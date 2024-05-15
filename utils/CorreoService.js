
const nodemailer = require('nodemailer');
const mustache = require('mustache');
var fs = require('fs').promises;
var path = require('path');
//const configEnv = require('../config/configEnv');
//const { QUERY, getQueryInstance } = require('../services/sqlHelper');
const { TEMPLATES } = require('./Constantes');
const correoTemaService = require('../services/temaNotificacionService');
const sucursalService = require('../services/sucursalService');
const templateCorreoService = require('../services/templateCorreoService');
const configuracionService = require('../services/configuracionService');

const { existeValorArray } = require('./Utils');



function enviarCorreoFamiliaresAlumno(asunto, para, cc, params,idEmpresa, template) {

    enviarCorreoTemplate(para, cc, asunto, params,idEmpresa, template);

}


const enviarCorreoConCopiaTemaNotificacion = async (asunto, para, idSucursalTemaCopia, idTemaNotificacion, params, template) => {
    console.log("@enviarCorreoPorTemaNotificacion copia a la suc " + idSucursalTemaCopia + " tema " + idTemaNotificacion);
    try {
        const sucursal = await sucursalService.getSucursalPorId(idSucursalTemaCopia);
        console.log(JSON.stringify(sucursal));
        let renderHtml = await loadTemplate(template, params,sucursal.co_empresa);        
        let cc = await obtenerCorreosCopiaPorTema(idSucursalTemaCopia, idTemaNotificacion);
        enviarCorreo(para, cc, asunto, renderHtml,sucursal.co_empresa);        
    } catch (error) {
        console.log("Excepción en el envio de correo : " + error);
    }
};


const enviarCorreoParaTemaNotificacion = async (asunto, idSucursalTemaCopia, idTemaNotificacion, params, template)=> {
    console.log("@enviarCorreoParaTemaNotificacion");
    try{
        const sucursal = await sucursalService.getSucursalPorId(idSucursalTemaCopia);
        let renderHtml = await loadTemplate(template, params,sucursal.co_empresa);  
        let para = await obtenerCorreosCopiaPorTema(idSucursalTemaCopia, idTemaNotificacion);
        if (existeValorArray(para)) {
            enviarCorreo(para, "", asunto, renderHtml,sucursal.co_empresa);
            //await enviarCorreoTemplateAsync(para,"",asunto,)
        }else{
            console.log("   X X X X Xno se envio el correo no hay para X X X X ");
        }
    } catch (error) {
        console.log("Excepción en el envio de correo : " + error);
    }
   /* loadTemplate(template, params)
        .then((renderHtml) => {
            obtenerCorreosCopiaPorTema(idSucursalTemaCopia, idTemaNotificacion)
                .then(correosCopia => {
                    let para = correosCopia;
                    if (existeValorArray(para)) {
                        enviarCorreo(para, "", asunto, renderHtml);
                    } else {
                        console.log("No existen correo para enviar el mail ");
                    }

                });

        }).catch(e => {
            console.log("Excepción en el envio de correo : " + e);
        });*/
};


function enviarCorreoTemplate(para, cc, asunto, params, idEmpresa,template,handler) {
    console.log("@enviarCorreoTemplate");

    loadTemplate(template, params,idEmpresa)
        .then((renderHtml) => {

            enviarCorreo(para, cc, asunto, renderHtml,idEmpresa,handler);

        }).catch(e => {
            console.log("Excepción en el envio de correo : " + e);
        });
}

const enviarCorreoTemplateAsync = async (para, cc, asunto, params,idEmpresa, template) => {
    console.log("@enviarCorreoTemplateAsync");

   const renderHtml = await loadTemplate(template,params,idEmpresa);

   return enviarCorreoAsync({para, cc, asunto, params,idEmpresa,html:renderHtml})

   /*return new Promise((resolve,reject)=>{
      enviarCorreo(para, cc, asunto, renderHtml,idEmpresa,(error,info)=>{
            if(error){
                    reject({enviado:false,mensaje:error});
            }else{
                    resolve({enviado:true,mensaje:info});
            }
      });    
    });*/
};

//FIXME:hacer un solo metodo que reciba un data
const enviarCorreoAsync = async (dataMail) => {
    
    const {para, cc, asunto, html,idEmpresa}=dataMail;

    console.log("@enviarCorreoAsync");
   return new Promise((resolve,reject)=>{
      enviarCorreo(para, cc, asunto, html, idEmpresa,(error,info)=>{
            if(error){
                    reject({enviado:false,mensaje:error});
            }else{
                    resolve({enviado:true,mensaje:info});
            }
      });    
    });
};






const getHtmlPreviewTemplate = async (templateName, params,idEmpresa) => {
    return await loadTemplate(templateName, params,idEmpresa);
};

const loadTemplate = async(templateName, params,idEmpresaParam) => {
    console.log("LOAD TEMPLATE EMPRESA = "+idEmpresaParam);
    let html = '';
    try {                  
        const template = await templateCorreoService.getTemplateCorreoEmpresa(idEmpresaParam);
        const htmlDataTemplateFile = await fs.readFile(path.resolve(__dirname, "../templates/" + templateName), 'utf8');                                        
        if(template && htmlDataTemplateFile){
                console.log("template encontrado "+template.nombre_empresa);
                let htmlTemp = '';
                htmlTemp = htmlTemp.concat(template.encabezado_template, (htmlDataTemplateFile || ''), template.pie_template);                            
                params.nombre_empresa = template.nombre_empresa;
                params.anexo_pie_correo = template.anexo_pie_correo;
                params.logotipo = template.logotipo;
                params.anexo_recibo_pago = (templateName == TEMPLATES.TEMPLATE_RECIBO_PAGO) ? (template.anexo_recibo_pago || '') : '';
                html = mustache.to_html(htmlTemp, params);                        
        }
        return html;
    } catch (e) {
        console.log("Error al obtener el template de la BD "+e);
        throw "error al obtener el template ";
    }      
};

function obtenerCorreosCopiaPorTema(co_sucursal, id_tema) {
    return correoTemaService.obtenerCorreosPorTema(co_sucursal, id_tema);
}


const enviarCorreo = async (para, conCopia, asunto, renderHtml,idEmpresa,handler) =>{
    console.log("Para " + para);
    console.log("CC " + conCopia);
    console.log("EMPRESA " + idEmpresa);
    try {
        if (para == undefined || para == '' || para == null) {
            console.log("############ NO EXISTEN CORREOS EN NINGUN CONTENEDOR (para,cc)######");
            //return;
            para  = "";
        }
        if (conCopia == undefined || conCopia == '' || conCopia == null) {
            conCopia = "";
        }

        if (renderHtml != null) {

            const configuracionEmpresa = await configuracionService.getConfiguracionEmpresa(idEmpresa);
            console.log("== CONFIGURACION CORREO EMPRESA "+JSON.stringify(configuracionEmpresa));
            const configMail = JSON.parse(configuracionEmpresa.configuracion_correo);

            const mailData = {
                from: configuracionEmpresa.remitente_from,               
                to: para || [],
                cc: conCopia || [],
                bcc: configuracionEmpresa.copia_oculta || [],
                subject: asunto,
                html: renderHtml
            };

            console.log(`Sender FROM ${configuracionEmpresa.remitente_from}`);
            console.log(`Empresa ${configuracionEmpresa.nombre}`);
            console.log(" PARA " + para);
            console.log(" CC " + JSON.stringify(conCopia));
            console.log(" CCO " + configuracionEmpresa.copia_oculta);
            console.log("Asunto " + asunto);           
            console.log(`EMAIL_CONFIG ${JSON.stringify(configMail)}`);
            

            const transporter = nodemailer.createTransport(configMail);
           
            const handlerMail =  handler ? handler : (error, info) => {
                if (error) {
                    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");                    
                    console.log("Error al enviar correo : " + error);
                    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");                    
                } else {
                    console.log('CORREO ENVIADO ======>>>: ' + info.response);
                }
            };

            transporter.sendMail(mailData, handlerMail);
            
            transporter.close();
        } else {
            console.log("No se envio el correo, no existe HTML");
        }
    } catch (e) {
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
        console.log("ERROR AL ENVIAR EL CORREO " + e);
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    }
}


module.exports = {
    TEMPLATES,
    enviarCorreoConCopiaTemaNotificacion,
    enviarCorreoParaTemaNotificacion,
    enviarCorreo,
    enviarCorreoTemplate,
    enviarCorreoFamiliaresAlumno,
    getHtmlPreviewTemplate,
    enviarCorreoTemplateAsync,
    enviarCorreoAsync,
  
};