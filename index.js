const app = require('./routes/app');

const multer = require('multer');
const fileUpload = multer();

//const alumno = require('./services/alumno');
const authController = require('./auth/AuthController');
const pagos = require('./controllers/pagos');
const cargos = require('./controllers/cargos');
const mensajeria = require('./controllers/mensajesFirebase');
const { encriptar } = require('./utils/Utils');

const { configuracion } = require('./config/ambiente');
//const reporteDeudas = require('./controllers/reporteDeudas');
//const reporte_mensualidades = require('./controllers/reporte_mensualidades');
const utilerias = require('./controllers/utilerias');
const gastos = require('./controllers/gastos');
const reporte_gastos = require('./controllers/reporteGastos');
const sucursales = require('./controllers/sucursal');
const alumnoSucursal = require('./controllers/alumno_sucursal');
//const usuarioService = require('./controllers/usuario');
const catagolos = require('./controllers/catalogos');
const conf = require('./controllers/configuracion');
const https = require("https");
const { validarTokenCompleto } = require('./helpers/helperToken');
//const recargoService = require('./controllers/recargos');
//const reporteContabilidad = require('./controllers/reporteContabilidad');
const uploadCloudinary = require('./controllers/uploadCloudinary');
//const avisos = require('./controllers/avisos');

const checkAuth = require('./routes/check-auth');
const schedulerJob = require('./routes/schedulerJob');
const loginRoutes = require('./routes/login');
const alumnoRoute = require('./routes/alumno');
const cursoRoute = require('./routes/curso');
const inscripcionRoute = require('./routes/inscripcion');
const especialidadRoute = require('./routes/especialidad');
const asistenciaUsuariosRoute = require('./routes/asistenciaUsuarios');
const usuarioRhRoute = require('./routes/usuariosRh');
const catDiaRoute = require('./routes/catDia');
const catHorario = require('./routes/catHorario');
const catEscolaridad = require('./routes/catEscolaridad');
const perdiodosCurso = require('./routes/periodosCurso');
const catMateria = require('./routes/catMateria');
const corte = require('./routes/corte');
const cobranza = require('./routes/cobranza');
const venta = require('./routes/venta');
const articulo = require('./routes/articuloController');
const categoriaArticulo = require('./routes/categoriasArticuloController');
const catCategoria = require('./routes/categoriasController');
const catMarcaController = require('./routes/catMarca');
const estatus = require('./routes/estatus');
const catUnidadMedida = require('./routes/catUnidadMedida');
const movimientoInventario = require('./routes/movimientoInventario');
const usuarioRoute = require('./routes/usuario');
//const siRol = require('./routes/siRol');
const siUsuarioSucursalRol = require('./routes/siUsuarioSucursalRol');
const reportesController = require('./routes/reportesController');
const esquemaPagoController = require('./routes/catEsquemaPago');
const coFacturacionSucursal = require('./routes/coFacturacionSucursal');
const sucursal = require('./routes/sucursal');
const impresion = require('./routes/impresion');


app.use('/auth', loginRoutes);
app.use('/alumnos', alumnoRoute);
app.use('/curso', cursoRoute);
app.use('/inscripcion', inscripcionRoute);
app.use('/especialidad', especialidadRoute);
app.use('/dias', catDiaRoute);
app.use('/horarios', catHorario);
app.use('/escolaridad', catEscolaridad);
app.use('/periodos-curso', perdiodosCurso);
app.use('/materias', catMateria);
app.use('/reportes', corte);
app.use('/cobranza', cobranza);
app.use('/venta', venta);
app.use('/articulo', articulo);
app.use('/categoria-articulo', categoriaArticulo);
app.use('/categoria', catCategoria);
app.use('/marca', catMarcaController);
app.use('/unidad-medida', catUnidadMedida);
app.use('/estatus', estatus);
app.use('/movimiento-inventario', movimientoInventario);
app.use('/usuario', usuarioRoute);
app.use('/usuario-rol', siUsuarioSucursalRol);
app.use('/reportes', reportesController);
app.use('/esquema-pago', esquemaPagoController);
app.use('/facturacion', coFacturacionSucursal);
app.use('/sucursal', sucursal);
app.use('/impresion', impresion);

app.use('/jobs', schedulerJob);

//app.use('/escolaridad',catEscolaridad);

//Cambio de sucursal
app.get('/sucursal_usuario/:id', authController.obtenerSucursalesUsuario);
app.put('/sucursal_usuario', authController.cambiarSucursalUsuario);

//Asistencia Usuarios
app.use('/asistencia_usuarios', asistenciaUsuariosRoute);

app.use('/usuarios_rh', usuarioRhRoute);

app.get('/genero_alumno', checkAuth, catagolos.getCatGeneroAlumno);

app.get('/pass/:text', (request, response) => {

    console.log("@Encriptar clave ");
    try {

        const { text } = request.params;

        let p = text;

        console.log("@p " + p);

        if (!p) {
            const desiredMaxLength = 5
            p = '';
            for (var i = 0; i < desiredMaxLength; i++) {
                p += Math.floor(Math.random() * 10);
            }
        }


        console.log("@Encriptar clave");

        const enc = encriptar(p);

        console.log("@enc " + enc);

        response.status(200).json({ p: p, enc: enc });
    } catch (error) {
        response.status(200).json(error);
    }
});


//pagos
app.post('/pagos/registrar', checkAuth, pagos.registrarPago);
//app.post('/pagos/:id_alumno',checkAuth, pagos.go);
app.get('/pagos/:id_cargo_balance_alumno', checkAuth, pagos.getPagosByCargoId);
//app.get('/pagos/printing/:id_pago',checkAuth, cargos.obtenerHtmlPreviewEstadoCuenta);
app.put('/pagos/reenviar_comprobante', checkAuth, pagos.reenviarComprobantePago); //Reenviar correo




//imprimir - obtiene html
app.get('/pagos/imprimir/:id_pago/:id_usuario', checkAuth, pagos.imprimirComprobantePago);

app.post('/cargos/registrar', checkAuth, cargos.registrarCargo);
//app.post('/cargos/registrarColegiatura',checkAuth, cargos.registrarCargo);
app.get('/cargos/:id_empresa/:id_sucursal', checkAuth, cargos.getCatalogoCargosPorEmpresa);
app.get('/cargos/alumno/:id_alumno/:limite', checkAuth, cargos.getCargosAlumno);
app.get('/balance/:id_alumno', checkAuth, cargos.getBalanceAlumno);
app.put('/cargos/:id_alumno', checkAuth, cargos.eliminarCargos);

app.get('/formas_pagos', checkAuth, catagolos.getFormasPago);

//-Estado de cuenta
app.get('/estado_cuenta/:id_alumno', checkAuth, cargos.obtenerEstadoCuentaAlumno);
app.get('/estado_cuenta/preview/:id_alumno', checkAuth, cargos.obtenerHtmlPreviewEstadoCuenta);
app.get('/estado_cuenta/print/:id_alumno', cargos.obtenerPdfPreviewEstadoCuenta);
app.post('/estado_cuenta/enviar', checkAuth, cargos.enviarEstadoCuentaAlumno);


//gastos
app.get('/gastos/:co_sucursal/:anio_mes', checkAuth, gastos.getGastosPorSucursal);
app.get('/historico_gastos/:co_sucursal', checkAuth, gastos.getSumaMesGastosPorSucursal);
//app.put('/gastos/corte/dia/sucursal/:id_sucursal',checkAuth, gastos.getGastosCortePorSucursal);
app.post('/gastos', checkAuth, gastos.registrarGasto);
app.put('/gastos', checkAuth, gastos.modificarGasto);
app.delete('/gastos/:id', checkAuth, gastos.eliminarGasto);
app.get('/tipos_gasto/:id_empresa', checkAuth, gastos.getCatalogoTipoGastoPorEmpresa);

//Reporte de gastos
//app.get('/reporte_gastos', reporte_gastos.getReporteGastosSucursalesMensual);
app.get('/reporte_gastos_sucursales/:id_usuario', checkAuth, reporte_gastos.getReporteGastosSucursalesMensualActual);
//app.get('/reporte_gastos/:mes_anio', reporte_gastos.getReporteGastosSucursalesMensual);
app.get('/reporte_gastos/:id_sucursal', checkAuth, reporte_gastos.getReporteGastosMensualesPorSucursalTrend);
app.get('/reporte_gastos/:id_sucursal/:mes_anio', checkAuth, reporte_gastos.getReporteDetalleGastosPorSucursal);
app.get('/reporte_gastos_global/:id_usuario', checkAuth, reporte_gastos.getReporteGastosGlobal);
app.get('/reporte_gastos_mes_actual/:id_usuario', checkAuth, reporte_gastos.getReporteGastoMensualActual);


//catalogo de maestros
/*app.get('/usuario/:id_sucursal',checkAuth, usuarioService.getUsuariosPorSucursal);
app.get('/usuario/buscar/:id_usuario',checkAuth, usuarioService.buscarUsuarioPorId);
app.post('/usuario',checkAuth, usuarioService.crearUsuario);
app.put('/usuario', checkAuth,usuarioService.modificarUsuario);
app.put('/usuario/:id_usuario',checkAuth, usuarioService.desactivarUsuario);
*/
//AVISOS
/*app.get('/aviso/:id_usuario',checkAuth, avisos.getAvisosUsuario);
app.get('/aviso/tags/:idUsuario',checkAuth, avisos.getTagsContactos);
app.get('/aviso_preview/:idEmpresa/:htmlAviso',checkAuth,avisos.obtenerHtmlPreviewAviso);
app.post('/aviso',checkAuth, avisos.registrarAviso);
app.put('/aviso/:id',checkAuth, avisos.modificarAviso);
app.delete('/aviso',checkAuth,avisos.eliminarAvisos);
*/

//configuracion
app.get('/configuracion', checkAuth, conf.getConfiguracion);


//sucursales y cambios
app.get('/sucursal/:id_empresa', checkAuth, sucursales.getSucursalPorEmpresa);
app.put('/cambio_sucursal/:id_alumno', checkAuth, alumnoSucursal.cambiarSucursalAlumno);


//Subir imagen
app.post('/foto_perfil', checkAuth, fileUpload.single('image'), (req, res) => {
    let respuesta = validarTokenCompleto(req, res);

    if (!respuesta.tokenValido) {
        console.log(" ((((( Token invalido  )))))");
        return req.status(respuesta.status).send(respuesta);
    } else {
        console.log(" PASA EL TOKEN ");
        uploadCloudinary.uploadImagenPerfil(req, res);
    }
});


app.post('/foto_curso', checkAuth, fileUpload.single('image'), (req, res) => {

    let respuesta = validarTokenCompleto(req, res);

    if (!respuesta.tokenValido) {
        console.log(" ((((( Token invalido  )))))");
        return req.status(respuesta.status).send(respuesta);
    } else {
        console.log(" PASA EL TOKEN ");
        uploadCloudinary.uploadFotoCurso(req, res);
    }
});

//Subir imagen articulo
/*app.post('/foto_articulo',checkAuth, fileUpload.single('image'), (req,res)=>{
	let respuesta = validarTokenCompleto(req, res);

	if (!respuesta.tokenValido) {
		console.log(" ((((( Token invalido  )))))");
		return req.status(respuesta.status).send(respuesta);
	} else {
		console.log(" PASA EL TOKEN ");
		uploadCloudinary.uploadImagenPerfil(req,res);		
	}
});
*/
console.log("---------registro de todos los endpoints finalizados -----------------");