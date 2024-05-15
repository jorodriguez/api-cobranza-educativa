const genericDao = require('./genericDao');
const Tables = require('../utils/Tables');
const Dao = require('./Dao');
const unidadMedidaDao = new Dao(Tables.CAT_UNIDAD_MEDIDA); 
const CatUnidadMedida = require('../models/CatUnidadMedida');


const getAll = async (coEmpresa) => {
    console.log("@getAllUnidadMedida");
    return await genericDao.findAll(queryBase(), [coEmpresa]);
};

const updateUnidadMedida = async (id,data) => {
    console.log("@updateUnidadMedida");  
    
    const unidadMedidaData = Object.assign(new CatUnidadMedida(),data);

    const dataWillUpdate = unidadMedidaData.setFechaModifico(new Date()).setModifico(data.genero).buildForUpdate();

    const row = await unidadMedidaDao.update(id,dataWillUpdate);

    return row ? row[0]:null;
}


const createUnidadMedida = async (data) => {
    console.log("@createUnidadMedida");
    try {

        const unidadMedidaData = Object.assign(new CatUnidadMedida(),data);
        
        return await unidadMedidaDao.insert(unidadMedidaData.build());        
        
    }catch(error){
        console.log(error);
        return false;
    }
}


const deleteUnidadMedia = async (id,data) => {
    console.log("@deleteUnidadMedia");
    try {

        const dataDel = Object.assign(new CatUnidadMedida(),data);

        const dataWillDelete = dataDel.setFechaModifico(new Date()).setModifico(data.genero).buildForDelete();
    
        const row = await categoriaDao.update(id,dataWillDelete);
        
        return row ;
        
    }catch(error){
        console.log(error);
        return false;
    }
}



const queryBase = ()=>`
        select * 
        from cat_unidad_medida
            where co_empresa = $1 
            and eliminado = false
`;




module.exports = {
    createUnidadMedida,
    updateUnidadMedida,
    deleteUnidadMedia,
    getAll   
    
};