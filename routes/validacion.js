const router = require('express').Router();

const app = require('./app');
const { validarTokenCompleto } = require('../helpers/helperToken');

const POST = (url, metodo) => {
	console.log("Registrando post");
	app.post(url, (request, response) => {
		let respuesta = validarTokenCompleto(request, response);

		if (!respuesta.tokenValido) {
			console.log(" ((((( Token invalido  )))))");
			return response.status(respuesta.status).send(respuesta);
		} else {			
			metodo(request, response);
		}
	});
};

const GET = (url, metodo) => {
	console.log("registrando get");
	app.get(url, (request, response) => {
		let respuesta = validarTokenCompleto(request, response);

		if (!respuesta.tokenValido) {
			console.log(" ((((( Token invalido  )))))");
			return response.status(respuesta.status).send(respuesta);
		} else {			
			metodo(request, response);
		}
	});
};


const PUT = (url, metodo) => {
	console.log("registrando put");
	app.put(url, (request, response) => {
		let respuesta = validarTokenCompleto(request, response);

		if (!respuesta.tokenValido) {
			console.log(" ((((( Token invalido  )))))");
			return response.status(respuesta.status).send(respuesta);
		} else {
			console.log(" PASA EL TOKEN ");
			metodo(request, response);
		}
	});
};

const DELETE = (url, metodo) => {
	console.log("registrando DELETE");
	app.delete(url, (request, response) => {
		let respuesta = validarTokenCompleto(request, response);

		if (!respuesta.tokenValido) {
			console.log(" ((((( Token invalido  )))))");
			return response.status(respuesta.status).send(respuesta);
		} else {			
			metodo(request, response);
		}
	});
};


module.exports = {POST,GET,PUT,DELETE}