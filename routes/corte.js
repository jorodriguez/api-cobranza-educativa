const router = require('express').Router();
const corte = require('../controllers/corte');
const checkAuth = require('./check-auth');

//router.get('/',((re,res)=>{console.log("")}));
router.put('/corte/dia/sucursal/:id_sucursal',checkAuth, corte.getCorteDiaSucursal);
router.put('/corte/dia/sucursal/imprimir/:id_sucursal',checkAuth,corte.getHtmlCorteDiaSucursal);
//router.post('/corte/dia/enviar/:id_empresa',checkAuth, corte.getCorteDiaSucursal);


module.exports = router;