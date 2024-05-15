const inscripcionDao = require('../dao/inscripcionDao');
const alumnoDao = require('../dao/alumnoDao');
const cargoService = require('../services/cargoService');
const notificacionAlumnoService = require('../utils/NotificacionAlumnoService');
const cursoDao = require('../dao/cursoDao');

const guardarInscripcion = async(inscripcionData) => {

    const alumnoData = { co_sucursal, cat_genero, nombre, apellidos, direccion, telefono, correo, fecha_nacimiento, nota, foto, co_empresa, genero } = inscripcionData;
    const inscripcion = { co_curso, co_empresa, co_sucursal, costo_colegiatura, costo_inscripcion, nota, usuario_inscribe, cat_esquema_pago, genero } = inscripcionData;

    const idAlumno = await alumnoDao.guardarAlumno(alumnoData);

    const idInscripcion = await inscripcionDao.guardarInscripcion(idAlumno, inscripcion);

    await cargoService.registrarInscripcion(co_curso, idAlumno, genero);

    const alumno = await alumnoDao.getAlumnoPorId(idAlumno);

    //Enviar un correo  {id_inscripcion,co_empresa,co_sucursal,genero}
    await notificacionAlumnoService.enviarCorreoBienvenida({
        id_inscripcion: idInscripcion,
        co_empresa: co_empresa,
        co_sucursal: co_sucursal,
        genero: genero
    });
    return alumno;
}

const enviarCorreoBienvenida = async(id_inscripcion) => {

    const inscripcion = await inscripcionDao.findById(id_inscripcion);

    await notificacionAlumnoService
        .enviarCorreoBienvenida({
            id_inscripcion: id_inscripcion,
            co_empresa: inscripcion.co_empresa,
            co_sucursal: inscripcion.co_sucursal,
            genero: inscripcion.genero
        });

}

const confirmarInscripcion = async(idInscripcion, inscripcionData) => {

    //const data = {confirmacion,nota,genero}=inscripcionData;

    const id = await inscripcionDao.confirmarInscripcion(idInscripcion, inscripcionData);
    //Aqui agregar los cargos de inicio

    return id;
}


const modificarCostoColegiaturaInscripcion = async(idInscripcion, inscripcionData) => {

    const id = await inscripcionDao.modificarColegiaturaInscripcion(idInscripcion, inscripcionData);

    return id;
}


const generarInscripcionesAutomaticamente = async() => {
    console.log("@generarInscripcionesAutomaticamente");
    try {

        const SUPER_USUAURIO = 1;
        let arrayResponse = [];

        const cursosInicianHoy = await cursoDao.getCursosInicianHoy();

        if (cursosInicianHoy || cursosInicianHoy.lenght == 0) {
            console.log("############ no inicia nungun curso hoy ##########");
            return;
        }

        console.log("Iniciando el proceso de generacion de inscripciones ");
        for (const curso of cursosInicianHoy) {

            console.log("-- iniciando las inscripciones del curso " + curso.especialidad);

            const inscripcionesAutomaticas = await inscripcionDao.getIncripcionesCursoIniciaHoy(curso.id);

            if (inscripcionesAutomaticas && inscripcionesAutomaticas.length > 0) {

                for (const element of inscripcionesAutomaticas) {

                    await cargoService.registrarInscripcion(curso.id, element.id_alumno, SUPER_USUAURIO);
                }
            } else {
                console.log("No existieron inscripciones confirmadas")
            }
        }
        console.log("=========== TERMINO EL PROCESO DE INSCRIPCIONES ?¿============");
        return arrayResponse;

    } catch (e) {
        console.log("Error al generar los cargos de inscripcion " + e);
        return [];
    }
}


module.exports = {
    guardarInscripcion,
    confirmarInscripcion,
    generarInscripcionesAutomaticamente,
    getInscripciones: inscripcionDao.getInscripciones,
    getInscripcionesSucursalCurso: inscripcionDao.getInscripcionesSucursalCurso,
    getInscripcionesAlumno: inscripcionDao.getInscripcionesAlumno,
    getInscripcionesActivasAlumno: inscripcionDao.getInscripcionesActivasAlumno,
    getInscripcionesCurso: inscripcionDao.getInscripcionesCurso,
    modificarCostoColegiaturaInscripcion,
    enviarCorreoBienvenida
};