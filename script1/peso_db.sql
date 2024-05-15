
SELECT pg_size_pretty( pg_database_size('pkyxocpy'));

SELECT pg_size_pretty( pg_database_size(current_database()));


-- AGREGAR SEMANAS A UN CURSO 


select * from co_curso where uid = '0b6c0783-15d7-4118-9056-3063706d21ac'

120


select '2023-04-10'::date + interval '65 weeks'

select * from co_curso_semanas where co_curso = 120

with periodo as(     		
    select c.id as id_curso,fecha_inicio_previsto::date, '2024-07-08'::date as fecha_fin_previsto -- fecha_fin_previsto::date
        from co_curso c inner join cat_especialidad e on e.id = c.cat_especialidad                
    where c.uid = '0b6c0783-15d7-4118-9056-3063706d21ac' and c.eliminado = false      
  ), materias as(
  SELECT 
    curso_semana.id,	
    curso_semana.numero_semana_curso,	
    date_trunc('week', ((p.fecha_inicio_previsto + ((curso_semana.numero_semana_curso - 1) ||' week')::interval)))::date as fecha_inicio_semana,
    (date_trunc('week', ((p.fecha_inicio_previsto + ((curso_semana.numero_semana_curso - 1) ||' week')::interval)))::date + interval '6 days')::date as fecha_fin_semana,
    p.id_curso,
    to_char(((p.fecha_inicio_previsto + ((curso_semana.numero_semana_curso - 1) ||' week')::interval))::date,'DD-MM-YYYY') as fecha_clase_format,
    ((p.fecha_inicio_previsto + ((curso_semana.numero_semana_curso - 1) ||' week')::interval))::date as fecha_clase    
  FROM co_curso_semanas curso_semana  inner join periodo p on p.id_curso = curso_semana.co_curso
  where curso_semana.eliminado = false
  ) select m.*,
      extract(week from m.fecha_clase::date)::int as numero_semana_anio,
      extract(year from m.fecha_clase::date)::int as numero_anio 	 	
  from materias m 


select * from co_curso_semanas


do
$$
DECLARE 	
	_loop RECORD;
	id_curso integer := 120;
	--'0b6c0783-15d7-4118-9056-3063706d21ac'
BEGIN  

	FOR _loop IN ( 
 		with fechas_curso as (  
  			select c.fecha_inicio_previsto, '2024-07-08'::date as fecha_fin_previsto --c.fecha_fin_previsto 
  			from co_curso c  where c.id = id_curso   and c.eliminado = false  			 			
		), fechas as(
				select generate_series(fc.fecha_inicio_previsto::timestamp,(fc.fecha_fin_previsto-1)::timestamp,'1 week')::date as dia
				from fechas_curso fc 	
		) select ROW_NUMBER() over ( order by dia) as numero_semana_curso, 
        		f.dia as fecha_clase, 		        
        		(f.dia + interval '1 week')::date as fecha_fin_semana,        		
        		extract(week from f.dia)::int as numero_semana_anio,
        		extract(year from f.dia::date)::int as numero_anio,
        		(select count(*) 
        			from co_curso_semanas s inner join co_curso c on c.id = s.co_curso
          		where c.id = id_curso
         	      		and s.numero_semana_anio = extract(week from f.dia)
         	      		and s.fecha_clase =  f.dia 
         	      		and s.anio = extract(year from f.dia::date)         	               	      
         	 	) > 0 as existe 
			from fechas f			
		) LOOP 
				raise notice 'loop % ',_loop.numero_semana_curso;		

				IF _loop.existe THEN

						raise notice 'YA EXISTE LA SEMANA % fecha clase %',_loop.numero_semana_curso,_loop.fecha_clase ;							
					
					ELSE
					raise notice ' INSERTAR ';							
					-- dar de alta
					insert into CO_CURSO_SEMANAS (co_curso,numero_semana_curso,numero_semana_anio,fecha_inicio_semana,fecha_fin_semana,fecha_clase,anio,genero)
					values(id_curso,
							_loop.numero_semana_curso,
							_loop.numero_semana_anio,
							_loop.fecha_clase,
							_loop.fecha_fin_semana,
							_loop.fecha_clase,
							_loop.numero_anio,
							1);					
					
				END IF;
				
		END LOOP; 
END;
$$
LANGUAGE plpgsql;


