const genericDao = require('./genericDao');
const { TIPO_USUARIO,TEMA_NOTIFICACION } = require('../utils/Constantes');

const obtenerCorreosPorTema = async (data = {coEmpresa,coTemaNotificacion})=> {

    const {coEmpresa,coTemaNotificacion} = data;

    return await genericDao.findOne(`
    SELECT 
    (
        SELECT coalesce(array_to_json(array_agg(to_json(u.correo))),'[]'::json)
            FROM co_usuario_notificacion un inner join usuario u on u.id = un.usuario                        							 
                                        inner join co_sucursal suc on suc.id = un.co_sucursal
            WHERE suc.co_empresa = $1 and un.co_tema_notificacion = $2
            and un.eliminado = false and u.eliminado = false and suc.eliminado = false
    )    
    AS correos_usuarios,	
    (                
        SELECT coalesce(array_to_json(array_agg(to_json(cc.correo))),'[]'::json)
        FROM co_correo_copia_notificacion cc inner join co_sucursal suc on suc.id = cc.co_sucursal
        WHERE suc.co_empresa = $1 and cc.co_tema_notificacion = $2 and cc.eliminado = false and suc.eliminado = false                    
    )
    AS correos_copia      
`, [coEmpresa,coTemaNotificacion]);
}

const obtenerCorreosPorTemaSucursal = async (data = {coSucursal,coTemaNotificacion})=> {
    console.log("@obtenerCorreosPorTemaSucursal");
    const {coSucursal,coTemaNotificacion} = data;

    return await genericDao.findOne(`
    SELECT 
    (
        SELECT coalesce(array_to_json(array_agg(to_json(u.correo))),'[]'::json)
            FROM co_usuario_notificacion un inner join usuario u on u.id = un.usuario                        							 
                                        inner join co_sucursal suc on suc.id = un.co_sucursal
            WHERE suc.id = $1 and un.co_tema_notificacion = $2
            and un.eliminado = false and u.eliminado = false and suc.eliminado = false
    )    
    AS correos_usuarios,	
    (                
        SELECT coalesce(array_to_json(array_agg(to_json(cc.correo))),'[]'::json)
        FROM co_correo_copia_notificacion cc inner join co_sucursal suc on suc.id = cc.co_sucursal
        WHERE suc.id = $1 and cc.co_tema_notificacion = $2 and cc.eliminado = false and suc.eliminado = false                    
    )
    AS correos_copia      
`, [coSucursal,coTemaNotificacion]);
}


const getUsuariosEnvioCorte = async (idEmpresa)=>{
    
    return await genericDao.findAll(`
    with usuario_notificacion as (
		select  u.nombre,u.correo,suc.id
		from co_usuario_notificacion un inner join usuario u on u.id = un.usuario
							  inner join co_sucursal suc on suc.id = un.co_sucursal
		where un.co_tema_notificacion = ${TEMA_NOTIFICACION.ID_TEMA_CORTE_DIARIO}
			and suc.co_empresa = $1
			and un.eliminado = false
			and suc.eliminado = false
	), agrupado as( 
		select 
			un.nombre,
			un.correo,
			array_to_json(array_agg(to_json(un.id)))::text AS sucursales
	  from usuario_notificacion un
	  group by un.nombre,un.correo 
	 ) select array_to_json(array_agg(to_json(correo))) as correos,a.sucursales
	   from agrupado a
	   group by sucursales
`,[idEmpresa]);
}


module.exports = {
    obtenerCorreosPorTema,obtenerCorreosPorTemaSucursal,getUsuariosEnvioCorte
};

