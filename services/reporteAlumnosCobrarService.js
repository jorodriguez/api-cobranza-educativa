const cobranzaAlumnosDao = require('../dao/cobranzaAlumnosDao');
const templateService = require('./templateService');
const { TIPO_TEMPLATE } = require('../utils/Constantes');

const getAlumnosCobrar = async(data = { coSucusal }) => {

    console.log("@getDashboardContadores");

    const { coSucusal } = data;

    const lista = await cobranzaAlumnosDao.getReporteListaAlumnosCobranza({ id_sucursal: coSucusal });

    return lista;
};



module.exports = {
    getAlumnosCobrar
};