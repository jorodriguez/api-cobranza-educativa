class VeVenta {
  constructor() {
    this.id = null;
    this.co_empresa = null;
    this.co_sucursal = null;
    this.cat_cliente = null;
    this.si_estatus = null;
    this.genero = null;
    this.modifico = null;
    this.nota_venta = "";
    this.cambio = null;
    this.fecha_genero = null;
    this.folio = "";
    this.fecha_modifico = null;
    this.total = null;
    this.fecha = null;
    this.eliminado = null;
    this.cantidad_articulos = null;
    this.recibido = null;
    this.motivo = null;
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
  setCatCliente(catCliente) {
    this.cat_cliente = catCliente;
    return this;
  }
  setSiEstatus(siEstatus) {
    this.si_estatus = siEstatus;
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
  setNotaVenta(notaVenta) {
    this.nota_venta = notaVenta;
    return this;
  }
  setCambio(cambio) {
    this.cambio = cambio;
    return this;
  }
  setFechaGenero(fechaGenero) {
    this.fecha_genero = fechaGenero;
    return this;
  }
  setFolio(folio) {
    this.folio = folio;
    return this;
  }
  setFechaModifico(fechaModifico) {
    this.fecha_modifico = fechaModifico;
    return this;
  }
  setTotal(total) {
    this.total = total;
    return this;
  }
  setFecha(fecha) {
    this.fecha = fecha;
    return this;
  }
  setEliminado(eliminado) {
    this.eliminado = eliminado;
    return this;
  }
  setCantidadArticulos(cantidadArticulos) {
    this.cantidad_articulos = cantidadArticulos;
    return this;
  }
  setRecibido(recibido) {
    this.recibido = recibido;
    return this;
  }
  setMotivo(motivo) {
    this.motivo = motivo;
    return this;
  }
  build() {
    return {      
      co_empresa: this.co_empresa,
      co_sucursal: this.co_sucursal,
      cat_cliente: this.cat_cliente,
      genero: this.genero,      
      nota_venta: this.nota_venta,
      cambio: this.cambio,
      fecha_genero: this.fecha_genero,
      folio: this.folio,      
      total: this.total,            
      cantidad_articulos: this.cantidad_articulos,
      recibido: this.recibido
    };
  }

  buildForUpdate() {
    return {              
      modifico: this.modifico,            
      cambio: this.cambio,
      fecha_genero: this.fecha_genero,
      folio: this.folio,      
      total: this.total,            
      cantidad_articulos: this.cantidad_articulos,
      recibido: this.recibido,
      si_estatus:this.si_estatus,
      motivo:this.motivo
    };
  }
  buildForDelete() {
    return {                    
      si_estatus:this.si_estatus,
      motivo:this.motivo,
      modifico: this.modifico,            
      fecha_modifico:this.fecha_modifico,
      eliminado:true
    };
  }
  buildForEstatusChange() {
    return {                    
      si_estatus:this.si_estatus,
      motivo:this.motivo,
      modifico: this.modifico,            
      fecha_modifico:this.fecha_modifico,      
    };
  }
}


module.exports = VeVenta;