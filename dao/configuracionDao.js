const genericDao = require('./genericDao');

const getConfiguracionEmpresa = async (idEmpresa) => {
    console.log("@getConfiguracionEmpresa");
    return await genericDao.findOne(
    `
     select em.nombre,
            em.direccion,
            em.telefono,		
            em.co_template,
            conf.id as id_configuracion,
            conf.link_descarga_app_android,
            conf.co_empresa,
            em.pagina_oficial,
            em.logotipo,           
            conf.configuracion_correo,
            conf.remitente_from,
            em.copia_oculta
    from co_empresa em inner join configuracion conf on conf.id = em.configuracion
    where em.id = $1 and em.activa = true and em.eliminado = false`, [idEmpresa]);
};


module.exports = {
    getConfiguracionEmpresa
};