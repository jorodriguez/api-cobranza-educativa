const genericDao = require('./genericDao');
const Tables = require('../utils/Tables');
const Dao = require('./Dao');
const siUsuarioSucursalRolDao = new Dao(Tables.SI_USUARIO_SUCURSAL_ROL); 
const  SiUsuarioSucursalRol = require('../models/SiUsuarioSucursalRol');

const getAllRolesUsuario = async (idUsuario,idSucursal) => {
    console.log("@getAllRolesUsuario");
    return await genericDao.findAll(queryBase(), [idUsuario,idSucursal]);
};

const findRelacion = async (siUsuario,siRol,coSucursal,coEmpresa)=>{
    //se busca sin el eliminado debido a que se modifica ese valor
    return genericDao.findOne(`
                select usr.*
                from si_usuario_sucursal_rol usr 
                where usr.usuario = $1 
                        and usr.co_sucursal = $2                        
                        and usr.si_rol =  $3
                        and usr.co_empresa = $4
    `,[siUsuario,coSucursal,siRol,coEmpresa]);
}

const actualizarRol = async (data = {seleccionado,siRol,siUsuario,coSucursal,coEmpresa,idUsuarioGenero}) => {
    console.log("@actualizarRol");
    try {        

        console.log(JSON.stringify(data));

        let retVal;

        const  {seleccionado,siRol,siUsuario,coSucursal,coEmpresa,idUsuarioGenero} = data;

        const registroRelacion = await findRelacion(siUsuario,siRol,coSucursal,coEmpresa);

        if(!registroRelacion){ //insertar

            console.log("INSERTAR")
            /*const insert = new SiUsuarioSucursalRol()
                                    .setSiUsuario(siUsuario)
                                    .setCoEmpresa(coEmpresa)
                                    .setCoSucurssal(coSucursal)
                                    .setGenero(idUsuarioGenero)
                                    .build();*/
            const insert = new SiUsuarioSucursalRol();
                 insert.usuario = siUsuario;
                 insert.si_rol = siRol;
                 insert.co_empresa = coEmpresa;
                 insert.co_sucursal = coSucursal
                 insert.genero = idUsuarioGenero;
                
               retVal = await siUsuarioSucursalRolDao.insert(insert.build());        
        }else{
            console.log("MODIFICAR")
            //existe la relacion modificar el campo eliminado 
            const updateData = Object.assign(new SiUsuarioSucursalRol(),registroRelacion);
        
            const dataWillUpdate = updateData
                                    .setFechaModifico(new Date())
                                    .setModifico(idUsuarioGenero)
                                    .setEliminado(!seleccionado)
                                    .buildForUpdate();
                                    console.log(JSON.stringify(dataWillUpdate));
    
                retVal = await siUsuarioSucursalRolDao.update(registroRelacion.id,dataWillUpdate);            

        }
        return retVal ? retVal[0] : null;
    }catch(error){
        console.log(error);
        return null;
    }
}

const queryBase = ()=>`
select (
        select usr.id 
        from si_usuario_sucursal_rol usr 
        where usr.usuario = $1 
            and usr.co_sucursal = $2 
            and usr.si_rol = rol.id 
            and usr.eliminado =false
        ) is not null as seleccionado,                
        rol.id as si_rol,
        rol.nombre,
        rol.descripcion
    from si_rol rol	 
    where rol.eliminado = false
    order by rol.ordenacion asc
`;





module.exports = {       
    getAllRolesUsuario,actualizarRol
    
};