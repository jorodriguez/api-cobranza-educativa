
-- query para obtener la lista de fechas por Mes
-- params : fecha de inicio,numero de intervalo, intervalo (month, week)
-- se le resta 1 al intervalo
/*
WITH fechas as (
	select generate_series('2022-01-05',('2022-01-05'::date + interval '3 month')::timestamp,'1 month')::date as fecha	
) select ROW_NUMBER() over ( order by fecha) as numero, 
        f.fecha as fecha, 		        
        (f.fecha + interval '1 month')::date as fecha_fin_semana,
         extract(month from f.fecha)::int as numero_semana_anio,
        extract(week from f.fecha)::int as numero_semana_anio,
        extract(year from f.fecha)::int as numero_anio 	 	
from fechas f
*/



--alter table co_curso_semanas add column es_dia_pago boolean not null default false ;


CREATE TABLE cat_esquema_pago
(
	id serial NOT NULL primary key,		
	nombre text not null,	
	fecha_genero timestamp  DEFAULT (getDate('')+getHora('')),
	fecha_modifico timestamp,
	genero integer NOT NULL references usuario(id),
	modifico integer references usuario(id),
	eliminado boolean NOT NULL DEFAULT false    
);

insert into cat_esquema_pago(id,nombre, genero) values(1,'Semanal',1),(2,'Mensual',1);

alter table co_curso add column cat_esquema_pago integer not null default 1 references cat_esquema_pago(id);

alter table co_curso_semanas add column generar_colegiatura boolean not null default true;
	

/*with fechas as (    
  select generate_series('2022-01-05',(('2022-01-05'::date)  + interval '12 week')::timestamp,'1 week')::date as dia
) select ROW_NUMBER() over ( order by dia) as numero_semana_curso, 	   
	   to_char(f.dia,'mm-yyyy') as mes,		    
        f.dia as fecha_clase, 		        
        (f.dia + interval '1 week')::date as fecha_fin_semana,
        extract(week from f.dia)::int as numero_semana_anio,
        extract(year from f.dia::date)::int as numero_anio,
        lag(to_char(f.dia,'mm-yyyy')) over mes_window is null as generar_cargo_mensual
from fechas f
WINDOW mes_window as (partition by to_char(f.dia,'mm-yyyy') order by f.dia)
*/