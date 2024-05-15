const handle = require('../helpers/handlersErrors');
const reportePagosService = require('../services/reportePagosService');

const getHtmlReporteEstadoCuentaDetallado = async(request, response) => {
    console.log("@getHtmlReporteEstadoCuentaDetallado");
    try {

        const { uidAlumno } = request.params;

        const html = await reportePagosService.getReporteHtmlEstadoCuentaDetallado(uidAlumno);


        response.status(200).send(html);

    } catch (e) {
        console.log(e);
        handle.callbackErrorNoControlado(e, response);
    }
};



module.exports = {
    getHtmlReporteEstadoCuentaDetallado
};