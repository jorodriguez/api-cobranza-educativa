const handle = require('../helpers/handlersErrors');
const reporteAlumnosCobrarService = require('../services/reporteAlumnosCobrarService');

const getReporteListaAlumnosCobrar = async(request, response) => {
    console.log("@getReporteListaAlumnosCobrar");
    try {

        const { coSucursal } = request.params;

        console.log("coSucursal  " + coSucursal);

        const lista = await reporteAlumnosCobrarService.getAlumnosCobrar({ coSucusal: coSucursal });

        response.status(200).json(lista);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};

module.exports = {
    getReporteListaAlumnosCobrar
};