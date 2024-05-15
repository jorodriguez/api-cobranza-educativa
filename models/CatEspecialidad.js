class CatEspecialidad {
  constructor() {
    this.id = null;
    this.co_empresa = null;
    this.co_sucursal = null;
    this.cat_duracion = null;
    this.duracion = null;
    this.nombre = "";
    this.descripcion = "";    
    this.alumnos_permitidos = null;
    this.foto = "";
    this.activo = true;
    this.color="";
    this.folio="";    
    this.genero = null;
    this.modifico = null;
    this.fecha_genero = null;
    this.fecha_modifico = null;    
    this.eliminado = null;
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
  setFechaModifico(fechaModifico) {
    this.fecha_modifico = fechaModifico;
    return this;
  }
  setDescripcion(descripcion) {
    this.descripcion = descripcion;
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
      co_empresa: this.co_empresa,
      co_sucursal: this.co_sucursal,
      cat_duracion : this.cat_duracion,
      duracion: this.duracion,    
      descripcion: this.descripcion,
      nombre: this.nombre,
      alumnos_permitidos : this.alumnos_permitidos,
      foto: this.foto,
      activo : this.activo = true,
      color: this.color,
      folio :this.folio,    
      genero: this.genero,                      
    };
  }
  //cat_duracion : this.cat_duracion,
  buildForUpdate() {
    return {                                  
      duracion: this.duracion,    
      descripcion: this.descripcion,
      nombre: this.nombre,
      alumnos_permitidos : this.alumnos_permitidos,
      foto: this.foto,
      activo : this.activo = true,
      color: this.color,
      folio :this.folio,      
      modifico: this.modifico,      
      fecha_modifico: this.fecha_modifico,      
      nombre: this.nombre      
    };
  }
  buildForDelete() {
    return {                  
      modifico: this.modifico,      
      fecha_modifico: this.fecha_modifico,      
      eliminado:true
    };
  }
}


module.exports = CatEspecialidad;