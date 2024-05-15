const moment = require('moment');
const handle = require('../helpers/handlersErrors');
const {schemaFechaNoSemanas} = require('../validacion-shemas/consultasShema');
const cursoService = require('../services/cursoService');
const cursoSemanasService = require('../services/cursoSemanasService');




const getSemanasColegiaturasParaCargo = async (request,response) =>{

    console.log("@getSemanasColegiaturasParaCargo");  
    
    try {

        const { uidCurso,idAlumno } = request.params;
        
        console.log("iudCurso "+uidCurso);
        console.log("iudCurso "+idAlumno);

                
        let results = [];       

        results = await cursoSemanasService.getSemanasColegiaturasParaCargo(uidCurso,idAlumno);

        response.status(200).json(results);

    } catch (e) {
        handle.callbackErrorNoControlado(e, response);
    } 
};


const getSemanasCalculadasPreviewPagosCurso = async (request,response) =>{

    console.log("@getSemanasCalculadasPagosCurso");  
    
    try {

        const { fecha_inicio,numero_semanas,co_empresa } = request.params;

        console.log("fecha"+fecha_inicio);
        console.log("numero semanas "+numero_semanas);

        let fechaConsulta = moment(fecha_inicio).format('YYYY-MM-DD');
        
       let validacion =  await schemaFechaNoSemanas.validateAsync({fecha_inicio:fechaConsulta,numero_semanas,co_empresa});

       console.log("validacion "+JSON.stringify(validacion));               

        let results = [];       

        results = await cursoSemanasService.getSemanasCalculadasPreviewPorFecha(fechaConsulta,numero_semanas,co_empresa);

        response.status(200).json({
                fecha_inicio,
                numero_semanas,
                semanas:results
        });

    } catch (e) {
        handle.callbackErrorNoControlado(e, response);
    } 
};




module.exports = {
    getSemanasColegiaturasParaCargo,
    getSemanasCalculadasPreviewPagosCurso
};