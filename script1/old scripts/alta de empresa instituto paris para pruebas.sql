
-- ====== REGISTRO PARA UNA NUEVA EMPRESA ========
-- REGISTRO EN LA TABLA EMPRESA
INSERT INTO CO_EMPRESA(NOMBRE,DIRECCION,TELEFONO,ACTIVA,GENERO)
VALUES('Instituto Paris','Av. Gomez Morín #331, San Pedro Garza Garcia NL CP:66266.','811000000',true,1)
RETURNING id;


--======= REGISTRO DE SUCURSALES =======
INSERT INTO CO_SUCURSAL(nombre,direccion,class_color,co_empresa,genero)
VALUES('Paris Suc. 3','Av. Gomez Morín #331, San Pedro Garza Garcia NL CP:66266.','#269E83',(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1)
RETURNING ID;

--======= REGISTRO DE USUARIO (que esta dando de alta la empresa) =======
--select id from co_sucursal where nombre='Solecitos Daycare'
insert into usuario(nombre,
					correo,
					password,
					co_sucursal,permiso_gerente,cat_tipo_usuario,hora_entrada,hora_salida,acceso_sistema,co_empresa,sueldo_mensual,sueldo_quincenal,genero)
values('Admin',
	   	'admin_paris@hotmail.com',
	   '$2a$08$XOjFNU1bEQ4YjNm0/jfvJO4CVbqYKy/DZV0B1QtWuwWFcnh2bmKOC',
	   (select id from co_sucursal where nombre='Paris Suc. 1'),
	   false,1,'07:00','20:00',true,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),0,0,1)
	   RETURNING ID;

--select * from usuario order by id desc
--Roles admin
--ID empresa 
insert into si_usuario_sucursal_rol(usuario,co_sucursal,si_rol,co_empresa,genero)
values(307, (select id from co_sucursal where nombre='Paris Suc. 1'),1,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1),--Rol 1 Empleado
	  --(307, (select id from co_sucursal where nombre='Paris Suc. 1'),2,2,1), -- rol 2 admin sueldos
	  (307, (select id from co_sucursal where nombre='Paris Suc. 1'),3,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1), -- rol 3 admin usuarios
	  --(307, (select id from co_sucursal where nombre='Paris Suc. 1'),4,2,1), -- rol 4 admin rh
	  (307, (select id from co_sucursal where nombre='Paris Suc. 1'),5,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1); -- rol 5 admin avisos.

--select * from usuario order by id desc
--Roles admin
--para la suc 1 
insert into si_usuario_sucursal_rol(usuario,co_sucursal,si_rol,co_empresa,genero)
values(307, (select id from co_sucursal where nombre='Paris Suc. 1'),1,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1),--Rol 1 Empleado
	  --(307, (select id from co_sucursal where nombre='Paris Suc. 1'),2,2,1), -- rol 2 admin sueldos
	  (307, (select id from co_sucursal where nombre='Paris Suc. 1'),3,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1), -- rol 3 admin usuarios
	  --(307, (select id from co_sucursal where nombre='Paris Suc. 1'),4,2,1), -- rol 4 admin rh
	  (307, (select id from co_sucursal where nombre='Paris Suc. 1'),5,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1); -- rol 5 admin avisos.

--para la suc 2
insert into si_usuario_sucursal_rol(usuario,co_sucursal,si_rol,co_empresa,genero)
values(307, (select id from co_sucursal where nombre='Paris Suc. 2'),1,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1),--Rol 1 Empleado
	  --(307, (select id from co_sucursal where nombre='Paris Suc. 1'),2,2,1), -- rol 2 admin sueldos
	  (307, (select id from co_sucursal where nombre='Paris Suc. 2'),3,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1), -- rol 3 admin usuarios
	  --(307, (select id from co_sucursal where nombre='Paris Suc. 1'),4,2,1), -- rol 4 admin rh
	  (307, (select id from co_sucursal where nombre='Paris Suc. 2'),5,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1); -- rol 5 admin avisos.
	  
--para la suc 3
insert into si_usuario_sucursal_rol(usuario,co_sucursal,si_rol,co_empresa,genero)
values(307, (select id from co_sucursal where nombre='Paris Suc. 3'),1,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1),--Rol 1 Empleado
	  --(307, (select id from co_sucursal where nombre='Paris Suc. 1'),2,2,1), -- rol 2 admin sueldos
	  (307, (select id from co_sucursal where nombre='Paris Suc. 3'),3,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1), -- rol 3 admin usuarios
	  --(307, (select id from co_sucursal where nombre='Paris Suc. 1'),4,2,1), -- rol 4 admin rh
	  (307, (select id from co_sucursal where nombre='Paris Suc. 3'),5,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1); -- rol 5 admin avisos.


-- Usuario miss de prueba 
insert into usuario(nombre,
					correo,
					password,
					co_sucursal,permiso_gerente,cat_tipo_usuario,hora_entrada,hora_salida,acceso_sistema,co_empresa,sueldo_mensual,sueldo_quincenal,genero)
values('Usuario de prueba',
	   'paris1@hotmail.com',
	   '$2a$08$XOjFNU1bEQ4YjNm0/jfvJO4CVbqYKy/DZV0B1QtWuwWFcnh2bmKOC',
	   (select id from co_sucursal where nombre='Paris Suc. 1'),
	   false,1,'07:00','20:00',true,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),0,0,1)
	   RETURNING ID;
	   
-- permisos
insert into si_usuario_sucursal_rol(usuario,co_sucursal,si_rol,co_empresa,genero)
values(308, (select id from co_sucursal where nombre='Paris Suc. 1'),1,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1),--Rol 1 Empleado
	  --(307, (select id from co_sucursal where nombre='Paris Suc. 1'),2,2,1), -- rol 2 admin sueldos
	  (308, (select id from co_sucursal where nombre='Paris Suc. 1'),3,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1), -- rol 3 admin usuarios
	  --(307, (select id from co_sucursal where nombre='Paris Suc. 1'),4,2,1), -- rol 4 admin rh
	  (308, (select id from co_sucursal where nombre='Paris Suc. 1'),5,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1); -- rol 5 admin avisos.

	   
-- permisos
insert into si_usuario_sucursal_rol(usuario,co_sucursal,si_rol,co_empresa,genero)
values(308, (select id from co_sucursal where nombre='Paris Suc. 2'),1,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1),--Rol 1 Empleado
	  --(307, (select id from co_sucursal where nombre='Paris Suc. 1'),2,2,1), -- rol 2 admin sueldos
	  (308, (select id from co_sucursal where nombre='Paris Suc. 2'),3,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1), -- rol 3 admin usuarios
	  --(307, (select id from co_sucursal where nombre='Paris Suc. 1'),4,2,1), -- rol 4 admin rh
	  (308, (select id from co_sucursal where nombre='Paris Suc. 2'),5,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1); -- rol 5 admin avisos.

	   
-- permisos
insert into si_usuario_sucursal_rol(usuario,co_sucursal,si_rol,co_empresa,genero)
values(308, (select id from co_sucursal where nombre='Paris Suc. 3'),1,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1),--Rol 1 Empleado
	  --(307, (select id from co_sucursal where nombre='Paris Suc. 1'),2,2,1), -- rol 2 admin sueldos
	  (308, (select id from co_sucursal where nombre='Paris Suc. 3'),3,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1), -- rol 3 admin usuarios
	  --(307, (select id from co_sucursal where nombre='Paris Suc. 1'),4,2,1), -- rol 4 admin rh
	  (308, (select id from co_sucursal where nombre='Paris Suc. 3'),5,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),1); -- rol 5 admin avisos.




-- LOGO
update co_empresa set logotipo='https://as1.ftcdn.net/v2/jpg/02/38/52/00/1000_F_238520076_aOorjpZxhfE7PNmbYxv9pHR4U02GQwbq.jpg' 
where id = (SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris') ;

update co_sucursal set foto = 'https://as1.ftcdn.net/v2/jpg/02/38/52/00/1000_F_238520076_aOorjpZxhfE7PNmbYxv9pHR4U02GQwbq.jpg' 
where co_empresa = (SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris');

--- GRUPOS


--- costo de cargo extra y horas extras
--- cobran a 50 pesos la hora extra
insert into cat_cargo(nombre,descripcion,precio,notificar,co_empresa,identificador,genero)
values('Hora Extra','',50,true,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),'TIEX',1);

-- cobran a 100 pesos el cargo extra por no pagar a tiempo
insert into cat_cargo(nombre,descripcion,precio,notificar,co_empresa,identificador,genero)
values('Extra mensualidad ','',100,true,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Instituto Paris'),'CAEX',1);



-- logo para empresa default
update co_empresa set logotipo = 'https://res.cloudinary.com/civico/image/upload/c_fit,f_auto,fl_lossy,h_1200,q_auto:low,w_1200/v1481128279/entity/image/file/428/000/584839572f41f3e634000428.jpg' where id =3;

update co_sucursal set foto = 'https://res.cloudinary.com/civico/image/upload/c_fit,f_auto,fl_lossy,h_1200,q_auto:low,w_1200/v1481128279/entity/image/file/428/000/584839572f41f3e634000428.jpg' where co_empresa = 3


--- other

create table cat_escolaridad(
	id serial not null primary key,
	nombre text not null,
	genero integer not null references usuario(id),
	fecha_genero timestamp default current_timestamp,
	modifico integer references usuario(id),
	fecha_modifico timestamp,
	eliminado boolean default false	
);




alter table co_alumno add column originario text;
alter table co_alumno add column cat_escolaridad integer REFERENCES cat_escolaridad(id);
alter table co_alumno add column ocupacion text;
alter table co_alumno add column cat_horario integer REFERENCES cat_horario(id);



insert into cat_escolaridad(nombre,genero)
values('Ninguna',1),('Licenciatura',1),('Preparatoria',1),('Secundaria',1);
