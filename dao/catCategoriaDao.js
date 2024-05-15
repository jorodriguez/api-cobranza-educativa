const genericDao = require('./genericDao');
const Tables = require('../utils/Tables');
const Dao = require('./Dao');
const categoriaDao = new Dao(Tables.CAT_CATEGORIA); 
const  CatCategoria = require('../models/CatCategoria');

const getAll = async (coEmpresa) => {
    console.log("@getAllCategoria");
    return await genericDao.findAll(queryBase(), [coEmpresa]);
};

const updateCategoria = async (id,data) => {
    console.log("@updateCategoria id = "+id);  
    console.log(JSON.stringify(data));
    
    const dataUpdate = Object.assign(new CatCategoria(),data);

    const dataWillUpdate = dataUpdate.setFechaModifico(new Date()).setModifico(data.genero).buildForUpdate();

    const row = await categoriaDao.update(id,dataWillUpdate);
    
    return row ? row[0]:null;
}

const createCategoria = async (data) => {
    console.log("@createCategoria");
    try {

        const dataCreate = Object.assign(new CatCategoria(),data);
        
        return await categoriaDao.insert(dataCreate.build());        
        
    }catch(error){
        console.log(error);
        return false;
    }
}



const deleteCategoria = async (id,data) => {
    console.log("@deletecategoria");
    try {

        const dataDel = Object.assign(new CatCategoria(),data);

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
        from cat_categoria
            where co_empresa = $1 
            and eliminado = false
`;




module.exports = {    
    createCategoria,
    updateCategoria,
    deleteCategoria,
    getAll   
};