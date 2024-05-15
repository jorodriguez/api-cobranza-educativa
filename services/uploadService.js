const uploadCloudinaryDao = require('../dao/uploadCoudinaryDao');
const facturacionRecursoDao = require('../dao/facturacionRecursoDao');
const alumnoDao = require('../dao/alumnoDao');
const cursoDao = require('../dao/cursoDao');
const sucursalDao = require('../dao/sucursalDao');
const empresaDao = require('../dao/empresaDao');
const articuloDao = require('../dao/articuloDao');
const CONSTANTES = require('../utils/Constantes');

async function upload(idAlumno, genero, imagen) {
    console.log("@upload" + idAlumno);
    console.log("@upload" + genero);
    console.log("@upload" + (imagen !== undefined));

    try {
        let idResult = 0;
        let imagenEliminada = false;
        let procederUpload = true;

        let alumno = await alumnoDao.getAlumnoPorIdInfoEmpresaSucursal(idAlumno);

        let tieneFotoModificada = (alumno.public_id_foto != null);

        if (tieneFotoModificada) {
            console.log("tiene foto modificada se procede a eliminar");
            imagenEliminada = await uploadCloudinaryDao.destroyFoto(alumno.public_id_foto);
        }

        procederUpload = (tieneFotoModificada && imagenEliminada) || !tieneFotoModificada;

        console.log("tieneFoto = " + tieneFotoModificada + " se elimino = " + imagenEliminada);

        if (procederUpload) {
            console.log("se procede a subir la nueva imagen");

            const ruta = `${alumno.nombre_folder_empresa}/${alumno.nombre_folder_sucursal}/${CONSTANTES.FOLDER_PERFILES_CLOUDNARY}`;

            let resultImagen = await uploadCloudinaryDao.uploadCloud(imagen, ruta);
            console.log("ResulT " + JSON.stringify(resultImagen));

            if (resultImagen.upload) {
                console.log("@actualizando foto de alumno");
                idResult = await alumnoDao.modificarFotoPerfil(idAlumno, resultImagen, genero);

                //aqui guardar el log de facturacion
                await facturacionRecursoDao.guardarItemFacturacionRecurso({
                    tipoFacturacionRecursos: facturacionRecursoDao.TIPO_RECURSO.ALTA_FOTO,
                    coSucursal: alumno.co_sucursal,
                    nota: `Alumno ${alumno.nombre} ${alumno.apellidos}`,
                    textoAyuda: `${resultImagen.secure_url}`,
                    genero
                });
            }
        }
        console.log("termino");
        return idResult > 0;
    } catch (e) {
        console.log("ERROR  " + JSON.stringify(e));
        return false;
    }
}


const uploadImagenArticulo = async(idArticulo, genero, imagen) => {
    console.log("@upload" + idArticulo);
    console.log("@upload" + genero);
    console.log("@upload" + (imagen !== undefined));

    try {
        let idResult = 0;
        let imagenEliminada = false;
        let procederUpload = true;

        let alumno = await alumnoDao.getAlumnoPorIdInfoEmpresaSucursal(idAlumno);

        let tieneFotoModificada = (alumno.public_id_foto != null);

        if (tieneFotoModificada) {
            console.log("tiene foto modificada se procede a eliminar");
            imagenEliminada = await uploadCloudinaryDao.destroyFoto(alumno.public_id_foto);
        }

        procederUpload = (tieneFotoModificada && imagenEliminada) || !tieneFotoModificada;

        console.log("tieneFoto = " + tieneFotoModificada + " se elimino = " + imagenEliminada);

        if (procederUpload) {
            console.log("se procede a subir la nueva imagen");

            const ruta = `${alumno.nombre_folder_empresa}/${alumno.nombre_folder_sucursal}/${CONSTANTES.FOLDER_PERFILES_CLOUDNARY}`;

            let resultImagen = await uploadCloudinaryDao.uploadCloud(imagen, ruta);
            console.log("ResulT " + JSON.stringify(resultImagen));

            if (resultImagen.upload) {
                console.log("@actualizando foto de alumno");
                idResult = await alumnoDao.modificarFotoPerfil(idAlumno, resultImagen, genero);
            }
        }
        console.log("termino");
        return idResult > 0;
    } catch (e) {
        console.log("ERROR  " + JSON.stringify(e));
        return false;
    }

}


async function uploadFotoCurso(uuidCurso, genero, imagen) {
    console.log("@uuid curso" + uuidCurso);
    console.log("@upload" + genero);
    console.log("@upload" + (imagen !== undefined));

    try {
        let idResult = 0;
        let imagenEliminada = false;
        let procederUpload = true;

        let curso = await cursoDao.getCursoByUid(uuidCurso);

        let tieneFotoModificada = (curso.public_id_foto != null);

        if (tieneFotoModificada) {
            console.log("tiene foto modificada se procede a eliminar");
            imagenEliminada = await uploadCloudinaryDao.destroyFoto(alumno.public_id_foto);
        }

        procederUpload = (tieneFotoModificada && imagenEliminada) || !tieneFotoModificada;

        console.log("tieneFoto = " + tieneFotoModificada + " se elimino = " + imagenEliminada);

        if (procederUpload) {

            console.log("se procede a subir la nueva imagen del curso");

            const sucursal = await sucursalDao.getSucursalPorId(curso.co_sucursal);
            const empresa = await empresaDao.getEmpresaId(curso.co_empresa);

            const ruta = `${empresa.nombre_folder}/${sucursal.nombre_folder}/${CONSTANTES.FOLDER_FOTO_CURSO_CLOUDNARY}`;

            let resultImagen = await uploadCloudinaryDao.uploadCloud(imagen, ruta);

            console.log("ResulT " + JSON.stringify(resultImagen));

            if (resultImagen.upload) {
                console.log("@actualizando foto de alumno");

                idResult = await cursoDao.actualizarPublicIdFoto(uuidCurso, resultImagen.public_id,resultImagen.secure_url, genero);
            
                console.log("procediendo a guardar la facturacion");

                //aqui guardar el log de facturacion
                await facturacionRecursoDao.guardarItemFacturacionRecurso({
                    tipoFacturacionRecursos: facturacionRecursoDao.TIPO_RECURSO.ALTA_FOTO,
                    coSucursal: curso.co_sucursal,
                    nota: `Curso ${curso.especialidad} `,
                    textoAyuda: `${resultImagen.secure_url}`,
                    genero
                });
            }
        }
        return idResult > 0;
    } catch (e) {
        console.log("ERROR  " + JSON.stringify(e));
        return false;
    }
}



module.exports = { upload, uploadImagenArticulo, uploadFotoCurso }