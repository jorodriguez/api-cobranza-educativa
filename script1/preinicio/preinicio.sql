

insert into cat_tipo_gasto(nombre,co_empresa,genero)
values('Nóminas',1,1),
	('Depósito',1,1);

	update co_forma_pago set eliminado = false where id = 2


select * from co_consecutivo

update co_consecutivo set prefijo = 'P' where id = 4


alter table co_curso drop column cat_horario


alter table co_curso add column hora_inicio time not null;

alter table co_curso add column hora_fin time not null;



alter table co_curso add column cat_dia integer not null references cat_dia(id);


		alter table co_curso add column numero_semanas integer;

		update co_curso set numero_semanas =0;

		alter table co_curso alter column numero_semanas set not null;


alter table co_curso_semanas drop column co_materia_modulo_especialidad;
alter table co_curso_semanas drop column co_modulo_especialidad;
