
with suma_mensual as(	
	select to_char(fecha::date,'MM-YYYY') as suma_total_mes,
		sum(cargo) as suma_mensual
	from co_cargo_balance_alumno 
	where eliminado = false
	group by to_char(fecha::date,'MM-YYYY')
) select to_char(cb.fecha::date,'MM-YYYY') as mes,
       cargo.nombre as cargo,
	   sum(cb.cargo) as suma_cargo,
	   sum(cb.cantidad) as cantidad_cargo,
	   --sum(total_pagado) as suma_total_pagado,
	   sm.suma_total_mes,
	   sm.suma_mensual,	   
	--   (sum(cb.cargo) * 100) / sm.suma_mensual as porc,
	   ROUND((sum(cb.cargo) * 100) / sm.suma_mensual,2) as porc
	from co_cargo_balance_alumno cb inner join cat_cargo cargo on cargo.id = cb.cat_cargo
								inner join suma_mensual sm on sm.suma_total_mes = to_char(cb.fecha::date,'MM-YYYY')
	where cb.eliminado = false
	group by to_char(cb.fecha::date,'MM-YYYY'),to_char(cb.fecha::date,'yyyy'),to_char(cb.fecha::date,'MM'),cb.cantidad,cargo.nombre,sm.suma_total_mes,sm.suma_mensual
	order by to_char(cb.fecha::date,'yyyy') desc,to_char(cb.fecha::date,'MM'), cargo.nombre





with suma_anual as(
	select to_char(fecha::date,'YYYY') as anio,
		sum(cargo) as suma_anual
	from co_cargo_balance_alumno 
	where eliminado = false
	group by to_char(fecha::date,'YYYY')
),
suma_mensual as(	
	select to_char(fecha::date,'MM-YYYY') as mes,
		sum(cargo) as suma_mensual
	from co_cargo_balance_alumno 
	where eliminado = false
	group by to_char(fecha::date,'MM-YYYY')
) 
select to_char(cb.fecha::date,'MM-YYYY') as anio_mes,
       cargo.nombre as cargo,
	   sum(cb.cargo) as suma_cargo,
	   sum(cb.cantidad) as cantidad_cargo,
	   --sum(total_pagado) as suma_total_pagado,
	   sm.mes,
	   sm.suma_mensual,	   
	--   (sum(cb.cargo) * 100) / sm.suma_mensual as porc,
	   ROUND((sum(cb.cargo) * 100) / sm.suma_mensual,2) as porc_cargo_mes,
	   sa.anio,
	   sa.suma_anual,
	   ROUND((sm.suma_mensual * 100) / sa.suma_anual,2) as porc_suma_mes_en_anio
	from co_cargo_balance_alumno cb inner join cat_cargo cargo on cargo.id = cb.cat_cargo
								    inner join suma_mensual sm on sm.mes = to_char(cb.fecha::date,'MM-YYYY')
									inner join suma_anual sa on sa.anio = to_char(cb.fecha::date,'YYYY')
	where cb.eliminado = false
			and cargo.id = 4--3
	group by to_char(cb.fecha::date,'MM-YYYY'),
			to_char(cb.fecha::date,'yyyy'),
			to_char(cb.fecha::date,'MM'),
			cb.cantidad,
			cargo.nombre,
			sm.mes,
			sm.suma_mensual,
			sa.anio,
			sa.suma_anual
	order by to_char(cb.fecha::date,'yyyy') desc,to_char(cb.fecha::date,'MM'), cargo.nombre



   select to_char(fecha::date,'YYYY') as suma_total_mes,
   		  	sum(cantidad) FILTER (WHERE cat_cargo = 1)  as cantidad_mensualidades,
   		  	sum(cargo) FILTER (WHERE cat_cargo = 1)  as suma_mensualidades,
		
		 	sum(cantidad) FILTER (WHERE cat_cargo = 2)  as cantidad_inscripciones,
		  	sum(cargo) FILTER (WHERE cat_cargo = 2)  as suma_inscripciones,
		  
			sum(cantidad) FILTER (WHERE cat_cargo = 3)  as cantidad_tiempo_extra,
		    sum(cargo) FILTER (WHERE cat_cargo = 3)  as suma_tiempo_extra,
		
		  	sum(cantidad) FILTER (WHERE cat_cargo = 4)  as suma_cargo_extra,
			sum(cargo) FILTER (WHERE cat_cargo = 4)  as suma_cargo_extra
	from co_cargo_balance_alumno 		
	where eliminado = false
	group by to_char(fecha::date,'YYYY')
