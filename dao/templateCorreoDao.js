const genericDao = require('./genericDao');

const getTemplateCorreoEmpresa = async(idEmpresa) => {
    console.log("@getTemplateCorreoEmpresa");
    return await genericDao.findOne(
        `select em.nombre as nombre_empresa,
            em.direccion as direccion_empresa,
            em.telefono as telefono_empresa,		
            tem.nombre as nombre_template,
            tem.encabezado as encabezado_template,            
            tem.pie as pie_template,
            tem.anexo_pie_correo,
            tem.anexo_recibo_pago,            
            tem.logo_correo as logotipo,
			em.pagina_oficial
    from co_empresa em inner join co_template tem on tem.id = em.co_template
        where em.id = $1
        and  em.activa = true 
        and em.eliminado = false
    `, [idEmpresa]);
};

const getTemplateEmpresa = async(idEmpresa) => {
    console.log("@getTemplateEmpresa");
    return await genericDao.findOne(
        `select em.nombre as nombre_empresa,
            em.direccion as direccion_empresa,
            em.telefono as telefono_empresa,		
            em.rfc as rfc,		
            tem.encabezado,
            tem.pie,
            tem.nombre as nombre_template,
            tem.template_recibo_pago,
            tem.template_corte_dia,
            tem.template_ticket_venta,
            tem.template_correo_bienvenida,
            tem.template_correo_registro_usuario,
            tem.template_lista_alumnos,
            tem.template_estado_cuenta_detallado,
            tem.logo_correo as logotipo,            
            tem.template_gasto,
            tem.template_credencial,
			em.pagina_oficial,            
            to_char(getDate('') + getHora(''),'dd-mm-yyyy HH24:mi') as fecha_impresion,
            to_char(getDate('') + getHora(''),'dd-mm-yyyy') as fecha_actual
    from co_empresa em inner join co_template tem on tem.id = em.co_template
        where em.id = $1
        and  em.activa = true 
        and em.eliminado = false
    `, [idEmpresa]);
};



module.exports = {
    getTemplateCorreoEmpresa,
    getTemplateEmpresa
};