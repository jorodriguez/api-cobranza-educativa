const inscripcionDao = require('../dao/inscripcionDao');
const alumnoService = require('./alumnoService');
const sucursalService = require('./sucursalService');
const templateService = require('./templateService');
const { TIPO_TEMPLATE } = require('../utils/Constantes');
const QRCode = require('qrcode');

const dotenv = require('dotenv');
dotenv.config();
const configEnv = require('../config/configEnv');

//const { enviarCorreoBienvenida } = require('./inscripcionService');


const getFormatoCredencial = async(uuidAlumno, genero) => {

    console.log("@getFormatoCredencial");

    const listaInscripcionCurso = await inscripcionDao.getIncripcionCursoAlumno(uuidAlumno);

    const inscripcionCurso = listaInscripcionCurso[0] || null;

    //const alumno = await alumnoService.getAlumnoPorUId(uuidAlumno);

    const nombreGrupo = `${inscripcionCurso.especialidad}`;

    const sucursal = await sucursalService.getSucursalPorId(inscripcionCurso.co_sucursal);

    const url = `${configEnv.URL_CHECK_QR}/${inscripcionCurso.uid}`;

    console.log(url);

    const qrText = await QRCode.toDataURL(url);

    const params = {
        nombre_alumno: `${inscripcionCurso.alumno} ${inscripcionCurso.apellidos}`,
        nombre_carrera: nombreGrupo,
        domicilio_sucursal: sucursal.direccion,        
        ciclo: "-",
        foto: inscripcionCurso.foto,
        qr: qrText
    };


    /*
        const qrSource = {
            data: {
                uuid: inscripcionCurso.uid,
                matricula: inscripcionCurso.matricula,
                nombre: inscripcionCurso.alumno,
                curso: nombreGrupo
            },
            mode: "alphanumeric"
        };  

        QRCode.toDataURL(JSON.stringify(qrSource), function(err, url) {
            if (err) {
                console.log(err);
            }
            console.log("===================================");
            console.log(url)
            console.log("===================================");
        });*/

    const html = await templateService
        .loadTemplateEmpresa({
            params,
            idEmpresa: inscripcionCurso.co_empresa,
            idUsuario: genero,
            tipoTemplate: TIPO_TEMPLATE.FORMATO_CREDENCIAL
        });

    console.log("TEMRINA PROCESO DE GENERACION DE CREDENCIAL");

    return html;
};



module.exports = {
    getFormatoCredencial
};