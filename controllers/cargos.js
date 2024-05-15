const pdf = require('html-pdf');
const cargoService = require('../services/cargoService');
const handle = require('../helpers/handlersErrors');
const { enviarEstadoCuenta } = require('../utils/NotificacionService');
const notificacionService = require('../utils/NotificacionService');

const registrarCargo = async(request, response) => {
    console.log("@registrarCargo");

    try {
        //const params = { fecha_cargo, uid_alumno,co_curso_semanas, cat_cargo, cantidad, monto, nota, genero } = request.body;
        const params = { id_curso, cat_cargo, uid_alumno, id_curso_semanas, cantidad, monto, nota, genero } = request.body;

        const respuesta = await cargoService.registrarCargo(params);
        if (respuesta && respuesta.resultado) {
            //notificacionService.notificarCargo(params.id_alumno,respuesta.id_cargo);
        }
        response.status(200).json(respuesta);
        /*cargoService
            .registrarCargo(params)
            .then(respuesta=>{
                response.status(200).json(respuesta);
            }).catch(error=>{
                handle.callbackError(error,response);
            });*/
    } catch (e) {
        handle.callbackErrorNoControlado(e, response);
    }
};


/*const registrarColegiatura = async (request, response) => {
    console.log("@registrarColegiatura");
    
    try {
        const params = { id_curso,id_alumno,id_curso_semana, genero } = request.body;
        
        const respuesta = await cargoService.registrarColegiatura(params);
        
        //notificacionService.notificarCargo(params.id_alumno,respuesta.id_cargo);
                
        response.status(200).json(respuesta);
        
    } catch (e) {
        handle.callbackErrorNoControlado(e, response);
    }
};*/



const getCatalogoCargosPorEmpresa = (request, response) => {
    console.log("@getCatalogoCargosPorEmpresa");

    try {

        const { id_empresa, id_sucursal } = request.params;

        cargoService.getCatalogoCargosPorEmpresa(id_empresa, id_sucursal)
            .then(results => {
                response.status(200).json(results);
            }).catch(error => {
                handle.callbackError(error, response);
            });

    } catch (e) {
        console.log("ERROR " + e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const getCargosAlumno = async(request, response) => {
    console.log("@getCargosAlumno");
    try {

        const id_alumno = request.params.id_alumno;
        const limite = request.params.limite;

        console.log("id_alumno " + id_alumno);
        console.log("limite " + limite);

        const results = await cargoService.getCargosAlumno(id_alumno, limite);

        response.status(200).json(results);

    } catch (e) {
        console.log("ERROR " + e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const getColegiaturasPendientesCobranza = async(request, response) => {
    console.log("@getColegiaturasPendientesCobranza");
    try {

        const id_sucursal = request.params.id_sucursal;

        console.log("id_alumno " + id_sucursal);

        const results = await cargoService.getColegiaturasPendientesCobranza(id_sucursal);

        response.status(200).json(results);

    } catch (e) {
        console.log("ERROR " + e);
        handle.callbackErrorNoControlado(e, response);
    }
};



const getBalanceAlumno = (request, response) => {
    console.log("@getBalanceAlumno");
    try {

        console.log("request.params.id_alumno " + request.params.id_alumno);

        const id_alumno = parseInt(request.params.id_alumno || 0);

        cargoService
            .getBalanceAlumno(id_alumno)
            .then(results => response.status(200).json(results))
            .catch(error => handle.callbackError(error, response));

    } catch (e) {
        handle.callbackErrorNoControlado(e, response);
    }
};


const eliminarCargos = (request, response) => {
    console.log("@eliminarCargos");
    try {
        //validarToken(request,response);        

        const cargosData = { ids, motivo, genero } = request.body;

        cargoService
            .eliminarCargos(cargosData)
            .then(results => response.status(200).json(results))
            .catch(error => handle.callbackError(error, response));
    } catch (e) {
        handle.callbackErrorNoControlado(e, response);
    }
};

const obtenerMesesAdeudaMensualidad = async(request, response) => {
    console.log("@obtenerMesesAdeudaMensualidad");

    try {

        const { uidCurso, idAlumno } = request.params;

        const lista = await cargoService.obtenerMesesAdeudaMensualidad(idAlumno, uidCurso);

        response.status(200).json(lista);

    } catch (e) {
        handle.callbackErrorNoControlado(e, response);
    }
};



const obtenerFiltroAniosCargosSucursal = (request, response) => {
    console.log("@obtenerFiltroAniosCargosSucursal");

    try {

        const { id_sucursal } = request.params;

        cargoService
            .obtenerFiltroAniosCargosSucursal(id_sucursal)
            .then(results => response.status(200).json(results))
            .catch(error => handle.callbackError(error, response));

    } catch (e) {
        handle.callbackErrorNoControlado(e, response);
    }
};


const obtenerEstadoCuentaAlumno = async(request, response) => {
    console.log("@obtenerEstadoCuentaAlumno");
    try {

        const { id_alumno } = request.params;

        const estadoCuenta = await cargoService.obtenerEstadoCuentaAlumno(id_alumno);

        response.status(200).json(estadoCuenta);

    } catch (e) {
        handle.callbackErrorNoControlado(e, response);
    }
};


const enviarEstadoCuentaAlumno = async(request, response) => {
    console.log("@enviarEstadoCuentaAlumno");
    try {

        const { id_alumno, correo_anexo } = request.body;

        await enviarEstadoCuenta(id_alumno, correo_anexo);

        response.status(200).json({ procesado: true });

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const obtenerHtmlPreviewEstadoCuenta = async(request, response) => {
    console.log("@obtenerHtmlPreviewEstadoCuenta");
    try {

        const { id_alumno } = request.params;

        const html = await cargoService.obtenerPreviewEstadoCuenta(id_alumno);

        //response.status(200).json(html);               
        response.status(200).send(html);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const obtenerPdfPreviewEstadoCuenta = async(request, response) => {
    console.log("@obtenerPdfPreviewEstadoCuenta");
    try {

        const { id_alumno } = request.params;

        const options = { format: 'Letter', path: './templates/recibo_pago.pdf' };

        const html = await cargoService.obtenerPreviewEstadoCuenta(id_alumno);

        pdf.create(html).toStream((error, stream) => {
            if (error) {
                console.log(error);
                response.end("Error creando PDF: " + error)
            } else {
                response.setHeader("Content-Type", "application/pdf");
                stream.pipe(response);
            }
        });


        /* pdf.create(html).toStream((err, pdfStream) => {
             if (err) {   
               // handle error and return a error response code
               console.log(err)
               return response.sendStatus(500);
             } else {
               // send a status code of 200 OK
               res.statusCode = 200             
         
               // once we are done reading end the response
               pdfStream.on('end', () => {
                 // done reading
                 return response.end();
               })
         
               // pipe the contents of the PDF directly to the response
               pdfStream.pipe(response);
             }
           })*/

        //response.status(200).json(html);               
        //response.status(200).send(html);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

function toPDF(html, options, output) {
    return new Promise(function(resolve, reject) {
        pdf.create(html, options).toFile(output, function(error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}


module.exports = {
    registrarCargo,
    getCatalogoCargosPorEmpresa,
    getCargosAlumno,
    getBalanceAlumno,
    eliminarCargos,
    obtenerMesesAdeudaMensualidad,
    obtenerFiltroAniosCargosSucursal,
    obtenerEstadoCuentaAlumno,
    enviarEstadoCuentaAlumno,
    obtenerHtmlPreviewEstadoCuenta,
    obtenerPdfPreviewEstadoCuenta,
    getColegiaturasPendientesCobranza

};