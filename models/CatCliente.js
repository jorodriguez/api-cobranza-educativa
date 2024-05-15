class CatCliente {
  constructor() {
    this.id = null;
    this.co_empresa = null;
    this.co_sucursal = null;
    this.genero = null;
    this.modifico = null;
    this.fecha_genero = null;
    this.fecha_modifico = null;
    this.nombre = "";
    this.eliminado = null;
    this.correo = "";
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
  setFechaModifico(fechaModifico) {
    this.fecha_modifico = fechaModifico;
    return this;
  }
  setNombre(nombre) {
    this.nombre = nombre;
    return this;
  }
  setEliminado(eliminado) {
    this.eliminado = eliminado;
    return this;
  }
  setCorreo(correo) {
    this.correo = correo;
    return this;
  }
  build() {
    return {
      id: this.id,
      co_empresa: this.co_empresa,
      co_sucursal: this.co_sucursal,
      genero: this.genero,
      modifico: this.modifico,
      fecha_genero: this.fecha_genero,
      fecha_modifico: this.fecha_modifico,
      nombre: this.nombre,
      eliminado: this.eliminado,
      correo: this.correo
    };
  }
}

module.exports = CatCliente;