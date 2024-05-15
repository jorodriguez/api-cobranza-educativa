const {
    getQueryInstance
} = require('../controllers/sqlHelper');
const {
    Exception,
    ExceptionBD
} = require('../exception/exeption');
const genericDao = require('./genericDao');

const TIPO_RECURSO = { MESUALIDAD: 1, DESARROLLO_NUEVO: 2, ALTA_FOTO: 3, IMPRESION_CREDENCUAL: 4 };

const guardarItemFacturacionRecurso = async(itemData) => {

    console.log("@guardarItemFacturacionRecurso");

    const { coSucursal, tipoFacturacionRecursos, nota, textoAyuda, genero } = itemData;

    console.log("sucursal " + coSucursal);
    console.log("tipo " + tipoFacturacionRecursos);
    console.log("nota " + nota);
    console.log("textoayuda " + textoAyuda);
    console.log("gener " + genero);

    const tipoRecurso = await getTipoRecursoId(tipoFacturacionRecursos);
    console.log(tipoRecurso);

    const ret = await genericDao.execute(`        		
            INSERT INTO si_facturacion_recursos(si_tipo_facturacion_recurso,precio,co_sucursal,nota,texto_ayuda,genero)
            VALUES($1,$2,$3,$4,$5,$6) RETURNING ID;
    `, [tipoFacturacionRecursos, tipoRecurso.precio, coSucursal, nota, textoAyuda, genero]);

    await actualizarCreditoFotosSucursal(coSucursal, genero);

    return ret;
}

const actualizarCreditoFotosSucursal = async(idSucursal, genero) => {
    //set credito_fotos = credito_fotos -  (select count(*) as contador from si_facturacion_recursos where si_tipo_facturacion_recurso = $1 and co_sucursal = $2 and eliminado = false),
    await genericDao.execute(`        		
			update co_sucursal 
				set credito_fotos = (credito_fotos - 1),
				fecha_modifico = (getDate('')+getHora('')),
				modifico = $2
			where id = $1 ;
    `, [idSucursal, genero]);
};




const getTipoRecursoId = (id) => {
    console.log("@getTipoRecursoId ");
    return genericDao.findOne(`SELECT * FROM SI_TIPO_FACTURACION_RECURSO WHERE eliminado = false AND  ID = $1 `, [id]);
};

const getAllRecursosFacturacionSucursal = (idSucursal) => {
    return genericDao.findAll(getQuery(), [idSucursal]);
}

const getQuery = () => `
with universo as (
	SELECT 	  
		r.id, 
	  	r.precio,
	  	suc.nombre as sucursal,
	  	r.nota, 
	  	r.texto_ayuda,	  
	  	u.nombre as registro,
	  	r.fecha_genero
	FROM SI_FACTURACION_RECURSOS r inner join si_tipo_facturacion_recurso tipo on tipo.id = r.si_tipo_facturacion_recurso
						inner join co_sucursal suc on suc.id = r.co_sucursal
						inner join usuario u on u.id = r.genero
	WHERE r.eliminado = false	          
) select 
		u.sucursal as sucursal,	  	  
		to_char(u.fecha_genero,'MMYYYY') as mes_anio,	  
	  	to_char(u.fecha_genero,'MONTH') as mes,	  	
	  	sum(u.precio) as total,
	  	array_to_json(array_agg(to_json(u.*))) as detalle 
from universo u
where 
    u.co_sucursal = $1 
    AND to_char(u.fecha_genero,'yyyy') = to_char(getDate(''),'yyyy') -- SOLO EL AÑO EN CURSO
group by u.sucursal,to_char(u.fecha_genero,'MMYYYY'),to_char(u.fecha_genero,'MONTH')
	 
`;


module.exports = {
    TIPO_RECURSO,
    guardarItemFacturacionRecurso,
    getAllRecursosFacturacionSucursal
}