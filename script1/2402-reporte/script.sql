

--agregar opcion 

select max(id) from si_opcion-- where si_opcion is not null


insert into si_opcion(id,si_modulo,si_opcion,nombre, ruta, icono_menu,orden, menu_principal,genero)
values(16,1,null,'Reportes','Reportes','fa fa-list',8, true, 1);



select * from si_rol_opcion 

insert into si_rol_opcion(si_rol,si_opcion,genero)
values(8,16,1)


drop table si_reporte

create table si_reporte (
	id serial not null, 
	nombre text not null, 	
	columnas text not null,
	consulta  text not null, 	
	rango_fecha  boolean not null default false,
	criterio_busqueda boolean not null default false,	
	genero integer not null references usuario(id),
	fecha_genero timestamp not null default current_timestamp,
	modifico integer references usuario(id),
	fecha_modifico timestamp,
	eliminado boolean not null default false
)



select * from si_reporte where eliminado = false

SELECT id,nombre,columnas FROM SI_REPORTE WHERE ELIMINADO = FALSE

delete from si_reporte


insert into si_reporte(nombre, columnas, consulta,rango_fecha, genero)
values('Alumnos inscritos',
     '[
   {
      "label":"Matricula",
      "field":"matricula",
      "filterable":true,
      "thClass":"text-center",
      "tdClass":"text-center"
   },
   {
      "label":"Nombre",
      "field":"nombre_completo",
      "filterable":true,
      "thClass":"text-left",
      "tdClass":"text-left"
   },
   {
      "label":"Correo",
      "field":"correo"
   },
   {
      "label":"Teléfono",
      "field":"telefono"
   },
   {
      "label":"Total Aduedo",
      "field":"total_adeudo"
   },
   {
      "label":"Colegiatura",
      "field":"costo_colegiatura"
   },
   {
      "label":"Inscripción",
      "field":"costo_inscripcion"
   },
   {
      "label":"Especialidad",
      "field":"especialidad",
      "filterable":true
   },
   {
      "label":"Dias",
      "field":"dia",
      "filterable":true
   },
   {
      "label":"Nota",
      "field":"nota_inscripcion"
   },
   {
      "label":"Esquema",
      "field":"esquema"
   },
   {
      "label":"Inscribio",
      "field":"inscribio"
   },
   {
      "label":"Fecha Nac.",
      "field":"fecha_nacimiento"
   },
   {
      "label":"Registro",
      "field":"genero"
   },
   {
      "label":"Dirección",
      "field":"direccion"
   },
   {
      "label":"Fecha Registro",
      "field":"fecha_registro"
   }
]','
      select 	  
	  a.matricula,
	  a.nombre||'' ''||a.apellidos as nombre_completo,
	  a.correo,
	  a.telefono,
	  a.total_adeudo, 
	  i.costo_colegiatura, 
	  i.costo_inscripcion, 	  
	  esp.nombre as especialida,
	  dia.nombre||'' ''|| to_char(c.hora_inicio,''HH24:MI'')||'' - ''||to_char(c.hora_fin,''HH24:MI'')  as dia,
	  i.nota as nota_inscripcion,
	  esquema.nombre as esquema,	  
	  promotor.nombre as inscribio,	  
	  to_char(a.fecha_nacimiento,''dd-mm-yyyy'') as fecha_nacimiento,
	  genero.nombre as genero,
	  a.direccion,
	  to_char(a.fecha_genero,''dd-mm-yyyy HH24:MI'') as fecha_registro
from co_inscripcion i inner join co_alumno a on a.id = i.co_alumno
				  inner join co_curso c on c.id = i.co_curso
				  inner join cat_especialidad esp on esp.id = c.cat_especialidad
				  inner join cat_dia dia on dia.id = c.cat_dia
				  inner join usuario promotor on promotor.id = i.usuario_inscribe
				  inner join cat_esquema_pago esquema on esquema.id = i.cat_esquema_pago
				  inner join cat_genero genero on genero.id = a.cat_genero
where a.eliminado = false
	 and a.co_sucursal = $1
	 and a.fecha_genero between $2 and  $3	 
order by a.matricula	
      ',true,1)

SELECT id,nombre,consulta,columnas,rango_fecha,criterio_busqueda FROM SI_REPORTE WHERE ID = 4 AND ELIMINADO = FALSE 

select * from co_inscripcion

select 	  
	  a.matricula,
	  a.nombre||' '||a.apellidos as nombre_completo,
	  a.correo,
	  a.telefono,
	  a.total_adeudo, 
	  i.costo_colegiatura, 
	  i.costo_inscripcion, 	  
	  esp.nombre as especialida,
	  dia.nombre||' '|| to_char(c.hora_inicio,'HH24:MI')||' - '||to_char(c.hora_fin,'HH24:MI')  as dia,
	  i.nota as nota_inscripcion,
	  esquema.nombre as esquema,	  
	  promotor.nombre as inscribio,	  
	  to_char(a.fecha_nacimiento,'dd-mm-yyyy') as fecha_nacimiento,
	  genero.nombre as genero,
	  a.direccion,
	  to_char(a.fecha_genero,'dd-mm-yyyy HH24:MI') as fecha_registro
from co_inscripcion i inner join co_alumno a on a.id = i.co_alumno
				  inner join co_curso c on c.id = i.co_curso
				  inner join cat_especialidad esp on esp.id = c.cat_especialidad
				  inner join cat_dia dia on dia.id = c.cat_dia
				  inner join usuario promotor on promotor.id = i.usuario_inscribe
				  inner join cat_esquema_pago esquema on esquema.id = i.cat_esquema_pago
				  inner join cat_genero genero on genero.id = a.cat_genero
where a.eliminado = false
	 a.fecha_genero between ? and  ?
order by a.matricula		
				  



