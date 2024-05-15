class CatTipoMovimiento {
  constructor() {
    this.afectacion = "";
    this.id = null;
    this.co_empresa = null;
    this.genero = null;
    this.modifico = null;
    this.fecha_genero = null;
    this.descripcion = "";
    this.fecha_modifico = null;
    this.nombre = "";
    this.eliminado = null;
  }
  setAfectacion(afectacion) {
    this.afectacion = afectacion;
    return this;
  }
  setId(id) {
    this.id = id;
    return this;
  }
  setCoEmpresa(coEmpresa) {
    this.co_empresa = coEmpresa;
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
  setDescripcion(descripcion) {
    this.descripcion = descripcion;
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
  build() {
    return {
      afectacion: this.afectacion,
      id: this.id,
      co_empresa: this.co_empresa,
      genero: this.genero,
      modifico: this.modifico,
      fecha_genero: this.fecha_genero,
      descripcion: this.descripcion,
      fecha_modifico: this.fecha_modifico,
      nombre: this.nombre,
      eliminado: this.eliminado
    };
  }
}


module.exports = CatTipoMovimiento;