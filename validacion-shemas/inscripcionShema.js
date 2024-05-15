const Joi = require('joi');
const handle = require('../helpers/handlersErrors');

const validarSchemaInscripcion = async(request, response, next) => {
    console.log("@validarSchemaInscripcion ");
    try {
        const body = request.body;
        await schemaInscripcion.validateAsync(body);
        next();
        console.log("NEXT");
    } catch (e) {
        console.log("VALIDACION ERROR " + e);

        handle.sendValidationError(e, response);
    }
}


const schemaInscripcion =
    Joi.object({
        co_empresa: Joi.number().required(),
        co_sucursal: Joi.number().required(),
        co_curso: Joi.number().required(),
        cat_esquema_pago: Joi.number().required(),
        cat_genero: Joi.number().required(),
        nombre: Joi.string().required(),
        apellidos: Joi.string().required(),
        direccion: Joi.string().allow('').optional(),
        telefono: Joi.string().required(),
        correo: Joi.string().required(),
        foto: Joi.string().allow('').optional(),
        fecha_nacimiento: Joi.date().required(),
        nota: Joi.string().optional().allow('').allow(null),
        costo_colegiatura: Joi.number().positive().required(),
        costo_inscripcion: Joi.number().required(),
        usuario_inscribe: Joi.number().required(),
        genero: Joi.number().required(),
    });

const schemaFechaNoSemanas =
    Joi.object({
        fecha_inicio: Joi.date().required(),
        genero: Joi.number().required()
    });

module.exports = { schemaInscripcion, schemaFechaNoSemanas }