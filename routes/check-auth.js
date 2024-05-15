const config = require('../config/configJwt');
const jwt = require('jsonwebtoken');

const noTokenProvider = { auth: false, message: 'No token provided.' };

const failedAuthenticateToken = { auth: false, message: {} };

module.exports = (request, response,next) => {
    console.log("validar token ");
    try {
        const respuestaNoToken = { tokenValido: false, status: 401, mensajeRetorno: noTokenProvider };
        const respuestaFail = { tokenValido: false, status: 401, tokenExpired: false, mensajeRetorno: failedAuthenticateToken };
        const respuestaOk = { tokenValido: true, status: 200, mensajeRetorno: {} };
        let token = request.headers['x-access-token'];

        if (!token) {
            console.log(" x x x x x respuestaNoToken x x x x x");
            return respuestaNoToken;
        }

        let respuesta = respuestaOk;        

        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                console.log("ERROR " + JSON.stringify(err));

                respuestaFail.mensajeRetorno.message = err;

                respuestaFail.tokenExpired = (err.name == 'TokenExpiredError');                

                console.log("token expirado = " + respuestaFail.tokenExpired);

                respuesta = respuestaFail;
                
                response.status(401).json(respuesta);
            }else{
                console.log("Token vigente ");       
                console.log("Token OK");            
                next();
            }            
        });        
        
    } catch (e) {
        console.log("Algun error al validar el token " + e);        
        response.status(401).json({ tokenValido: false, status: 200, mensajeRetorno: {name:"Error inesperado"}});
    }
};

