const genericDao = require('./genericDao');
const { encriptar } = require('../utils/Utils');

const generarRandomPassword = () => {

    return new Promise((resolve, reject) => {
        const respuesta = { password: "", encripted: "" };

        genericDao
            .findOne(
                `SELECT pass||(random() * 5000 + 1)::int AS password FROM random_pass  ORDER BY random() LIMIT 1;`,
                []
            ).then(result => {
                respuesta.password = result.password;
                respuesta.encripted = encriptar(result.password);
                resolve(respuesta);
            }).catch(e => {
                console.error("Error al generar el password " + e);
                reject(null);
            });
    });
};


const getFechaHoy = async () => {
    //return await genericDao.findOne("select getDate('') as fecha_actual, to_char(getDate(''),'YYYY-MM-DD') as fecha_actual_format,to_char(getDate(''),'DD Mon YYYY') as fecha_actual_asunto, getHora('') as hora_actual,to_char(getHora(''),'HH24:MI') as hora_actual_format",[]);
    return await genericDao.findOne(`
            select  date_trunc('week', getDate(''))::date as fecha_inicio_semana,
                    (date_trunc('week', getDate(''))::date + interval '6 days')::date as fecha_fin_semana,
                    to_char(date_trunc('week', getDate(''))::date,'YYYY-MM-DD') as fecha_inicio_semana_format,
                    to_char( (date_trunc('week', getDate(''))::date + interval '6 days')::date,'YYYY-MM-DD') as fecha_fin_semana_format,
                    to_char(date_trunc('week', getDate(''))::date,'day dd MONTH YYYY') as fecha_inicio_semana_format_name,
                    to_char( (date_trunc('week', getDate(''))::date + interval '6 days')::date,'day dd MONTH YYYY') as fecha_fin_semana_format_name,
                    getDate('') as fecha_actual,
                    to_char(getDate(''),'YYYY-MM-DD') as fecha_actual_format,
                    to_char(getDate(''),'DD Mon YYYY') as fecha_actual_asunto,
                    getHora('') as hora_actual,
                    to_char(getHora(''),'HH24:MI') as hora_actual_format,
                    (
                        SELECT array_to_json(array_agg(to_json(to_char(s,'YYYY-MM-DD'))))
                            FROM generate_series(date_trunc('week', getDate(''))::date,(date_trunc('week', getDate(''))::date + interval '6 days')::date, '1 day') s 
                    ) as fechas_semana_ocurriendo
            `,[]);
};





module.exports = { generarRandomPassword,getFechaHoy };