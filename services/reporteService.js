const moment = require('moment');
moment().format('ll');
require('moment/locale/es'); // without this line it didn't work
moment.locale('es');
const reporteDao = require('../dao/reporteDao');

module.exports = {
    getReportes : reporteDao.getReportes,
    getEjecucionReporte : reporteDao.getEjecucionReporte,
    getReporteInscripcionesPorAgenteAnual: reporteDao.getReporteInscripcionesPorAgenteAnual
};