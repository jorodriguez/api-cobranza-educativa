const {
    getQueryInstance
} = require('../controllers/sqlHelper');
const {
    Exception,
    ExceptionBD
} = require('../exception/exeption');
const {
    isEmptyOrNull
} = require('../utils/Utils');
const genericDao = require('./genericDao');

const QUERY_CORREOS_TOKEN_FAMILIARES_ALUMNO =
    `SELECT  	a.id,
                a.nombre as nombre_alumno,		
                a.co_sucursal, 
                a.co_empresa,
                string_agg(split_part(fam.nombre,' ',1),' / ') AS nombres_padres,    
                array_to_json(array_agg(to_json(fam.correo))) AS correos, 
                array_to_json(array_agg(to_json(fam.token))) as tokens
     FROM co_alumno_familiar rel inner join co_familiar fam on rel.co_familiar = fam.id
                            inner join co_parentesco parentesco on parentesco.id = rel.co_parentesco
                            inner join co_alumno a on a.id = rel.co_alumno
    WHERE co_alumno = ANY($1::int[]) --and envio_recibos
            and co_parentesco in (1,2) -- solos papa y mama
            and fam.eliminado = false 
            and rel.eliminado = false
    group by a.nombre,a.id `;

const getCorreosTokensAlumno = (idAlumno) => {
    console.log("@getCorreosTokensAlumno");
    return genericDao.findOne(QUERY_CORREOS_TOKEN_FAMILIARES_ALUMNO, [
        [idAlumno]
    ]);
};


const guardarAlumno = async (alumnoData) => {
    console.log("@guardarAlumno " + JSON.stringify(alumnoData));
    const { co_sucursal, cat_genero, nombre, apellidos, direccion, telefono,correo, fecha_nacimiento, nota, foto, co_empresa, genero } = alumnoData;

    return await genericDao.execute(`        
            INSERT INTO CO_ALUMNO(matricula,co_sucursal,cat_genero,nombre,apellidos,direccion,telefono,correo,fecha_nacimiento,nota,foto,co_empresa,genero)
            VALUES((select (prefijo||''||anio||'-'||valor::text) from obtener_consecutivo('MATRICULA',$1)),$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING ID;
    `, [co_sucursal, cat_genero, nombre, apellidos, direccion, telefono, correo,fecha_nacimiento, nota, foto, co_empresa, genero]);

}

const modificarAlumno = async (id, alumnoData) => {
    console.log("@modificarAlumno " + JSON.stringify(alumnoData));
    const { cat_genero, nombre, apellidos, direccion, telefono, correo,fecha_nacimiento, nota, foto, cat_escolaridad, ocupacion, originario, tutor, telefono_tutor, genero } = alumnoData;


    return await genericDao.execute(`
            UPDATE CO_ALUMNO
                    SET CAT_GENERO = $2,
                        NOMBRE = $3,
                        APELLIDOS = $4,
                        DIRECCION = $5,
                        TELEFONO = $6,
                        FECHA_NACIMIENTO = $7,        
                        NOTA=$8,
                        FOTO = $9,
                        cat_escolaridad=$10,
                        ocupacion=$11,
                        originario=$12,
                        tutor=$13,
                        telefono_tutor=$14,
                        correo=$15,
                        MODIFICO = $16,
                        FECHA_MODIFICO=(getDate('')+getHora(''))
            WHERE ID = $1
            RETURNING ID;
    `, [id, cat_genero, nombre, apellidos, direccion, telefono, fecha_nacimiento, nota, foto, cat_escolaridad, ocupacion, originario, tutor, telefono_tutor, correo,genero]);

}


const modificarCorreoAlumno = async (uid, alumnoData) => {
    console.log("@modificarCorreoAlumno " + JSON.stringify(alumnoData));
    const {  correo, genero } = alumnoData;

    return await genericDao.execute(`
            UPDATE CO_ALUMNO
                    SET correo=$2,
                        MODIFICO = $3,
                        FECHA_MODIFICO=(getDate('')+getHora(''))
            WHERE uid = $1
            RETURNING ID;
    `, [uid,correo,genero]);

}

const modificarFotoPerfil = async (idAlumno, metadaFoto, genero) => {
    console.log("@modificarFotoPerfil");

    console.log("idAlumno " + idAlumno);
    console.log("url " + metadaFoto.secure_url);
    console.log("public_id " + metadaFoto.public_id);
    console.log("genero " + genero);

    let foto = "";
    let public_id_foto = null;
    if (!metadaFoto) {
        foto = await genericDao.execute(`select foto from cat_genero where id = (select cat_genero from co_alumno where id = $1))`), [idAlumno];
    } else {
        foto = metadaFoto.secure_url;
        public_id_foto = metadaFoto.public_id;
    }

    return await genericDao.execute(` 
                            UPDATE co_alumno 
                             SET 
                                foto = $2,                                       
                                public_id_foto = $3,
                                fecha_modifico = (getDate('')+getHora(''))::timestamp,
                                modifico = $4
                             WHERE id = $1 RETURNING id;`, [idAlumno, foto, public_id_foto, genero]);
};

const getAlumnoPorUId = (uidAlumno) => {
    console.log("@getAlumnoPorUId "+uidAlumno);
    return genericDao.findOne(`select  to_char(fecha_nacimiento,'mm-dd')=to_char(getDate(''),'mm-dd') as is_cumpleanos,* from co_alumno where uid = $1 and eliminado = false;`, [uidAlumno]);
};

const getAlumnoPorId = (idAlumno) => {
    console.log("@getAlumnoPorId "+idAlumno);
    return genericDao.findOne(`select  to_char(fecha_nacimiento,'mm-dd')=to_char(getDate(''),'mm-dd') as is_cumpleanos,* from co_alumno where id = $1 and eliminado = false;`, [idAlumno]);
};

const getAlumnoPorIdInfoEmpresaSucursal = (idAlumno) => {
    console.log("@getAlumnoPorId "+idAlumno);
    return genericDao.findOne(`
            select  
                    em.nombre as nombre_empresa,
                    em.nombre_folder as nombre_folder_empresa,
                    suc.nombre as nombre_sucursal,
                    suc.nombre_folder as nombre_folder_sucursal,
                    a.* 	
            from co_alumno a inner join co_empresa em on em.id = a.co_empresa
                     inner join co_sucursal suc on suc.id = a.co_sucursal
            where a.id = $1 and a.eliminado = false;`, [idAlumno]);
};

const activarAlumnoEliminado = (idAlumno, genero) => {
    console.log("@activarAlumnoEliminado");

    return genericDao.execute(` 
                            UPDATE co_alumno 
                             SET                                                     
                                fecha_modifico = (current_date+current_time),
                                fecha_reactivacion = (current_date+current_time),
                                eliminado = false,
                                modifico = $2
                             WHERE id = $1 RETURNING id;`, [idAlumno, genero]);
};


const bajaAlumno = (idAlumno, fechaBaja, observaciones, genero) => {

    return genericDao.execute(` 
                            UPDATE co_alumno 
                             SET 
                                fecha_baja =$2::date,                                                                
                                observaciones_baja=$3,
                                fecha_modifico = (current_date+current_time),                                
                                modifico = $4,
                                dio_baja = $4,
                                eliminado = true
                             WHERE id = $1 RETURNING id;`, [idAlumno, new Date(fechaBaja), observaciones, genero]);
}


const getAlumnos = (idSucursal) => {
    console.log("Consultando alumnos de la suc " + idSucursal);
    return genericDao.findAll(getQueryAlumno(" a.co_sucursal = $1 AND a.eliminado = false "), [idSucursal]);
}

const getAlumnosEliminados = (idSucursal) => {
    console.log("Consultando alumnos eliminados de la suc " + idSucursal);
    return genericDao.findAll(getQueryAlumno(" a.co_sucursal = $1 AND a.eliminado = true "), [idSucursal]);
}


const getAlumnosCurso = (uidCurso) => {
    console.log("Consultando alumnos del curso " + uidCurso);
    return genericDao.findAll(getQueryAlumno(" curso.uid = $1 AND a.eliminado = false "), [uidCurso]);
}

const getQueryAlumno = (criterio) => `
SELECT 
    a.matricula,  
    a.id as id_alumno,
    i.id as id_inscripcion,
    a.nombre as alumno,             	
    a.apellidos,
    a.nota,
    a.foto,
    a.telefono,  
    i.confirmado,
    to_char(i.fecha_confirmado,'DD-MM-YYYY') as fecha_confirmado,    
    (select nombre from usuario where id = i.usuario_confirmo) as usuario_confirmo,
    s.nombre as nombre_sucursal,
    esp.id as id_especialidad,             	     
    esp.nombre as especialidad,             	     
    esp.color,             	     
    (select string_agg(nombre,'-') from cat_dia where id = ANY(curso.dias_array::int[])) as dias, 
    curso.uid as uid_curso,
    to_char(curso.fecha_inicio_previsto,'DD-MM-YYYY') as fecha_inicio_previsto,    
    to_char(curso.fecha_inicio_previsto,'DD Mon YY') as fecha_inicio_previsto_format,
    to_char(curso.fecha_fin_previsto,'DD-MM-YYYY') as fecha_inicio_previsto,    
    to_char(curso.fecha_fin_previsto,'DD Mon YY') as fecha_inicio_previsto_format,    
    curso.foto as foto_curso,
    genero.foto as foto_perfil,
    to_char(curso.hora_inicio,'HH24:MI')||' - '||to_char(curso.hora_fin,'HH24:MI') as horario,
    a.ocupacion,
    a.originario,
    a.uid,
    a.cat_escolaridad,
    (select nombre from cat_escolaridad where id = a.cat_escolaridad) as escolaridad,
    a.tutor,    
    a.telefono_tutor,
    to_char(a.fecha_baja,'DD-MM-YYYY HH24:MI') as fecha_baja,    
    a.observaciones_baja,
    dio_baja.nombre as dio_baja
FROM co_inscripcion i inner join co_alumno a on a.id = i.co_alumno
             inner join cat_genero genero on genero.id = a.cat_genero
             inner join co_sucursal s on i.co_sucursal = s.id             				
             inner join co_curso curso on curso.id = i.co_curso             					             					
             inner join cat_especialidad esp on esp.id = curso.cat_especialidad                         
            inner join usuario dio_baja on dio_baja.id = a.dio_baja
    WHERE 1 = 1
          ${criterio ? ' AND '+criterio : ''}        
    ORDER BY i.fecha_genero DESC
`;


module.exports = {
    guardarAlumno,    
    getAlumnos,
    getAlumnosEliminados,
    getAlumnosCurso,        
    getCorreosTokensAlumno,
    modificarFotoPerfil,
    getAlumnoPorUId,
    getAlumnoPorId,
    bajaAlumno,
    activarAlumnoEliminado,
    modificarAlumno,
    getAlumnoPorIdInfoEmpresaSucursal,
    modificarCorreoAlumno
}