class VeMovimiento {
  constructor() {
    this.id = null;
    this.co_empresa = null;
    this.co_sucursal = null;
    this.cat_tipo_movimiento = null;
    this.cat_articulo_sucursal = null;
    this.genero = null;
    this.modifico = null;
    this.cantidad = null;
    this.cantidad_posterior = null;
    this.cantidad_anterior = null;
    this.fecha_genero = null;
    this.fecha_modifico = null;
    this.eliminado = null;
    this.nota = null;
    this.precio = null;    
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
  setCatTipoMovimiento(catTipoMovimiento) {
    this.cat_tipo_movimiento = catTipoMovimiento;
    return this;
  }
  setCatArticuloSucursal(catArticuloSucursal) {
    this.cat_articulo_sucursal = catArticuloSucursal;
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
  setCantidad(cantidad) {
    this.cantidad = cantidad;
    return this;
  }
  setCantidadPosterior(cantidadPosterior) {
    this.cantidad_posterior = cantidadPosterior;
    return this;
  }
  setCantidadAnterior(cantidadAnterior) {
    this.cantidad_anterior = cantidadAnterior;
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
  setEliminado(eliminado) {
    this.eliminado = eliminado;
    return this;
  }
  setNota(nota) {
    this.nota = nota;
    return this;
  }
  build() {
    return {      
      co_empresa: this.co_empresa,
      co_sucursal: this.co_sucursal,
      cat_tipo_movimiento: this.cat_tipo_movimiento,
      cat_articulo_sucursal: this.cat_articulo_sucursal,
      genero: this.genero,      
      cantidad: this.cantidad,
      cantidad_posterior: this.cantidad_posterior,
      cantidad_anterior: this.cantidad_anterior,            
      nota: this.nota,               
      precio:this.precio      
    };
  }
}


module.exports = VeMovimiento;