const genericDao = require("./genericDao");
const {
    ExceptionDatosFaltantes,
    ExceptionBD,
} = require("../exception/exeption");
const { isEmptyOrNull } = require("../utils/Utils");


const createCurso = async(cursoData) => {
    console.log("@dao.createCurso");
    try {

        const {
            nombre,            
            co_empresa,
            co_sucursal,            
            nota,            
            genero
        } = cursoData;

        console.log(JSON.stringify(cursoData));

        const id = await genericDao.execute(`
          insert into co_curso(nombre,co_empresa,nota,co_sucursal,foto,genero)
          values($1,$2,$3,$4,$5,$6) RETURNING ID;
    `, [nombre,                        
            co_empresa,            
            nota,             
            co_sucursal,             
            "",
            genero
        ]); 

        console.log("nuevo id del curso " + id);

        return id;
    } catch (e) {
        console.log("Error al insertar el curso " + e);
        throw new ExceptionBD("Error");
    }
};

const updateCurso = async(id, cursoData) => {
    console.log("@updateCurso");

    const {
        nombre,
        nota,        
        genero
    } = cursoData;
    
    return await genericDao.execute(
        `
                                    UPDATE CO_CURSO
                                    SET nombre = $2                                                                                
                                        nota = $3,                                        
                                        fecha_modifico = (getDate('')+getHora('')),
                                        modifico = $1
                                    WHERE id = $1
                                    RETURNING ID;
                                    `, [id, //1      
            nombre,
            nota, //7            
            genero //9
        ]
    );
};


const marcarCursoComoIniciado = async(uid, genero) => {
    console.log("@marcarCursoComoIniciado");

    return await genericDao.execute(
        `
                                    UPDATE CO_CURSO
                                    SET 
                                        fecha_inicio = getDate(''),
                                        semana_actual=1,
                                        activo=true,
                                        fecha_modifico = (getDate('')+getHora('')),
                                        modifico = $2
                                    WHERE uid = $1
                                    RETURNING ID;
                                    `, [uid, genero]
    );
};

const eliminarCurso = async(id, cursoData) => {
    console.log("@eliminarCurso");

    const { motivo, genero } = cursoData;

    return await genericDao.execute(
        `
                                    UPDATE CO_CURSO
                                    SET eliminado = true,
                                        motivo_baja = $2,
                                        fecha_modifico = (getDate('')+getHora('')),
                                        modifico = $3
                                    WHERE id = $1
                                    RETURNING ID;
                                    `, [id, motivo, genero]
    );
};

const cerrarInscripcionesCurso = async(id, cursoData) => {
    console.log("@cerrarInscripcionesCurso");

    const { motivo, genero } = cursoData;

    return await genericDao.execute(`
                                    UPDATE CO_CURSO
                                    SET inscripciones_cerradas = true,
                                        motivo_inscripciones_cerradas = $2,
                                        fecha_modifico = (getDate('')+getHora('')),
                                        modifico = $3
                                    WHERE id = $1
                                    RETURNING ID;
                                    `, [id, motivo, genero]);
};

const abrirInscripcionesCurso = async(id, cursoData) => {
    console.log("@abrirInscripcionesCurso");

    const { motivo, genero } = cursoData;

    return await genericDao.execute(`
                                    UPDATE CO_CURSO
                                    SET inscripciones_cerradas = false,
                                        motivo_inscripciones_cerradas = $2,
                                        fecha_modifico = (getDate('')+getHora('')),
                                        modifico = $3
                                    WHERE id = $1
                                    RETURNING ID;
                                    `, [id, motivo, genero]);
};


const actualizarPublicIdFoto = async(uid, publicIdFoto, url,genero) => {
    console.log("@actualizarPublicIdFoto");

    return await genericDao.execute(
        `
                                    UPDATE CO_CURSO
                                    SET 
                                        public_id_foto = $2,                                                                                
                                        foto = $3,
                                        fecha_modifico = (getDate('')+getHora('')),
                                        modifico = $4::int
                                    WHERE uid = $1
                                    RETURNING ID;
                                    `, [uid, publicIdFoto,url, genero]
    );
};

const getCursosSucursal = async(idSucursal) => {
    console.log("@getCursosSucursal");
    return await genericDao.findAll(getQueryBase(' curso.co_sucursal = $1 '), [idSucursal]);
};


const getCursosActivoSucursal = async(idSucursal) => {
    console.log("@getCursosActivoSucursal");
    return await genericDao.findAll(getQueryBase(' curso.co_sucursal = $1  '), [idSucursal]);
};

//para las inscripciones
const getCursosActivosInscripcionesAbiertas = async(idSucursal) => {
    console.log("@getcursosActivos");
    return await genericDao.findAll(getQueryBase(' curso.co_sucursal = $1 AND curso.inscripciones_cerradas = false'), [idSucursal]);
};

const getCursosInicianHoy = async() => {
    console.log("@getCursosInicianHoy");
    return await genericDao.findAll(getQueryBase(` curso.fecha_inicio_previsto::date <= getDate('') and curso.activo = false and curso.semana_actual = 0  `), []);
};

const getCursosInicianProximosDias = async(idSucursal) => {
    console.log("@getCursosInicianHoy");
    return await genericDao.findAll(
        getQueryBase(` curso.fecha_inicio_previsto::date <= (getDate('') + interval '7 days') and suc.id = $1 and curso.activo = false and curso.semana_actual = 0  `), [idSucursal]
    );
};


const getCursoByUid = async(uid) => {
    console.log("@getCursoByUid");
    return await genericDao.findOne(
        getQueryBase(` curso.uid = $1  `), [uid]);
};

const getCursoById = async(id) => {
    console.log("@getCursoById");
    return await genericDao.findOne(`select * from co_curso where id = $1 and eliminado = false`, [id]);
};

const findByUuId = async(uuid) => {
    console.log("@findByUuId");
    return await genericDao.findOne(`select * from co_curso where uid = $1 and eliminado = false`, [id]);
};


const actualizarTotalAdeudaAlumno = async(idAlumno, genero) => {
    console.log("@actualizarTotalAdeudaAlumno");

    return genericDao.execute(` UPDATE CO_ALUMNO SET 
                                  total_adeudo = (select case when sum(total) is null then 0 else sum(total) end from co_cargo_balance_alumno where co_alumno = $1 and eliminado = false),
                                  fecha_modifico = (getDate('')+getHora(''))::timestamp,
                                  modifico = $2
                            WHERE  id=$1
                              returning id`, [idAlumno, genero]);
};



const getQueryBase = (criterio) => ` select curso.id,
curso.costo_colegiatura_base,
curso.costo_inscripcion_base,
curso.nota,
to_char(curso.fecha_inicio_previsto,'yyyy-MM-dd') as fecha_inicio_previsto,
to_char(curso.fecha_inicio_previsto,'DD Mon YY') as fecha_inicio_previsto_format,        
to_char(curso.fecha_fin_previsto,'DD-MM-YYYY') as fecha_fin_previsto,
to_char(curso.fecha_fin_previsto,'DD Mon YY') as fecha_fin_previsto_format,        
curso.dias_array::int[] as dias_array, 
to_char(curso.fecha_inicio,'DD-MM-YYYY') as fecha_inicio,
to_char(curso.fecha_inicio,'DD Mon YY') as fecha_inicio_format,        
to_char(curso.fecha_fin,'DD-MM-YYYY') as fecha_fin,
to_char(curso.fecha_fin,'DD Mon YY') as fecha_fin_format,        
0 as cat_especialidad,
curso.nombre as especialidad,
to_char(curso.hora_inicio,'HH24:MI')||' - '||to_char(curso.hora_fin,'HH24:MI') as horario,
to_char(curso.hora_inicio,'HH24:MI')::text as hora_inicio,
to_char(curso.hora_fin,'HH24:MI')::text as hora_fin,
suc.id as co_sucursal,
suc.nombre as sucursal,
suc.direccion as direccion_sucursal,
curso.activo,
curso.public_id_foto,
curso.co_empresa,
curso.numero_semanas,
curso.uid,
curso.foto as foto_curso,
curso.inscripciones_cerradas,
curso.motivo_inscripciones_cerradas,
(curso.fecha_genero::date = getDate('')) as es_nuevo,
curso.fecha_inicio_previsto >= getDate('') as fecha_inicio_previsto_pasada,
(curso.fecha_inicio_previsto = getDate('')+1) as inicia_manana,
(select count(i.*) from co_inscripcion i inner join co_alumno a on a.id = i.co_alumno where i.co_curso = curso.id and i.eliminado = false and a.eliminado=false) as inscripciones
from co_curso curso inner  join co_sucursal suc on suc.id = curso.co_sucursal
where  
  ${criterio}  
  ${criterio ? ' and ':''} 
  curso.eliminado = false 	  
order by curso.hora_inicio desc`;


module.exports = {
    createCurso,
    getCursoById,
    updateCurso,
    getCursosInicianProximosDias,
    eliminarCurso,
    getCursosInicianHoy,
    getCursosActivosInscripcionesAbiertas,
    getCursosSucursal,
    getCursoByUid,
    marcarCursoComoIniciado,
    actualizarTotalAdeudaAlumno,
    getCursosActivoSucursal,
    cerrarInscripcionesCurso,
    abrirInscripcionesCurso,
    findByUuId,
    actualizarPublicIdFoto
};