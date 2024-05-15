class CatArticuloSucursal {
  constructor() {
    this.id = null;
    this.co_empresa = null;
    this.co_sucursal = null;
    this.cat_articulo = null;
    this.genero = null;
    this.modifico = null;
    this.precio = null;
    this.fecha_genero = null;
    this.fecha_modifico = null;
    this.cantidad_existencia = null;
    this.nota_interna = "";
    this.eliminado = null;
    this.costo_base = null;
    this.stock_minimo = null;
  }
  setId(id) {
    this.id = id;
    return this;
  }
  setCoEmpresa(coEmpresa) {
    this.co_empresa = coEmpresa;
    return this;
  }
  setCoSucursal(coSucursal) {
    this.co_sucursal = coSucursal;
    return this;
  }
  setCatArticulo(catArticulo) {
    this.cat_articulo = catArticulo;
    return this;
  }
  setGenero(genero) {
    this.genero = genero;
    return this;
  }
  setModifico(modifico) {
    this.modifico = modifico;
    return this;
  }
  setPrecio(precio) {
    this.precio = precio;
    return this;
  }
  setFechaGenero(fechaGenero) {
    this.fecha_genero = fechaGenero;
    return this;
  }
  setFechaModifico(fechaModifico) {
    this.fecha_modifico = fechaModifico;
    return this;
  }
  setCantidadExistencia(cantidadExistencia) {
    this.cantidad_existencia = cantidadExistencia;
    return this;
  }
  setNotaInterna(notaInterna) {
    this.nota_interna = notaInterna;
    return this;
  }
  setEliminado(eliminado) {
    this.eliminado = eliminado;
    return this;
  }
  setCostoBase(costoBase) {
    this.costo_base = costoBase;
    return this;
  }
  setStockMinimo(stockMinimo) {
    this.stock_minimo = stockMinimo;
    return this;
  }
  build() {
    return {      
      co_empresa: this.co_empresa,
      co_sucursal: this.co_sucursal,
      cat_articulo: this.cat_articulo,
      genero: this.genero,      
      precio: this.precio,            
      cantidad_existencia: this.cantidad_existencia,
      nota_interna: this.nota_interna,      
      costo_base: this.costo_base,
      stock_minimo: this.stock_minimo
    };
  }
  buildForUpdate() {
    return {                              
      precio: this.precio,            
      costo_base: this.costo_base,
      cantidad_existencia: this.cantidad_existencia,
      nota_interna: this.nota_interna,            
      stock_minimo: this.stock_minimo,
      genero: this.genero
    };
  }
  buildForDelete() {
    return {                              
      eliminado:true,
      fecha_modifico:this.fecha_modifico,
      modifico: this.genero
    };
  }
}

module.exports = CatArticuloSucursal;
