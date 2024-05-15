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



const getQueryAlumnosPorCurso = (eliminados) =>
    `
    select 	esp.nombre as especialidad,
            to_char(c.hora_inicio,'HH24:mm') ||' - '|| to_char(c.hora_fin,'HH24:mm') as horario,
            a.total_adeudo,
            a.matricula,
            a.nombre||' '||a.apellidos,
            a.correo,
            a.telefono,
            a.direccion,
            genero.nombre as genero,
            i.costo_colegiatura,
            i.costo_inscripcion,
            i.nota as nota_inscripcion,
            u.nombre as inscribio,		
            case when a.eliminado then 'BAJA' else '' end as baja,
            a.fecha_baja,		
            a.observaciones_baja
    from co_inscripcion i inner join co_curso c on c.id = i.co_curso
                      inner join cat_especialidad  esp on esp.id = c.cat_especialidad			      
                      inner join co_alumno a on a.id = i.co_alumno
                      inner join usuario u on i.usuario_inscribe = u.id
                      inner join cat_genero genero on genero.id = a.cat_genero
    where  c.id = $1
           ${eliminados && ' and i.eliminado = '+eliminados}
    order by a.matricula,a.eliminado`;



const getReporteListaAlumnosCurso = (filtros = {uidCurso}) => {    
    console.log("@getReporteListaAlumnosCurso");
    
    const  { uidCurso } = filtros;

    return genericDao.findAll( getQueryAlumno(" curso.uid = $1 ") ,[uidCurso]);
};


const getQueryAlumno = (criterio,order) => `
SELECT 
    row_number() over() row_index,
    a.matricula,  
    a.id as id_alumno,
    i.id as id_inscripcion,
    a.nombre as alumno,             	
    a.apellidos,
    a.nombre ||' '||a.apellidos as nombre_completo,
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
    a.telefono_tutor
FROM co_inscripcion i inner join co_alumno a on a.id = i.co_alumno
             inner join cat_genero genero on genero.id = a.cat_genero
             inner join co_sucursal s on i.co_sucursal = s.id             				
             inner join co_curso curso on curso.id = i.co_curso             					             					
             inner join cat_especialidad esp on esp.id = curso.cat_especialidad                         
    WHERE  1 = 1 
        ${criterio ? ' AND '+criterio : ''}        
        ${order ? ' ORDER BY  DESC '+order : '' }      
    
`;


module.exports = {
    getReporteListaAlumnosCurso
}