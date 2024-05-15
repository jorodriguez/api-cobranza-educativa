class CatArticulo {
  constructor() {
    this.id = null;
    this.co_empresa = null;
    this.cat_marca = null;
    this.cat_categoria = null;
    this.cat_unidad_medida = null;
    this.genero = null;
    this.modifico = null;
    this.nombre = "";
    this.eliminado = null;
    this.codigo = "";
    this.foto = "";
    this.fecha_modifico = null;
    this.fecha_genero = null;
    this.descripcion = "";
  }
  setId(id) {
    this.id = id;
    return this;
  }
  setCoEmpresa(coEmpresa) {
    this.co_empresa = coEmpresa;
    return this;
  }
  setCatMarca(catMarca) {
    this.cat_marca = catMarca;
    return this;
  }
  setCatCategoria(catCategoria) {
    this.cat_categoria = catCategoria;
    return this;
  }
  setCatUnidadMedida(catUnidadMedida) {
    this.cat_unidad_medida = catUnidadMedida;
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
  setNombre(nombre) {
    this.nombre = nombre;
    return this;
  }
  setEliminado(eliminado) {
    this.eliminado = eliminado;
    return this;
  }
  setCodigo(codigo) {
    this.codigo = codigo;
    return this;
  }
  setFoto(foto) {
    this.foto = foto;
    return this;
  }
  setFechaModifico(fechaModifico) {
    this.fecha_modifico = fechaModifico;
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
  build() {
    return {      
      co_empresa: this.co_empresa,
      cat_marca: this.cat_marca,
      cat_categoria: this.cat_categoria,
      cat_unidad_medida: this.cat_unidad_medida,
      genero: this.genero,
      modifico: this.modifico,
      nombre: this.nombre,
      eliminado: this.eliminado,
      codigo: this.codigo,
      foto: this.foto,
      fecha_modifico: this.fecha_modifico,
      fecha_genero: this.fecha_genero,
      descripcion: this.descripcion
    };
  }
  buildForInsert() {
    return {      
      co_empresa: this.co_empresa,
      cat_marca: this.cat_marca,
      cat_unidad_medida: this.cat_unidad_medida,
      cat_categoria: this.cat_categoria,
      genero: this.genero,      
      nombre: this.nombre,
      codigo: this.codigo,            
      fecha_genero: this.fecha_genero,
      descripcion: this.descripcion
    };
  }

  buildForUpdate() {
    return {            
      cat_marca: this.cat_marca,      
      cat_categoria: this.cat_categoria,
      cat_unidad_medida: this.cat_unidad_medida,
      modifico: this.modifico,
      nombre: this.nombre,      
      //codigo: this.codigo,
      foto: this.foto,
      fecha_modifico: this.fecha_modifico,      
      descripcion: this.descripcion
    };
  }
}

module.exports = CatArticulo;