const uploadService = require('../services/uploadService');

const uploadImagenPerfil = async(request, response) => {
    console.log("@uploadImagenPerfil");
    try {

        const data = { id_alumno, genero } = request.body;

        const image = request.file.buffer;

        let re = await uploadService.upload(id_alumno, genero, image);

        console.log("Respondiento peticion");
        response.status(200).json(re);
    } catch (error) {
        console.log("Error al cargar la imagen " + JSON.stringify(error));
        response.status(400).json({ upload: false, error: error });
    }
};


const uploadImagenArticulo = async(request, response) => {
    console.log("@uploadImagenArticulo");
    try {

        const data = { id_articulo, genero } = request.body;
        const image = request.file.buffer;
        let re = await uploadService.upload(id_alumno, genero, image);
        console.log("Respondiento peticion");
        response.status(200).json(re);
    } catch (error) {
        console.log("Error al cargar la imagen " + JSON.stringify(error));
        response.status(400).json({ upload: false, error: error });
    }
};

const uploadFotoCurso = async(request, response) => {
    console.log("@uploadFotoCurso");
    try {

        const data = { uid_curso, genero } = request.body;

        const image = request.file.buffer;

        let re = await uploadService.uploadFotoCurso(uid_curso, genero, image);

        console.log("Respondiento peticion");
        response.status(200).json(re);
    } catch (error) {
        console.log("Error al cargar la imagen " + JSON.stringify(error));
        response.status(400).json({ upload: false, error: error });
    }
};

module.exports = { uploadImagenPerfil, uploadFotoCurso };