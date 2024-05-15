const genericDao = require('./genericDao');
const Tables = require('../utils/Tables');
const Dao = require('./Dao');
const articuloDao = new Dao(Tables.CAT_ARTICULO); 
const articuloSucursalDao = new Dao(Tables.CAT_ARTICULO_SUCURSAL); 
const  CatArticuloSucursal = require('../models/CatArticuloSucursal');
const  CatArticulo = require('../models/CatArticulo');

const getArticulosSucursal = async (coSucursal) => {
    console.log("@getArticulosSucursal");
    return await genericDao
        .findAll(
            queryBase(` suc.id = $1 `)
            , [coSucursal]);
};


const getArticuloCodigo = async (coSucursal,codigo) => {
    console.log("@getArticuloCodigo");
    return await genericDao
        .findOne(
            queryBase(` a.codigo = $2  and suc.id = $1 `)
            , [coSucursal,codigo]);
};

const getArticulosPorNombre = async (coSucursal,nombre) => {
    console.log("@getArticulosNombre");
    return await genericDao
        .findAll(
            queryBase(` lower(a.nombre) like lower('%${nombre}%')  and suc.id = $1 `)
            , [coSucursal]);
};

const getArticulosPorCategoria = async (coSucursal,catCategoria) => {
    console.log("@getArticulosPorCategoria");
    return await genericDao
        .findAll(
            queryBase(` c.id = $2 and suc.id = $1 `)
            , [coSucursal,catCategoria]);
};

const getCategoriaArticulos = async (coSucursal) => {
    console.log("@getCategoriaArticulos");
    return await genericDao
        .findAll(queryCategoriaArticulos(` art.co_sucursal = $1 `) , [coSucursal]);
};

const updatePrecio = async (id,data) => {
    console.log("@actualizarPrecio");

    //const articuloSucursal = new CatArticuloSucursal(); 

    const row = await articuloSucursalDao.update(id,{
                            precio:data.precio,
                            costo_base:data.costo_base,
                            cantidad_existencia:data.cantidad_existencia,
                            stock_minimo:data.stock_minimo,
                            nota_interna:data.nota_interna,
                            fecha_modifico:new Date(),
                            modifico:data.genero
                        });
    return row;
}


const updateArticulo = async (id,data) => {
    console.log("@updateArticulo");  
    
    const articuloData = Object.assign(new CatArticulo(),data);
    const articuloSucursalData = Object.assign(new CatArticuloSucursal(),data);

    //actualizar el catalogo  - no de modifica el codigo
    const dataArticuloWillUpdate = articuloData.setFechaModifico(new Date()).setModifico(data.genero).buildForUpdate();

    const catArticulo = await articuloDao.update(id,dataArticuloWillUpdate);

    //  actualizar los demas campos
    const dataArticuloSucursalWillUpdate = articuloSucursalData.setFechaModifico(new Date()).setModifico(data.genero).buildForUpdate();

    const catArticuloSucursal = await articuloSucursalDao.update(id,dataArticuloSucursalWillUpdate);
    
    return {catArticulo,catArticuloSucursal};
}


const deleteArticulo = async (id,data) => {
    console.log("@deleteArticulo");  
    
    //const articuloData = Object.assign(new CatArticulo(),data);
    const articuloSucursalData = Object.assign(new CatArticuloSucursal(),data);

    //  actualizar los demas campos
    const dataArticuloSucursalWillUpdate = articuloSucursalData.setFechaModifico(new Date()).setModifico(data.genero).buildForDelete();

    const catArticuloSucursal = await articuloSucursalDao.update(id,dataArticuloSucursalWillUpdate);
    
    return catArticuloSucursal;
}


const createArticulo = async (data) => {
    console.log("@createArticulo");

    //const articuloSucursal = new CatArticuloSucursal(); 
    //https://res.cloudinary.com/dwttlkcmu/image/upload/v1647452466/static/logoproducto_d7cmqg.png
    try {

    let returning = {error:false,mensaje:""};
    
    console.log(JSON.stringify(data));

     //validar existencia de codigo 
     const {co_sucursal,codigo} = data;

    const existeCodigo = await  getArticuloCodigo(co_sucursal,codigo);

    if(existeCodigo){
        returning.error = true;
        returning.mensaje = "Código repetido";
        return returning;
    }

    const articuloData = Object.assign(new CatArticulo(),data);   
        
    /*cat_articulo_sucursal {co_empresa,cat_marca,cat_categoria,codigo,nombre,descripcion,foto,}*/ 
    
    const articuloSucursalData = Object.assign(new CatArticuloSucursal(),data);

    /*cat_articulo_sucursal {co_empresa,co_sucursal,cat_articulo,precio,costo_base,cantidad_existencia,stock_minimo,nota_interna}*/ 
        
    articuloDao.getKnex().transaction(async transactionActive =>{

            //insertar en catalogo de articulos
            const resultsArticulo = await transactionActive(Tables.CAT_ARTICULO).insert(articuloData.buildForInsert()).returning('*');
            const rowArticulo = resultsArticulo.length > 0 ? resultsArticulo[0] : null;

            const dataInsertArticuloSucursal = articuloSucursalData.setCatArticulo(rowArticulo.id).build();

            //insertar en el precio en relacion con la sucursal
            //await articuloSucursalDao.insert(dataInsertArticuloSucursal).transacting(transactionActive);
            await transactionActive(Tables.CAT_ARTICULO_SUCURSAL).insert(dataInsertArticuloSucursal).returning('*');
            console.log("Articulo agregado");

     });    

    return true;

    }catch(error){
        console.log(error);
        return false;
    }
}


const queryBase = (criterio)=>`

select art.id,
	art.co_empresa,
	art.co_sucursal,
	art.cat_articulo,
	art.precio,
	art.costo_base,
	art.cantidad_existencia,
	art.stock_minimo,
	art.nota_interna,
	a.codigo,
	a.nombre,
	a.descripcion,
	a.foto,
    m.id as cat_marca,
	m.nombre as marca, 
    c.id as cat_categoria,
    c.nombre as categoria,
	suc.nombre as sucursal,
    um.id as cat_unidad_medida,
    um.nombre as unidad_medida,
    (art.fecha_genero::date = getDate('')) as es_nuevo
from cat_articulo_sucursal art inner join cat_articulo a on a.id = art.cat_articulo
					    	inner join cat_marca m on m.id = a.cat_marca
                            inner join cat_categoria c on c.id = a.cat_categoria
					        inner join co_sucursal suc on suc.id = art.co_sucursal
                            inner join cat_unidad_medida um on a.cat_unidad_medida = um.id
where ${criterio ? criterio  : ''}
    ${criterio ? ' and '  : ''}
	a.eliminado = false
	and art.eliminado = false   
    order by a.codigo 
`;


const queryCategoriaArticulos = (criterio)=>`
select 
     c.id as cat_categoria,
     c.nombre as categoria,
	 count(art.*) numero_articulos
from cat_articulo_sucursal art inner join cat_articulo a on a.id = art.cat_articulo					    	    
                               inner join cat_categoria c on c.id = a.cat_categoria					            
where ${criterio ? criterio  : ''}
    ${criterio ? ' and '  : ''}    
	art.eliminado = false    
	and a.eliminado = false
group by c.id`;




module.exports = {
    getArticuloCodigo,
    getArticulosSucursal,
    updatePrecio,
    deleteArticulo,
    updateArticulo,
    createArticulo,    
    getArticulosPorNombre,
    getCategoriaArticulos,
    getArticulosPorCategoria,
    findById:articuloDao.findById    
};