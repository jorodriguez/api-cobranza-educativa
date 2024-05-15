const cargosDao = require('../dao/cargoDao');
const alumnoDao = require('../dao/alumnoDao');
const catCargoDao = require('../dao/catCargoDao');
const cursoDao = require('../dao/cursoDao');
const inscripcionDao = require('../dao/inscripcionDao');
const CONSTANTES = require('../utils/Constantes');

//const notificacionService = require('../utils/NotificacionService');
const { getHtmlPreviewTemplate, TEMPLATES } = require('../utils/CorreoService');
const cursoSemanasService = require('./cursoSemanasService');
const { getSemanaActual } = require('./cursoSemanasService');
const alumnoService = require('./alumnoService');

//registrar cargos
const registrarCargo = async(cargoData) => {
    console.log("@registrarCargo");
    try {

        const { fecha, nombre_mes, id_curso, cat_cargo, uid_alumno, id_curso_semanas, cantidad, monto, nota, cat_esquema_pago, genero } = cargoData;

        console.log("====" + JSON.stringify({ fecha, nombre_mes, cat_esquema_pago, id_curso, cat_cargo, uid_alumno, id_curso_semanas, cantidad, monto, nota, genero }));

        const alumno = await alumnoService.getAlumnoPorUId(uid_alumno);

        let respuesta = null;

        if (cat_cargo == CONSTANTES.ID_CARGO_COLEGIATURA) {
            console.log("Es colegiatura");
            if (cat_esquema_pago == 1) { // semanal
                console.log("semanal");
                respuesta = await registrarColegiatura(id_curso, alumno.id, id_curso_semanas, genero);
            }
            if (cat_esquema_pago == 2) { // mensual
                console.log("mensual");
                respuesta = await registrarColegiaturaMensual(id_curso, alumno.id, fecha, nombre_mes, genero);
            }
        } else {
            console.log("Es un cargo especial");
            respuesta = await guardarCargoGenerico(alumno.id, cat_cargo, cantidad, monto, "", nota, genero);
        }

        //cambio para que la inscripcion se maneje de manera normal 

        /*if (cat_cargo == CONSTANTES.ID_CARGO_INSCRIPCION) {
            console.log("Es inscripcion");
            respuesta = await registrarInscripcion(id_curso, alumno.id, genero);
        }

        if (cat_cargo != CONSTANTES.ID_CARGO_INSCRIPCION && cat_cargo != CONSTANTES.ID_CARGO_COLEGIATURA) {        
            console.log("Es un cargo especial");
            respuesta = await guardarCargoGenerico(alumno.id, cat_cargo, cantidad, monto, "", nota, genero);
        }*/

        //enviar correo de recibo

        return respuesta;
    } catch (error) {
        console.log(" X X X X X " + error);
        return error;
    }
};


const registrarInscripcion = async(idCurso, idAlumno, genero) => {
    console.log("@registrarInscripcion");
    //id_alumno, cat_cargo, cantidad,cargo,total, nota,monto,monto_modificado,monto_original,texto_ayuda,genero
    console.log(`idCurso ${idCurso} idAlumno ${idAlumno} genero ${genero}`);

    const ID_CARGO_INSCRIPCION = 2;

    // const cargoInscripcion = await cargosDao.buscarCargoInscripcion(idCurso, idAlumno);

    /*if (cargoInscripcion != null) {
        console.log("                                          ");
        console.log("   YA TIENE INSCRIPCION AGREGADA ");
        console.log("                                          ");

    } else {*/

    const inscripcionAlumno = await inscripcionDao.getInscripcionAlumnoCurso(idAlumno, idCurso);

    console.log(" procediendo a agregar la  inscripcion  " + inscripcionAlumno);

    let idCargoInscripcion = await cargosDao.registrarCargoGeneral({

        id_alumno: idAlumno,
        cat_cargo: ID_CARGO_INSCRIPCION,
        cantidad: 1,
        cargo: inscripcionAlumno.costo_inscripcion,
        total: inscripcionAlumno.costo_inscripcion,
        nota: ``,
        monto: inscripcionAlumno.costo_inscripcion,
        monto_modificado: false,
        monto_original: inscripcionAlumno.costo_inscripcion,
        co_curso: inscripcionAlumno.id_curso,
        genero: genero
    });


    //actualizar totales adeuda
    await inscripcionDao.actualizarTotalAdeudaInscripcion(inscripcionAlumno.id_alumno, inscripcionAlumno.id_curso, genero);
    await cursoDao.actualizarTotalAdeudaAlumno(idAlumno, genero);

    // }

}

//se usa en el cron
const registrarColegiaturaAlumnoSemanaActualAutomatico = async() => {

    console.log("@registrarColegiaturaAlumnoSemanaActualAutomatico");

    const colegiaturasGeneradas = [];
    //obtener Semana ocurriendo
    const listaInfoCrearColegiaturasSemanaActual = await cursoSemanasService.getInformacionCrearColegiaturaSemanaActual();

    console.log("Cursos que se van a generar " + listaInfoCrearColegiaturasSemanaActual.length);

    for (let i = 0; i < listaInfoCrearColegiaturasSemanaActual.length; i++) {

        const cursoSemanaActual = listaInfoCrearColegiaturasSemanaActual[i];
        /*c.id as id_semana_actual,
        c.co_curso,
        c.numero_semana_curso,      		  	  	
        array_to_json(array_agg(row_to_json((inscripcion.*))))::text array_alumnos,
        count(inscripcion.*) as contador_alumnos*/

        console.log(`${i} - Creando colegiaturas para la semana ${cursoSemanaActual.numero_semana_curso} 
                        del curso ${cursoSemanaActual.co_curso} total de alumnos a generar colegiaturas ${cursoSemanaActual.contador_inscripciones}`);

        const listaInscripciones = cursoSemanaActual.array_inscripciones ? cursoSemanaActual.array_inscripciones : [];

        for (let x = 0; x < listaInscripciones.length; x++) {

            const inscripcion = listaInscripciones[x];

            console.log(`${x} alumno ${inscripcion.co_alumno}`);

            //verificar existencia del registro
            const cargoColegiatura = await cargosDao.buscarCargoColegiatura(cursoSemanaActual.co_curso, cursoSemanaActual.id_semana_actual, inscripcion.co_alumno);

            console.log("      Colegiatura encontrada  " + (cargoColegiatura != null));

            if (cargoColegiatura != null) {
                console.log("                                          ");
                console.log(`>> YA EXISTE LA COLEGIATURA DE LA SEMANA ${cursoSemanaActual.numero_semana_curso} ALUMNO ${inscripcion.alumno} <<`);
                console.log("                                          ");
            } else {
                const idColegiatura = await guardarColegiatura(cursoSemanaActual.co_curso, inscripcion.co_alumno, 1, null, cursoSemanaActual.id_semana_actual, '', CONSTANTES.USUARIO_DEFAULT);
                //await cursoSemanasService.guardarRealcionCargoCursoSemana(cursoSemanaActual.id_semana_actual,idColegiatura,CONSTANTES.USUARIO_DEFAULT );
                colegiaturasGeneradas.push(idColegiatura);
                //console.log("cargo registrado " + idColegiatura);
                console.log(`AGREGAR COLEGIATURA CURSO=${cursoSemanaActual.co_curso},ALUMNO=${inscripcion.co_alumno} SEMANA=${cursoSemanaActual.id_semana_actual}`);
            }
        }
    }
    return colegiaturasGeneradas;

}




//********XXXXX SOLO SE OCUPA PARA GENERAR LAS COLEGIATURAS QUE NO SE GENERARON DESPUES DEL 27 DE ENERO

const registrarColegiaturaAlumnoSemanaActualAutomaticoNoGeneradas = async() => {

    console.log("@registrarColegiaturaAlumnoSemanaActualAutomaticoNoGeneradas");

    const colegiaturasGeneradas = [];
    //obtener Semana ocurriendo
    const listaInfoCrearColegiaturasSemanaActual = await cursoSemanasService.getInformacionCrearColegiaturaSemanaNoGeneradas();

    console.log("Cursos que se van a generar " + listaInfoCrearColegiaturasSemanaActual.length);

    for (let i = 0; i < listaInfoCrearColegiaturasSemanaActual.length; i++) {

        const cursoSemanaActual = listaInfoCrearColegiaturasSemanaActual[i];

        console.log(`${i} - Creando colegiaturas para la semana ${cursoSemanaActual.numero_semana_curso} 
                        del curso ${cursoSemanaActual.co_curso} total de alumnos a generar colegiaturas ${cursoSemanaActual.contador_inscripciones}`);

        const listaInscripciones = cursoSemanaActual.array_inscripciones ? cursoSemanaActual.array_inscripciones : [];

        for (let x = 0; x < listaInscripciones.length; x++) {

            const inscripcion = listaInscripciones[x];

            console.log(`${x} alumno ${inscripcion.co_alumno}`);

            //verificar existencia del registro
            const cargoColegiatura = await cargosDao.buscarCargoColegiatura(cursoSemanaActual.co_curso, cursoSemanaActual.id_semana_actual, inscripcion.co_alumno);

            console.log("      Colegiatura encontrada  " + (cargoColegiatura != null));

            if (cargoColegiatura != null) {
                console.log("                                          ");
                console.log(`>> YA EXISTE LA COLEGIATURA DE LA SEMANA ${cursoSemanaActual.numero_semana_curso} ALUMNO ${inscripcion.alumno} <<`);
                console.log("                                          ");
            } else {
                const idColegiatura = await guardarColegiatura(cursoSemanaActual.co_curso, inscripcion.co_alumno, 1, null, cursoSemanaActual.id_semana_actual, '', CONSTANTES.USUARIO_DEFAULT);

                colegiaturasGeneradas.push(idColegiatura);

                console.log(`AGREGAR COLEGIATURA CURSO=${cursoSemanaActual.co_curso},ALUMNO=${inscripcion.co_alumno} SEMANA=${cursoSemanaActual.id_semana_actual}`);
            }
        }
    }
    return colegiaturasGeneradas;

}


//se usa en el cron
const registrarColegiaturaAlumnoMensualActualAutomatico = async() => {

    console.log("@registrarColegiaturaAlumnoMensualActualAutomatico");

    const colegiaturasGeneradas = [];
    //obtener Semana ocurriendo
    const listaInscripcionesMensuales = await inscripcionDao.getInscripcionesMensualesMesActual();

    console.log("Cursos que se van a generar " + listaInscripcionesMensuales.length);

    for (let i = 0; i < listaInscripcionesMensuales.length; i++) {

        const inscripcion = listaInscripcionesMensuales[i];

        console.log(`${i} - Creando colegiaturas mensual ${inscripcion.nombre_mes} 
                        del curso ${inscripcion.co_curso} `);

        console.log(`${inscripcion} alumno ${inscripcion.co_alumno}`);

        const idColegiatura = await registrarColegiaturaMensual(inscripcion.co_curso, inscripcion.co_alumno, inscripcion.fecha_mes, inscripcion.nombre_mes, CONSTANTES.USUARIO_DEFAULT);

        colegiaturasGeneradas.push(idColegiatura);

    }
    return colegiaturasGeneradas;

}



const registrarColegiaturaAlumnoSemanaActual = async(idCurso, idAlumno, genero) => {

    console.log("@registrarColegiaturaAlumnoSemanaActual");

    //obtener Semana ocurriendo
    const cursoSemanaActual = await cursoSemanasService.getSemanaActualCurso(idCurso);

    console.log(JSON.stringify(cursoSemanaActual));

    //verificar existencia del registro
    const cargoColegiatura = await cargosDao.buscarCargoColegiatura(idCurso, cursoSemanaActual.id, idAlumno);
    //const existeCargoColegiatura = (cursoSemana.co_cargo_colegiatura != null);

    console.log("      Colegiatura " + JSON.stringify(cargoColegiatura));

    if (cargoColegiatura != null) {
        console.log("                                          ");
        console.log(">> YA EXISTE LA COLEGIATURA DE LA SEMANA ");
        console.log("                                          ");
    } else {
        //const idColegiatura = await  guardarColegiatura(idCurso,idAlumno,cursoSemanaActual.id,'',`Semana ${cursoSemana.numero_semana_curso}`,`Sem-${cursoSemana.numero_semana_curso} ${cursoSemana.modulo}-${cursoSemana.materia_modulo}`, genero);
        const idColegiatura = await guardarColegiatura(idCurso, idAlumno, cursoSemanaActual.id, '', genero);
        // await cursoSemanasService.guardarRealcionCargoCursoSemana(cursoSemanaActual.id,idColegiatura,genero);
        console.log("cargo registrado " + idColegiatura);
    }

}


const registrarColegiatura = async(idCurso, idAlumno, idCursoSemana, genero) => {

    console.log("@registrarColegiatura");

    let retId = null;

    const cursoSemana = await cursoSemanasService.getSemanaCursoById(idCursoSemana);

    const cargoColegiatura = await cargosDao.buscarCargoColegiatura(idCurso, cursoSemana.id, idAlumno);


    console.log("  existe Colegiatura " + JSON.stringify(cargoColegiatura));

    if (cargoColegiatura != null) {
        console.log("                                          ");
        console.log(">> YA EXISTE LA COLEGIATURA DE LA SEMANA ");
        console.log("                                          ");
    } else {

        retId = await guardarColegiatura(idCurso, idAlumno, 1, null, cursoSemana.id, '', `Semana ${cursoSemana.numero_semana_curso}`, genero);

        //    await cursoSemanasService.guardarRealcionCargoCursoSemana(cursoSemana.id,retId,genero);
        console.log("cargo registrado " + retId);
    }

    return retId;

}


const registrarColegiaturaMensual = async(idCurso, idAlumno, fechaMes, nombreMes, genero) => {

    console.log("@registrarColegiaturaMensual");

    let retId = null;

    const cargoColegiatura = await cargosDao.buscarCargoColegiaturaMensual(idCurso, fechaMes, idAlumno);

    console.log("  existe Colegiatura del mes " + JSON.stringify(cargoColegiatura));

    if (cargoColegiatura != null) {
        console.log("                                          ");
        console.log(">> YA EXISTE LA COLEGIATURA MENSUAL ");
        console.log("                                          ");
    } else {

        retId = await guardarColegiatura(idCurso, idAlumno, 2, fechaMes, null, '', nombreMes, genero);

        console.log("cargo registrado " + retId);
    }

    return retId;

}

const guardarColegiatura = async(idCurso, idAlumno, catEsquemaPago, fecha, coCursoSemana, folio, textoAyuda, genero) => {
    console.log("@guardarColegiatura");
    //id_alumno, cat_cargo, cantidad,cargo,total, nota,monto,monto_modificado,monto_original,texto_ayuda,genero

    const ID_CARGO_COLEGIATURA = 1;

    let idRet = null;
    const inscripcionAlumno = await inscripcionDao.getInscripcionAlumnoCurso(idAlumno, idCurso);

    if (inscripcionAlumno) {

        console.log(" procediendo a agregar la  colegiatura  ");

        idRet = await cargosDao.registrarCargoGeneral({
            fecha: fecha,
            id_alumno: idAlumno,
            cat_cargo: ID_CARGO_COLEGIATURA,
            cat_esquema_pago: catEsquemaPago,
            cantidad: 1,
            folio: folio,
            co_curso_semanas: coCursoSemana,
            cargo: inscripcionAlumno.costo_colegiatura,
            total: inscripcionAlumno.costo_colegiatura,
            nota: `Cargo generado automáticamente.`,
            monto: inscripcionAlumno.costo_colegiatura,
            monto_modificado: false,
            monto_original: inscripcionAlumno.costo_colegiatura,
            co_curso: inscripcionAlumno.id_curso,
            texto_ayuda: textoAyuda,
            genero: inscripcionAlumno.genero
        });

        //actualizar totales adeuda
        await inscripcionDao.actualizarTotalAdeudaInscripcion(inscripcionAlumno.id_alumno, inscripcionAlumno.id_curso, genero);
        //await alumnoDao.actualizarTotalAdeudaAlumno(idAlumno,genero);
        await cursoDao.actualizarTotalAdeudaAlumno(idAlumno, genero);


    } else {
        console.log("xx NO SE ENCONTRO LA INSCRIPCION DEL ALUMNO");

    }

    return idRet;
}


const guardarCargoGenerico = async(idAlumno, cat_cargo, cantidad, monto, folio, nota, genero) => {
    console.log("@guardarCargoGenerico");

    let idRet = null;

    const cargoCatalogo = await cargosDao.getCatCargo(cat_cargo);

    let montoModificado = false;

    let cargoAplicar = cargoCatalogo.precio;

    if (cargoCatalogo.escribir_monto) {
        //se toma el monto que viene como parametro
        cargoAplicar = monto;
        montoModificado = (cargoCatalogo.precio != monto);
    }

    const montoTotal = (cargoAplicar * cantidad);


    idRet = await cargosDao.registrarCargoGeneral({
        id_alumno: idAlumno,
        cat_cargo: cat_cargo,
        cantidad: 1,
        folio: folio,
        cargo: cargoAplicar,
        co_curso_semanas: null,
        total: montoTotal,
        nota: (nota || ''),
        monto: monto,
        monto_modificado: montoModificado,
        monto_original: cargoCatalogo.precio,
        co_curso: null,
        texto_ayuda: ``,
        genero: genero
    });

    //actualizar totales adeuda en alumno
    //await alumnoDao.actualizarTotalAdeudaAlumno(idAlumno,genero);
    await cursoDao.actualizarTotalAdeudaAlumno(idAlumno, genero);


    return idRet;
}



const getCatalogoCargosPorEmpresa = (idEmpresa, idSucursal) => {
    console.log("@getCatalogoCargosPorEmpresa");
    return cargosDao.getCatalogoCargosPorEmpresa(idEmpresa, idSucursal);
};

const getCargoExtraMensualidadEmpresa = (idEmpresa) => {
    console.log("@getCargoExtraMensualidadEmpresa");
    return cargosDao.getCargoExtraMensualidadEmpresa(idEmpresa);
};


const getCargosAlumno = (idAlumno, limite) => {
    console.log("@getCargosAlumno");

    return cargosDao.getCargosAlumno(idAlumno, limite);
};

const getColegiaturasPendientesCobranza = (idSucursal) => {
    console.log("@getColegiaturasPendientesCobranza");

    return cargosDao.getColegiaturasPendientesCobranza(idSucursal);
};

const getBalanceAlumno = (idAlumno) => {
    console.log("@getBalanceAlumno");

    return cargosDao.getBalanceAlumno(idAlumno);

};

const eliminarCargos = (idCargos) => {
    console.log("@eliminarCargos");
    return cargosDao.eliminarCargos(idCargos);
};

const obtenerMesesAdeudaMensualidad = (idAlumno, uuidCurso) => {
    console.log("@obtenerMesesAdeudaMensualidad");

    return cargosDao.obtenerMesesAdeudaMensualidad(idAlumno, uuidCurso);
};

const obtenerFiltroAniosCargosSucursal = (idSucursal) => {
    console.log("@obtenerFiltroAniosCargosSucursal");

    return cargosDao.obtenerFiltroAniosCargosSucursal(idSucursal);
};

const obtenerEstadoCuentaAlumno = async(idAlumno) => {
    console.log("@obtenerEstadoCuentaAlumno");
    /*const informacionAlumno = await alumnoDao.getCorreosTokensAlumno(idAlumno);  
    let estado = await cargosDao.obtenerEstadoCuenta(idAlumno);         
    return {...estado,
           padres:{
                   nombre_padres: informacionAlumno ? informacionAlumno.nombres_padres : '',
                   correos:  informacionAlumno ? informacionAlumno.correos : ''
               }
           };
           */
    return await cargosDao.obtenerEstadoCuenta(idAlumno);

};

const obtenerPreviewEstadoCuenta = async(idAlumno) => {
    const params = await obtenerEstadoCuentaAlumno(idAlumno);
    //console.log(JSON.stringify(params));
    const { id_empresa } = params.alumno;
    return await getHtmlPreviewTemplate(TEMPLATES.TEMPLATE_ESTADO_CUENTA, params, id_empresa);
};



module.exports = {
    registrarCargo,
    registrarInscripcion,
    registrarColegiatura,
    registrarColegiaturaMensual,
    getCatalogoCargosPorEmpresa,
    getCargosAlumno,
    getBalanceAlumno,
    eliminarCargos,
    obtenerMesesAdeudaMensualidad,
    obtenerFiltroAniosCargosSucursal,
    obtenerEstadoCuentaAlumno,
    obtenerPreviewEstadoCuenta,
    getCargoExtraMensualidadEmpresa,
    registrarColegiaturaAlumnoSemanaActualAutomatico,
    getColegiaturasPendientesCobranza,
    registrarColegiaturaAlumnoMensualActualAutomatico,
    registrarColegiaturaAlumnoSemanaActualAutomaticoNoGeneradas
};