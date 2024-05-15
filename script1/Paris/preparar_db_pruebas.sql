

alter table si_opcion add column orden integer not null default 0;

alter table si_opcion add column menu_principal boolean not null default false;


update si_opcion set nombre = 'Inscripciones' where id=16;

--cobranza
update si_opcion set orden = 1 where id=15;
--Inscripciones
update si_opcion set orden = 2 where id=16;
--Talleres
update si_opcion set orden = 3 where id=17;
-- gastos
update si_opcion set orden = 4 where id=20;
-- Cortes
update si_opcion set orden = 5 where id=19;

update si_opcion set menu_principal = true;

update si_opcion set menu_principal = false where id =18;

update si_opcion set si_opcion = null  where id in (15,16,17,20,19);

update si_opcion set si_opcion = 16  where id in (18);

update si_rol set nombre = 'DIRECTOR' where id = 1;
update si_rol set nombre = 'RECEPCION' where id = 2;
update si_rol set nombre = 'CORTE_DIA' where id = 3;
update si_rol set nombre = 'INSCRIPCIONES' where id = 4;


-- cus id=1
insert into si_usuario_sucursal_rol(usuario,si_rol,co_sucursal,co_empresa,genero)
values(12,(select id from si_rol where nombre='DIRECTOR'),1,1,1);

-- lic carmelo id=14
-- cus id=1

insert into si_usuario_sucursal_rol(usuario,si_rol,co_sucursal,co_empresa,genero)
values(14,(select id from si_rol where nombre='DIRECTOR'),1,1,1);


insert into si_usuario_sucursal_rol(usuario,si_rol,co_sucursal,co_empresa,genero)
values(13,(select id from si_rol where nombre='DIRECTOR'),1,1,1);

insert into si_usuario_sucursal_rol(usuario,si_rol,co_sucursal,co_empresa,genero)
values(16,(select id from si_rol where nombre='RECEPCION'),1,1,1);


insert into si_usuario_sucursal_rol(usuario,si_rol,co_sucursal,co_empresa,genero)
values(124,(select id from si_rol where nombre='INSCRIPCIONES'),1,1,1);



----

----

select * from si_rol

select * from si_opcion

insert into si_opcion (id,si_opcion,nombre,ruta,icono_menu,si_modulo,genero)
values(6,null,'Cobranza','Cobranza','fas fa-user',1,1),
	  (7,null,'Inscripciones','CatAlumno','fas fa-user',1,1),
	  (8,null,'Talleres','CatCurso','fas fa-user',1,1),
	  (9,null,'Inscripcion','Inscripcion','fas fa-user',1,1),	  
	  (10,null,'Corte','Corte','fas fa-user',1,1),
	  (11,null,'Gastos','Gastos','fas fa-user',1,1);


---- relacionar opciones con roles
insert into si_rol_opcion(si_rol,si_opcion,genero)
values((select id from si_rol where nombre='RECEPCION'),
	  (select id from si_opcion where nombre = 'Cobranza'),1);
	  
--recepcion ve Gastos
insert into si_rol_opcion(si_rol,si_opcion,genero)
values((select id from si_rol where nombre='RECEPCION'),
	  (select id from si_opcion where nombre = 'Talleres'),1);
	  
--recepcion ve Gastos
insert into si_rol_opcion(si_rol,si_opcion,genero)
values((select id from si_rol where nombre='RECEPCION'),
	  (select id from si_opcion where nombre = 'Gastos'),1);

--recepcion ve inscripciones
insert into si_rol_opcion(si_rol,si_opcion,genero)
values((select id from si_rol where nombre='RECEPCION'),
	  (select id from si_opcion where nombre = 'Corte'),1);

select * from si_usuario_sucursal_rol




----------- ROL DIRECTOR ------------------
-- DIRECTOR VE TODO
insert into si_rol_opcion(si_rol,si_opcion,genero)
values((select id from si_rol where nombre='DIRECTOR'),
	  (select id from si_opcion where nombre = 'Inscripciones'),1);
	  
-- ve Gastos
insert into si_rol_opcion(si_rol,si_opcion,genero)
values((select id from si_rol where nombre='DIRECTOR'),
	  (select id from si_opcion where nombre = 'Gastos'),1);

-- inscripciones
insert into si_rol_opcion(si_rol,si_opcion,genero)
values((select id from si_rol where nombre='DIRECTOR'),
	  (select id from si_opcion where nombre = 'Inscripcion'),1);

-- CORTE
insert into si_rol_opcion(si_rol,si_opcion,genero)
values((select id from si_rol where nombre='DIRECTOR'),
	  (select id from si_opcion where nombre = 'Corte'),1);


-- TALLERES
insert into si_rol_opcion(si_rol,si_opcion,genero)
values((select id from si_rol where nombre='DIRECTOR'),
	  (select id from si_opcion where nombre = 'Talleres'),1);

insert into si_rol_opcion(si_rol,si_opcion,genero)
values((select id from si_rol where nombre='DIRECTOR'),
	  (select id from si_opcion where nombre = 'Cobranza'),1);


update si_opcion set eliminado = true where id in (1,2,3,4,5);

update si_rol set nombre = 'COBRANZA' where id=2;


insert into si_rol_opcion(si_rol,si_opcion,genero)
values((select id from si_rol where nombre='INSCRIPCIONES'),
	  (select id from si_opcion where nombre = 'Inscripciones'),1);
	  
	  insert into si_rol_opcion(si_rol,si_opcion,genero)
values((select id from si_rol where nombre='INSCRIPCIONES'),
	  (select id from si_opcion where nombre = 'Inscripcion'),1);

update si_rol_opcion set eliminado = true where id in (20,21)

update si_opcion set si_opcion = 7 where id = 9;

select * from si_rol_opcion where si_rol = 4

