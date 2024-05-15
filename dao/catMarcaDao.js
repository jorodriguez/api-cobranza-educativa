const genericDao = require('./genericDao');
const Tables = require('../utils/Tables');
const Dao = require('./Dao');
const marcaDao = new Dao(Tables.CAT_MARCA); 
const  CatMarca = require('../models/CatMarca');


const getAll = async (coEmpresa) => {
    console.log("@getAllMarca");
    return await genericDao.findAll(queryBase(), [coEmpresa]);
};

const updateMarca = async (id,data) => {
    console.log("@updateMarca");  
    
    const marcaData = Object.assign(new CatMarca(),data);

    const dataWillUpdate = marcaData.setFechaModifico(new Date()).setModifico(data.genero).buildForUpdate();

    const row = await marcaDao.update(id,dataWillUpdate);

    return row ? row[0]:null;
}


const createMarca = async (data) => {
    console.log("@createMarca");
    try {

        const marcaData = Object.assign(new CatMarca(),data);
        
        return await marcaDao.insert(marcaData.build());        
        
    }catch(error){
        console.log(error);
        return false;
    }
}



const deleteMarca = async (id,data) => {
    console.log("@deleteMarca");
    try {

        const dataDel = Object.assign(new CatMarca(),data);

        const dataWillDelete = dataDel.setFechaModifico(new Date()).setModifico(data.genero).buildForDelete();
    
        const row = await marcaDao.update(id,dataWillDelete);
        
        return row ;
        
    }catch(error){
        console.log(error);
        return false;
    }
}

const queryBase = ()=>`
        select * 
        from cat_marca 
            where co_empresa = $1 
            and eliminado = false
`;




module.exports = {
    createMarca,
    updateMarca,
    deleteMarca,
    getAll 
    
};