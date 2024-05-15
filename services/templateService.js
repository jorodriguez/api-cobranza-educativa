const mustache = require('mustache');
const templateCorreoDao = require("../dao/templateCorreoDao");
const usuarioDao = require("../dao/usuarioDao");
const { TIPO_TEMPLATE, TEMPLATES } = require("../utils/Constantes");
var fs = require('fs').promises;
var path = require('path');

const loadTemplateEmpresa = async(templateData = { params, idEmpresa, idUsuario, tipoTemplate }) => {
    let html = '';
    try {

        const { params, idEmpresa, idUsuario, tipoTemplate } = templateData;
        let paramsSend = {...params };

        const template = await templateCorreoDao.getTemplateEmpresa(idEmpresa);

        if (template) {
            console.log("template encontrado " + template.nombre_empresa);

            const usuarioImprime = await usuarioDao.findById(idUsuario);

            paramsSend.nombre_empresa = template.nombre_empresa;
            paramsSend.usuario_imprime = usuarioImprime.nombre;
            paramsSend.fecha_impresion = template.fecha_impresion;
            paramsSend.direccion_empresa = template.direccion_empresa;
            paramsSend.rfc = template.rfc;
            paramsSend.logotipo = template.logotipo;

            console.log("TIPO_TEMPLATE - " + tipoTemplate);

            switch (tipoTemplate) {
                case TIPO_TEMPLATE.RECIBO_PAGO:
                    paramsSend.estilo_ticket = true;
                    html = mustache.to_html(template.template_recibo_pago, paramsSend);
                    break;
                case TIPO_TEMPLATE.RECIBO_PAGO_CORREO:
                    paramsSend.estilo_ticket = false;
                    html = mustache.to_html(template.template_recibo_pago, paramsSend);
                    break;
                case TIPO_TEMPLATE.CORTE_DIARIO:
                    html = mustache.to_html(template.template_corte_dia, paramsSend);
                    break;
                case TIPO_TEMPLATE.CORTE_DIARIO_ENVIO_CORREO:
                    // es un template local                        
                    const htmlLocalDataTemplateFile =
                        await fs.readFile(path.resolve(__dirname, `../templates/${TEMPLATES.TEMPLATE_CORTE_DIARIO}`), 'utf8');
                    if (htmlLocalDataTemplateFile) {
                        console.log("TEMPLATE ENCONTRADO ");
                        html = mustache.to_html(htmlLocalDataTemplateFile, paramsSend);
                        console.log("html mustache" + html);
                    } else console.log("TEMPLATE NO ENCONTRADO ");
                    break;
                case TIPO_TEMPLATE.TICKET_VENTA:
                    html = mustache.to_html(template.template_ticket_venta || '', paramsSend);
                    break;
                case TIPO_TEMPLATE.BIENVENIDA_ALUMNO:
                    html = mustache.to_html((template.encabezado || '') + (template.template_correo_bienvenida || '') + (template.pie || ''), paramsSend);
                    break;
                case TIPO_TEMPLATE.REGISTRO_EMPLEADO:
                    html = mustache.to_html((template.encabezado || '') + (template.template_correo_registro_usuario || '') + (template.pie || ''), paramsSend);
                    break;
                case TIPO_TEMPLATE.LISTA_ALUMNOS:
                    html = mustache.to_html((template.template_lista_alumnos || ''), paramsSend);
                    break;
                case TIPO_TEMPLATE.ESTADO_CUENTA_DETALLADO:
                    html = mustache.to_html((template.template_estado_cuenta_detallado || ''), paramsSend);
                    break;
                case TIPO_TEMPLATE.NOTIFICACION_GASTO:
                    html = mustache.to_html((template.template_gasto || ''), paramsSend);
                    break;
                case TIPO_TEMPLATE.FORMATO_CREDENCIAL:
                    html = mustache.to_html((template.template_credencial || ''), paramsSend);
                    break;
                default:
                    console.log("====================");
                    console.log("NINGUN TEMPLATE ENCONTRADO");
                    console.log("====================");

            }

        }
        return html;
    } catch (e) {
        console.log("Error al obtener el template de la BD ERROR:" + e);
        throw "error al obtener el template ";
    }
};


const loadAndMergeHtmlTemplateEmpresa = async(dataMail) => {

    const { html, params, idEmpresa } = dataMail;

    console.log("LOAD TEMPLATE EMPRESA loadAndMergeHtmlTemplateEmpresa = " + idEmpresa);

    let htmlMerge = '';
    let paramsSend = {...params };
    try {
        const template = await templateCorreoDao.getTemplateCorreoEmpresa(idEmpresa);
        if (template) {
            console.log("template encontrado " + template.nombre_empresa);
            let htmlTemp = '';
            htmlTemp = htmlTemp.concat(template.encabezado_template, html, template.pie_template);

            paramsSend.nombre_empresa = template.nombre_empresa;
            //paramsSend.usuario_imprime = usuarioImprime.nombre;
            paramsSend.fecha_impresion = template.fecha_impresion;
            paramsSend.direccion_empresa = template.direccion_empresa;
            paramsSend.rfc = template.rfc;
            paramsSend.logotipo = template.logotipo;

            htmlMerge = mustache.to_html(htmlTemp, paramsSend);
        }
        return htmlMerge;
    } catch (e) {
        console.log("Error al obtener el template de la BD " + e);
        throw "error al obtener el template ";
    }

};


module.exports = {
    loadTemplateEmpresa,
    loadAndMergeHtmlTemplateEmpresa
};