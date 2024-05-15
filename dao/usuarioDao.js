const genericDao = require('./genericDao');
const { TIPO_USUARIO } = require('../utils/Constantes');
//const { generarRandomPassword } = require('../dao/utilDao');
const { encriptar } = require('../utils/Utils');

function obtenerCorreosPorTema(co_sucursal, id_tema) {
    return genericDao.findAll(`
            SELECT 
                (
                    SELECT coalesce(array_to_json(array_agg(to_json(u.correo))),'[]'::json)
                        FROM co_usuario_notificacion un inner join usuario u on u.id = un.usuario
                        WHERE un.co_sucursal = $1 and un.co_tema_notificacion = $2
                        and un.eliminado = false and u.eliminado = false
                )
                AS correos_usuarios,	
                (
                    SELECT coalesce(array_to_json(array_agg(to_json(correo))),'[]'::json)
                    FROM co_correo_copia_notificacion
                    WHERE co_sucursal = $1 and co_tema_notificacion = $2 and eliminado = false
                ) 
                AS correos_copia    
`, [co_sucursal, id_tema]);
}


const getUsuarioPorSucursal = (idSucursal) => {
    return genericDao.findAll(getQueryBase(""), [idSucursal]);
};



const getUsuariosAsesoresPorSucursal = (idSucursal) => {
    const ROL_ASESOR = 4;
    return genericDao.findAll(
                        getQueryBase(` AND u.id in (select usuario from si_usuario_sucursal_rol where si_rol = $2 and co_sucursal = $1 and eliminado = false)`)
                        , [idSucursal,ROL_ASESOR]);
};

const insertarUsuario = async (usuarioData) => {
    console.log("@insertarUsuario");

    const { alias,nombre, correo,cat_tipo_usuario, co_sucursal, hora_entrada,password_encriptado, hora_salida,sueldo_mensual, co_empresa, genero } = usuarioData;

    let sql = `
            INSERT INTO USUARIO(ALIAS,NOMBRE,CORREO,CO_SUCURSAL,CAT_TIPO_USUARIO,HORA_ENTRADA,HORA_SALIDA,PASSWORD,SUELDO_MENSUAL,SUELDO_QUINCENAL,CO_EMPRESA,ACCESO_SISTEMA,GENERO)
            VALUES(TRIM(BOTH FROM $1),TRIM(BOTH FROM $2),TRIM($3),$4,$5,$6,$7,$8,$9::numeric,($9::numeric/2)::numeric,$10,true,$11) RETURNING ID;
            `;
    return genericDao
        .execute(sql, [alias,nombre, correo, co_sucursal,cat_tipo_usuario, hora_entrada, hora_salida, password_encriptado,sueldo_mensual,co_empresa,genero]);
};


const validarCorreoUsuario = (correo) => {
    return genericDao
        .findOne("select count(u.id) > 0 as encontrado from usuario u where TRIM(correo) = TRIM($1) and eliminado = false limit 1", [correo]);
};

const buscarCorreo = (correo) => {
    return genericDao
        .findAll(`select * from usuario where TRIM(correo) = TRIM($1) and eliminado = false`
            , [correo]);
};


const modificarUsuario = (usuarioData) => {
    console.log("@modificarUsuario");
    console.log("usuarioDATA "+JSON.stringify(usuarioData));
    const { id,alias,nombre, correo, hora_entrada, hora_salida,sueldo_mensual, genero } = usuarioData;

    //TIPO_USUARIO.MAESTRA
    
    let sql = `
            UPDATE USUARIO SET 
                            ALIAS = TRIM(BOTH FROM $2),
                            NOMBRE = TRIM(BOTH FROM $3),
                            CORREO = TRIM($4),
                            HORA_ENTRADA = $5,
                            HORA_SALIDA=$6,
                            MODIFICO = $7,                            
                            SUELDO_MENSUAL = $8::numeric,
                            SUELDO_QUINCENAL = ($8::numeric/2)::numeric,
                            FECHA_MODIFICO = (current_date+current_time)
            WHERE id = $1
            returning id;
            `;
    return genericDao.execute(sql, [id,alias, nombre, correo, hora_entrada, hora_salida,genero,sueldo_mensual]);
};

const modificarContrasena = async (idUsuario, usuarioData) => {
    console.log("@modificarContrasena");

    const { nueva_clave, genero } = usuarioData;

    let nuevoPassword = encriptar(nueva_clave);

    return await updateClave(idUsuario,nuevoPassword,genero);    
};


const updateClave = async (idUsuario, usuarioData) => {
    console.log("@modificarContrasena");

    const { clave_encriptada, genero } = usuarioData;

    let sql = `
            UPDATE USUARIO SET PASSWORD =  $2,
                                MODIFICO = $3,
                                FECHA_MODIFICO = (getDate('')+getHora(''))
            WHERE id = $1
            returning id;
            `;
    return await genericDao.execute(sql, [idUsuario, clave_encriptada, genero]);
};



const desactivarUsuario = (idUsuario, usuarioData) => {

    console.log("@desactivarUsuario");

    const { motivo_baja, fecha_baja, genero } = usuarioData;
    let sql = `
            UPDATE USUARIO SET 
                    ELIMINADO=true,
                    ACTIVO = FALSE,                    
                    MOTIVO_BAJA = $2,
                    FECHA_BAJA = $3,
                    FECHA_MODIFICO=getDate(''),
                    MODIFICO = $4
            WHERE ID = $1     
            RETURNING ID;               
            `;
    return genericDao.execute(sql, [idUsuario, motivo_baja, fecha_baja, genero]);

};

const desactivarUsuarioReporte = (usuarioData) => {

    console.log("@desactivarUsuarioReporte");
    const { id_usuario, visible,genero } = usuarioData;
    let sql = `
            UPDATE USUARIO SET 
                    VISIBLE_REPORTE=$2,
                    FECHA_MODIFICO=getDate(''),
                    MODIFICO = $3
            WHERE ID = $1     
            RETURNING ID;               
            `;
    return genericDao.execute(sql, [id_usuario,visible, genero]);
};

const modificarAccesoSistema = (usuarioData = { id_usuario, acceso ,genero }) => {

    console.log("@modificarAccesoSistema");
    const { id_usuario, acceso ,genero } = usuarioData;
    let sql = `
            UPDATE USUARIO SET 
                    ACCESO_SISTEMA = $2,
                    FECHA_MODIFICO=(getDate('')+getHora('')),
                    MODIFICO = $3
            WHERE ID = $1     
            RETURNING ID;               
            `;
    return genericDao.execute(sql, [id_usuario,acceso, genero]);
};

const buscarUsuarioId = (idUsuario) => {
    console.log("@findUsuarioId");
    return genericDao.buscarPorId("USUARIO", idUsuario);
};

const findById = async (idUsuario) => {
    console.log("@findById");
    return await genericDao.buscarPorId("USUARIO", idUsuario);
};

const getSucursalesUsuario = (idUsuario)=>{
    return genericDao.findAll(
        `
        SELECT DISTINCT suc.*              
        FROM si_usuario_sucursal_rol usr inner join co_sucursal suc on usr.co_sucursal = suc.id
        WHERE usr.usuario = $1
            and usr.eliminado = false
            and suc.eliminado = false
        ORDER BY  suc.nombre DESC`

        ,[idUsuario]);
};



const getQueryBase = (criterio)=>`
   
SELECT U.ID,
            U.ALIAS,
	        U.NOMBRE,
	        U.CORREO,
	        U.PASSWORD,
	        U.CO_SUCURSAL,
	        U.TOKEN,
	        to_char(U.HORA_ENTRADA,'HH24:MI')::text as hora_entrada,
             to_char(U.HORA_SALIDA,'HH24:MI')::text as hora_salida,
	        U.FOTO,
	        U.ACTIVO,
	        U.MOTIVO_BAJA,
	        U.FECHA_BAJA,
	        U.MINUTOS_GRACIA_ENTRADA,
             SUC.NOMBRE AS NOMBRE_SUCURSAL,                        
            SUC.NOMBRE_CORTO AS NOMBRE_CORTO_SUCURSAL,
             U.ACCESO_SISTEMA,
             U.SUELDO_MENSUAL,
             U.SUELDO_QUINCENAL,             
             ( select count(rel.*)			
             from si_usuario_sucursal_rol rel inner join si_rol rol on rel.si_rol = rol.id
             where rel.co_sucursal = $1
                 and rel.usuario = u.id
                 and rel.eliminado = false 
                 and rol.eliminado = false)
             as roles,
             EXTRACT(WEEK FROM  u.fecha_genero) = EXTRACT(WEEK FROM  getDate('')) as nuevo_ingreso
        FROM USUARIO U INNER JOIN CO_SUCURSAL SUC ON SUC.ID = U.CO_SUCURSAL 		                			   
        WHERE  	        
             SUC.ID = $1              
             ${criterio}
             AND U.ACTIVO = TRUE
             AND U.ELIMINADO = FALSE
             AND U.visible_catalogo = true            
        ORDER BY U.NOMBRE`;

module.exports = {
    obtenerCorreosPorTema
    , insertarUsuario
    , modificarUsuario
    , desactivarUsuario
    , buscarUsuarioId
    ,findById
    , modificarContrasena
    , getUsuarioPorSucursal
    , validarCorreoUsuario
    , buscarCorreo
    , getSucursalesUsuario 
    , desactivarUsuarioReporte
    , updateClave
    , modificarAccesoSistema
    , getUsuariosAsesoresPorSucursal
};

