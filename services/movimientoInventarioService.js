const articuloDao = require('../dao/articuloDao');
const Tables = require('../utils/Tables');
const Dao = require('../dao/Dao');
const articuloSucursalDao = new Dao(Tables.CAT_ARTICULO_SUCURSAL); 
const movimientoArticuloDao = require('../dao/movimientoArticuloDao');
const VeMovimiento  = require('../models/VeMovimiento');

const guardarMovimientoInventario = async (data = {id_articulo_sucursal,cat_tipo_movimiento,existencia_nueva,precio_nuevo,co_empresa,co_sucursal,nota,genero})=>{

   const {id_articulo_sucursal,cat_tipo_movimiento,existencia_nueva,precio_nuevo,co_empresa,co_sucursal,nota,genero} = data;

   const articuloSucursal = await articuloSucursalDao.findById(id_articulo_sucursal);

   console.log("ENCONTRADO "+JSON.stringify(articuloSucursal));
   
   let result = null;

   if(articuloSucursal){
           
      const veMovimiento = new VeMovimiento();

      console.log("guardando Movimiento ");

      const movimientoInsert = veMovimiento.setCoEmpresa(co_empresa)
                  .setCoSucursal(co_sucursal)
                  .setGenero(genero)
                  .setCatTipoMovimiento(cat_tipo_movimiento) //cat_tipo_movimiento
                  .setCatArticuloSucursal(articuloSucursal.id)
                  .setCantidad(existencia_nueva)
                  .setPrecio(articuloSucursal.precio)                                    
                  .setNota(nota)
                  .build();

    // articuloSucursalDao.getKnex().transaction(async transactionActive =>{
      //modificar la existencia

      //agregar un movimiento 
      result = await movimientoArticuloDao.createMovimientoArticulo(
                                      articuloSucursal.id,
                                      existencia_nueva,
                                      {
                                          ...movimientoInsert,
                                         // transaction:transactionActive                                                   
                                      }
                                  );
      //});

   }

   return result;
}


/*
const createArticulo = async (data) => {
   console.log("@createArticulo");
   
   try {

   let returning = {error:false,mensaje:""};
   
    //validar existencia de codigo 
    const {co_sucursal,codigo} = data;

   const existeCodigo = await  getArticuloCodigo(co_sucursal,codigo);

   if(existeCodigo){
       returning.error = true;
       returning.mensaje = "Código repetido";
       return returning;
   }

   const articuloData = Object.assign(new CatArticulo(),data);          
   
   
   const articuloSucursalData = Object.assign(new CatArticuloSucursal(),data);
   
       
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
}*/


module.exports = { guardarMovimientoInventario    };
