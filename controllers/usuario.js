
const usuarioService = require('../services/usuarioService');
const handle = require('../helpers/handlersErrors');
const { MensajeRetorno } = require('../utils/MensajeRetorno');

const crearUsuario = (request, response) => {
	console.log("@@crearUsuario");
	try {

		const usuarioData = { alias,nombre,cat_tipo_usuario, correo, co_sucursal,co_empresa, hora_entrada, hora_salida,sueldo_mensual, genero } = request.body;

		let proceso = null;		

		if (!correo) {
			console.log("El correo es requerido");
			return new MensajeRetorno(false, "El correo es requerido", null);
		} 
		
		console.log("USUARIO CON CORREO " + usuarioData.correo);
		
		proceso = usuarioService.crearUsuarioConCorreo(usuarioData);

		proceso.then(result => {
    		console.log("nuevo usuario registrado " + JSON.stringify(result));
			response.status(200).json(result);

		}).catch(error => {
			console.error("error:"+error);
			handle.callbackError(error, response);
		});

	} catch (e) {
		console.error("error no controlado"+e);
		handle.callbackErrorNoControlado(e, response);
	}
};
/*
const crearUsuario = (request, response) => {

	try {

		//const usuarioData = { nombre, co_tipo_usuario, correo, id_sucursal, hora_entrada, hora_salida, genero } = request.body;
		const usuarioData = { nombre, co_tipo_usuario, id_sucursal, hora_entrada, hora_salida, genero } = request.body;

		console.log("USUARIO NORMAL (SIN CORREO)");

		usuarioService.crearUsuario(usuarioData)
			.then(result => {
				console.log("nuevo usuario registrado " + JSON.stringify(result));
				response.status(200).json(result);

			}).catch(error => {
				console.error(error);
				handle.callbackError(error, response);
			});

	} catch (e) {
		console.error(e);
		handle.callbackErrorNoControlado(e, response);
	}
}*/


const modificarUsuario = (request, response) => {

	try {

		const usuarioData = { id,alias, nombre, correo, hora_entrada, hora_salida,sueldo_mensual, genero } = request.body;

		var proceso = null;
		if (usuarioData.correo != null && usuarioData.correo != undefined && usuarioData.correo != '') {
			console.log("MODIFICAR USUARIO CON CORREO " + usuarioData.correo);
			proceso = usuarioService.modificarUsuarioConCorreo(usuarioData);
		} else {
			console.log("MODIFICAR USUARIO SIN CORREO");
			proceso = usuarioService.modificarUsuario(usuarioData);
		}

		proceso.then(result => {
			console.log(" usuario modificado " + result);
			response.status(200).json(result);

		}).catch(error => {
			console.error(error);
			handle.callbackError(error, response);
		});

	} catch (e) {
		console.error(e);
		handle.callbackErrorNoControlado(e, response);
	}
};


const desactivarUsuario = (request, response) => {

	try {
		const idUsuario = request.params.id_usuario;
		const usuarioData = { motivo_baja, fecha_baja, genero } = request.body;
		//const idUsuario = request.params.id_usuario;

		usuarioService
			.desactivarUsuario(idUsuario, usuarioData)
			.then(result => {

				console.log(" usuario de baja " + result);
				response.status(200).json(result);

			}).catch(error => {
				console.error(error)
				handle.callbackError(error, response);
			});

	} catch (e) {
		console.error(e);
		handle.callbackErrorNoControlado(e, response);
	}
};


const getUsuariosPorSucursal = (request, response) => {

	try {
		const idSucursal = request.params.id_sucursal;	

		usuarioService
			.getUsuariosPorSucursal(idSucursal)
			.then(results => {

				response.status(200).json(results);

			}).catch(error => {
				console.error(error);
				handle.callbackError(error, response);
			});

	} catch (e) {
		console.error(e);
		handle.callbackErrorNoControlado(e, response);
	}
};


const getAsesoresPorSucursal = async (request, response) => {

	try {
		const idSucursal = request.params.id_sucursal;
		
		const results = await usuarioService.getUsuariosAsesoresPorSucursal(idSucursal);
		
		response.status(200).json(results);

	} catch (e) {
		console.error(e);
		handle.callbackErrorNoControlado(e, response);
	}
};


const buscarUsuarioPorId = (request, response) => {

	try {
		const idUsuario = request.params.id_usuario;

		usuarioService
			.buscarPorId(idUsuario)
			.then(results => {

				response.status(200).json(results);

			}).catch(error => {
				console.error(error);
				handle.callbackError(error, response);
			});

	} catch (e) {
		console.error(e);
		handle.callbackErrorNoControlado(e, response);
	}
};


const getSucursalesUsuario = (request, response) => {

	try {
		const idUsuario = request.params.id_usuario;

		usuarioService
			.getSucursalesUsuario(idUsuario)
			.then(results => {

				response.status(200).json(results);

			}).catch(error => {
				console.error(error);
				handle.callbackError(error, response);
			});

	} catch (e) {
		console.error(e);
		handle.callbackErrorNoControlado(e, response);
	}
};



const desactivarUsuarioReporte = async (request, response) => {

	try {
		const {id_usuario,visible, genero}  = request.body;

		const resultado = await usuarioService.desactivarUsuarioReporte({id_usuario,visible,genero});

		response.status(200).json(resultado);
	} catch (e) {
		console.error(e);
		handle.callbackErrorNoControlado(e, response);
	}
};


const reiniciarClave = async (request, response) => {

	try {
		const {id_usuario, genero}  = request.body;

		const resultado = await usuarioService.reiniciarClave(id_usuario,genero);

		response.status(200).json(resultado);
	} catch (e) {
		console.error(e);
		handle.callbackErrorNoControlado(e, response);
	}
};

const bloquearAccesoSistema = async (request, response) => {

	try {
		const data = {  acceso ,genero }  = request.body;
		const id_usuario = request.params.id_usuario;

		const resultado = await usuarioService.bloquearAccesoSistema({ id_usuario,...data});

		response.status(200).json(resultado);
	} catch (e) {
		console.error(e);
		handle.callbackErrorNoControlado(e, response);
	}
};




module.exports = {
	crearUsuario, 
	modificarUsuario,
	desactivarUsuario, 
	getUsuariosPorSucursal, 
	buscarUsuarioPorId,
	getSucursalesUsuario,
	desactivarUsuarioReporte,
	reiniciarClave,
	bloquearAccesoSistema,
	getAsesoresPorSucursal
};