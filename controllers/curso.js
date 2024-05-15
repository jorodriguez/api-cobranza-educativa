
const handle = require('../helpers/handlersErrors');

const cursoService = require('../services/cursoService');
const cursoSemanasService = require('../services/cursoSemanasService');

const getCursosActivosInscripcionesAbiertas = async (request, response) => {
    console.log("@getCursosActivosInscripcionesAbiertas");
    try {
        
        const { id_sucursal,id_especialidad } = request.params;
        console.log(" id_sucursal,id_especialidad",id_sucursal+"  "+id_especialidad);
        const results = await cursoService.getCursosActivosInscripcionesAbiertas(id_sucursal,id_especialidad)        
        response.status(200).json(results);       
       
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const getCursosSucursal = async (request, response) => {
    console.log("@getCursosActivosSucursal");
    try {
        
        const { id } = request.params;
        console.log(" id_sucursal",id);
        const results = await cursoService.getCursosSucursal(id);        
        response.status(200).json(results);       
       
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};
/*
const getCursosSucursalEstatusInscripciones = async (request, response) => {
    console.log("@getCursosSucursalEstatusInscripciones");
    try {
        
        const { id,estatus_inscripciones } = request.params;
        console.log(" id_sucursal",id);
        console.log(" estatus_inscripciones ",estatus_inscripciones);

        const results = await cursoService.getCursosSucursalEstatusInscripciones(id,estatus_inscripciones);        
        
        response.status(200).json(results);       
       
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};
*/

const getCursosSucursalActivados = async (request, response) => {
    console.log("@getCursosSucursalActivados");
    try {
        
        const { id_sucursal } = request.params;
        const { activo } = request.params;
        
        const results = await cursoService.getCursosActivoSucursal(id_sucursal,activo);
        response.status(200).json(results);       
       
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const getCursosByUid = async (request, response) => {
    console.log("@getCursosByuUid");
    try {
        
        const { uid } = request.params;        
        const results = await cursoService.getCursoByUid(uid);
        response.status(200).json(results);       
       
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const getCursosProximosIniciar = async (request, response) => {
    console.log("@getCursosProximosIniciar");
    try {
        
        const { id_sucursal } = request.params;
        
        console.log(" id_sucursal ",id_sucursal);

        const results = await cursoService.getCursosInicianProximosDias(id_sucursal);
        
        response.status(200).json(results);       
       
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const createCurso = async (request, response) => {
    console.log("@createCurso");
    try {
        
        const cursoData = {  
            cat_especialidad,
            dias_array,
            //cat_horario,
            hora_inicio,
            hora_fin,
            co_empresa,
            co_sucursal,
            costo_colegiatura_base,
            costo_inscripcion_base,
            nota,
            fecha_inicio_previsto,
            fecha_fin_previsto,      
            genero } = request.body;
        
        const results = await cursoService.createCurso(cursoData);

        console.log("==> "+JSON.stringify(results));

        response.status(200).json(results);       
       
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const deleteCurso = async (request, response) => {
    console.log("@deleteCurso");
    try {
        
        const id =  parseInt(request.params.id);
        const cursoData = {  motivo,genero } = request.body;
        
        const results = await cursoService.eliminarCurso(id,cursoData);
       
        response.status(200).json(results);       
       
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};



const cerrarInscripcionesCurso = async (request, response) => {
    console.log("@cerrarInscripcionesCurso");
    try {
        
        const id =  parseInt(request.params.id);

        const cursoData = {  motivo,genero } = request.body;
        
        const results = await cursoService.cerrarInscripcionesCurso(id,cursoData);
       
        response.status(200).json(results);       
       
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const abrirInscripcionesCurso = async (request, response) => {
    console.log("@abrirInscripcionesCurso");
    try {
        
        const id =  parseInt(request.params.id);

        const cursoData = {  motivo,genero } = request.body;
        
        const results = await cursoService.abrirInscripcionesCurso(id,cursoData);
       
        response.status(200).json(results);       
       
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};




const updateCurso = async (request, response) => {
    console.log("@updateCurso");
    try {
        
        const id =  parseInt(request.params.id);
        const cursoData = {                      
            cat_dia,
            hora_inicio,
            hora_fin,            
            costo_colegiatura_base,
            costo_inscripcion_base,
            nota,
            fecha_inicio_previsto,            
            genero } = request.body;
        
            console.log(`fecha_inicio_previsto,            ${fecha_inicio_previsto}`);
        const results = await cursoService.updateCurso(id,cursoData);
       
        response.status(200).json(results);       
       
    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const getSeriesPeriodosCurso = async (request,response) =>{

    console.log("@getSeriesPeriodosCurso");  
    
    try {

        const { uid } = request.params;

        console.log("uid "+uid);

        //const curso = await cursoService.getCursoByUid(uid);
        let results = [];
        //if(curso && curso.activo){       

            results = await cursoSemanasService.getSemanasCurso(uid);
            
        /*} else{
            results =  await cursoSemanasService.getSeriesPeriodosCurso(uid);        
        } */              

        response.status(200).json(results);

    } catch (e) {
        handle.callbackErrorNoControlado(e, response);
    } 
};


const iniciarCurso = async (request,response) =>{

    console.log("@iniciarCurso");  
    
    try {

        const { uid,genero } = request.body;

        console.log("uid "+uid);

        const results =  await cursoService.iniciarCurso(uid,genero);

        response.status(200).json(results);

    } catch (e) {
        handle.callbackErrorNoControlado(e, response);
    } 
};



module.exports = {
    createCurso,
    updateCurso,
    deleteCurso,
    getCursosActivosInscripcionesAbiertas,
    getCursosSucursal,
    getCursosProximosIniciar,
    getCursosByUid,
    getSeriesPeriodosCurso,
    iniciarCurso,
    getCursosSucursalActivados,
    cerrarInscripcionesCurso,
    abrirInscripcionesCurso,
  
};