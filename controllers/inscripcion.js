const inscripcionService = require('../services/inscripcionService');
const handle = require('../helpers/handlersErrors');
const { schemaInscripcion } = require('../validacion-shemas/inscripcionShema');
const alumnoService = require('../services/alumnoService');

const guardarInscripcion = async(request, response) => {
    console.log("@guardarInscripcion");
    try {

        const inscripcionData = {
            co_empresa,
            co_sucursal,
            co_curso,
            cat_genero,
            nombre,
            apellidos,
            direccion,
            telefono,
            correo,
            fecha_nacimiento,
            nota,
            foto,
            cat_escolaridad,
            ocupacion,
            originario,
            tutor,
            telefono_tutor,
            costo_colegiatura,
            costo_inscripcion,
            usuario_inscribe,
            cat_esquema_pago,
            genero
        } = request.body;

        console.log(" casting  " + JSON.stringify(inscripcionData));

        await schemaInscripcion.validateAsync(inscripcionData);

        const results = await inscripcionService.guardarInscripcion(inscripcionData);

        response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const getInscripciones = async(request, response) => {

    console.log("@getInscripciones");

    try {

        const id_sucursal = parseInt(request.params.id_sucursal);

        const results = await inscripcionService.getInscripciones(id_sucursal);

        response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const getInscripcionesSucursalCurso = async(request, response) => {
    console.log("@getInscripcionesSucursalCurso");
    try {

        const id_sucursal = parseInt(request.params.id_sucursal);
        const id_curso = parseInt(request.params.id_curso);

        const results = await inscripcionService.getInscripcionesSucursalCurso(id_sucursal, id_curso);
        response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const getInscripcionesAlumno = async(request, response) => {
    console.log("@getInscripcionesAlumno");
    try {

        const uid_alumno = request.params.uid;

        const results = await inscripcionService.getInscripcionesAlumno(uid_alumno);
        response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

/* pendiente
const cambiarTallerAlumno = async(request, response) => {
    console.log("@cambiarTallerAlumno");
    try {

        const uid_alumno = request.params.uid_alumno;
        const { id_curso_cambiar } = request.body;

        const results = await inscripcionService.
        response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};*/

const getInscripcionesCursoActivoAlumno = async(request, response) => {
    console.log("@getInscripcionesCursoActivoAlumno");
    try {

        const uid_alumno = request.params.uid_alumno;

        const results = await inscripcionService.getInscripcionesActivasAlumno(uid_alumno);
        response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};



const confirmarInscripcion = async(request, response) => {
    console.log("@confirmarInscripcion");
    try {

        const id_inscripcion = request.params.id_inscripcion;
        const data = { confirmacion, nota, genero } = request.body;
        const results = await inscripcionService.confirmarInscripcion(id_inscripcion, data);
        response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

const getInscripcionesCurso = async(request, response) => {
    console.log("@getInscripcionesCurso");
    try {

        const uid = request.params.uid;

        const results = await inscripcionService.getInscripcionesCurso(uid);

        response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const modificarColegiaturaInscripcion = async(request, response) => {
    console.log("@modificarColegiaturaInscripcion");
    try {

        const id_inscripcion = request.params.id_inscripcion;
        
        const data = { costo_colegiatura,cat_esquema_pago, nota, genero } = request.body;

        const results = await inscripcionService.modificarCostoColegiaturaInscripcion(id_inscripcion, data);
        
        response.status(200).json(results);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


const enviarCorreoBienvenida = async(request, response) => {

    console.log("@enviarCorreoBienvenida");

    try {

        const { uuid_alumno, correo, genero } = request.body;

        console.log("uuid_alumno " + uuid_alumno);
        console.log("correo " + correo);

        await alumnoService.modificarCorreoAlumno(uuid_alumno, { correo, genero });

        const inscripciones = await inscripcionService.getInscripcionesAlumno(uuid_alumno);

        for (let i = 0; i < inscripciones.length; i++) {

            const inscripcion = inscripciones[i];

            console.log("inscripcion " + JSON.stringify(inscripcion));

            await inscripcionService.enviarCorreoBienvenida(inscripcion.id_inscripcion);
        }

        response.status(200).json({ enviado: true });

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};


module.exports = {
    guardarInscripcion,
    confirmarInscripcion,
    getInscripciones,
    getInscripcionesAlumno,
    getInscripcionesCurso,
    getInscripcionesCursoActivoAlumno,
    getInscripcionesSucursalCurso,
    modificarColegiaturaInscripcion,
    enviarCorreoBienvenida
};