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



const getReporteListaAlumnosCobranza = (filtros = { id_sucursal }) => {
    console.log("@getReporteListaAlumnosCobranza");

    const { id_sucursal } = filtros;

    return genericDao.findAll(getQueryCobranza(), [id_sucursal]);
};


const getQueryCobranza = () => `

select   
    a.id as id_alumno,
    a.matricula,
    a.nombre as alumno,    
    a.direccion as direccion,
    a.apellidos,
    a.telefono,
    a.correo,
    a.foto as foto_alumno,
    to_char(a.fecha_nacimiento,'DD-MM-YYYY') as fecha_nacimiento_format,          
    i.costo_colegiatura,
    i.costo_inscripcion,
    i.nota as nota_inscripcion,
    a.total_adeudo,        
    (a.total_adeudo > 0) as tiene_adedudo,
    a.uid,    
    curso.uid as uid_curso,    
    esp.duracion as duracion_curso,
    curso.fecha_inicio_previsto,  
    to_char(curso.fecha_inicio_previsto,'DD-MM-YYYY') as fecha_inicio,               
    to_char(i.fecha_genero,'DD Mon YY HH24:MI AM') as fecha_inscripcion_format,          
    dia.nombre as dias,    
    esp.foto as logo_taller,
    esp.nombre as especialidad,
    esp.color as color_especialidad,     
    to_char(curso.hora_inicio,'HH24:MI')||' - '||to_char(curso.hora_fin,'HH24:MI') as horario,       
    curso.foto as foto_curso,
    curso.numero_semanas,
    asesor.nombre as inscribio,
    esquema.id as cat_esquema_pago,
    esquema.nombre as esquema_pago,        
    (select to_char(max(fecha::date),'YYYY-MM-DD') from co_pago_balance_alumno where co_alumno = a.id and eliminado = false ) as ultimo_pago 
from co_inscripcion i inner join co_curso curso on curso.id = i.co_curso
    inner join cat_especialidad esp on esp.id = curso.cat_especialidad    
    inner join cat_dia dia on dia.id = curso.cat_dia
    inner join co_alumno a on a.id = i.co_alumno
    inner join co_sucursal suc on suc.id = i.co_sucursal
    inner join usuario usuario_genero on usuario_genero.id = i.genero
    inner join cat_esquema_pago esquema on esquema.id = i.cat_esquema_pago
    left join usuario asesor on asesor.id = i.usuario_inscribe
where a.co_sucursal = $1
        and a.eliminado =false
        and i.eliminado = false
        and curso.eliminado = false  
order by a.total_adeudo desc, ultimo_pago desc           
`;


module.exports = {
    getReporteListaAlumnosCobranza
}