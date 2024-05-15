class VeVentaDetalle {
  constructor() {
    this.id = null;
    this.co_empresa = null;
    this.co_sucursal = null;
    this.ve_venta = null;
    this.cat_articulo_sucursal = null;
    this.genero = null;
    this.modifico = null;
    this.fecha_genero = null;
    this.precio = null;
    this.importe = null;
    this.cantidad = null;
    this.eliminado = null;
    this.fecha_modifico = null;
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
  setVeVenta(veVenta) {
    this.ve_venta = veVenta;
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
  setFechaGenero(fechaGenero) {
    this.fecha_genero = fechaGenero;
    return this;
  }
  setPrecio(precio) {
    this.precio = precio;
    return this;
  }
  setImporte(importe) {
    this.importe = importe;
    return this;
  }
  setCantidad(cantidad) {
    this.cantidad = cantidad;
    return this;
  }
  setEliminado(eliminado) {
    this.eliminado = eliminado;
    return this;
  }
  setFechaModifico(fechaModifico) {
    this.fecha_modifico = fechaModifico;
    return this;
  }
  build() {
    return {      
      co_empresa: this.co_empresa,
      co_sucursal: this.co_sucursal,
      ve_venta: this.ve_venta,
      cat_articulo_sucursal: this.cat_articulo_sucursal,
      genero: this.genero,            
      precio: this.precio,
      importe: this.importe,
      cantidad: this.cantidad      
    };
  }
  
}


module.exports = VeVentaDetalle;