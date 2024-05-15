
-- ====== REGISTRO PARA UNA NUEVA EMPRESA ========
-- REGISTRO EN LA TABLA EMPRESA
INSERT INTO CO_EMPRESA(NOMBRE,DIRECCION,TELEFONO,ACTIVA,GENERO)
VALUES('Solecitos Daycare','José Maria Coss #313, Monterrey NL CP:66266.','811000000',true,1);


--======= REGISTRO DE SUCURSALES =======
INSERT INTO CO_SUCURSAL(nombre,direccion,class_color,co_empresa,genero)
VALUES('Solecitos Daycare','José Maria Coss #313, Monterrey NL CP:66266','#269E83',2,1);

--======= REGISTRO DE USUARIO (que esta dando de alta la empresa) =======
--select id from co_sucursal where nombre='Solecitos Daycare'
insert into usuario(nombre,
					correo,
					password,
					co_sucursal,permiso_gerente,cat_tipo_usuario,hora_entrada,hora_salida,acceso_sistema,co_empresa,sueldo_mensual,sueldo_quincenal,genero)
values('Admin',
	   	'admin@hotmail.com',
	   '$2a$08$XOjFNU1bEQ4YjNm0/jfvJO4CVbqYKy/DZV0B1QtWuwWFcnh2bmKOC',
	   (select id from co_sucursal where nombre='Solecitos Daycare'),
	   false,1,'07:00','20:00',true,2,0,0,1)
	   RETURNING ID;

--select * from usuario order by id desc
--Roles admin
--ID empresa 
insert into si_usuario_sucursal_rol(usuario,co_sucursal,si_rol,co_empresa,genero)
values(306, (select id from co_sucursal where nombre='Solecitos Daycare'),1,2,1),--Rol 1 Empleado
	  (306, (select id from co_sucursal where nombre='Solecitos Daycare'),2,2,1), -- rol 2 admin sueldos
	  (306, (select id from co_sucursal where nombre='Solecitos Daycare'),3,2,1), -- rol 3 admin usuarios
	  (306, (select id from co_sucursal where nombre='Solecitos Daycare'),4,2,1), -- rol 4 admin rh
	  (306, (select id from co_sucursal where nombre='Solecitos Daycare'),5,2,1); -- rol 5 admin avisos.

-- LOGO
update co_empresa set logotipo='https://image.flaticon.com/icons/png/128/1247/1247431.png' 
where id = (SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Solecitos Daycare') ;

update co_sucursal set foto = 'https://image.flaticon.com/icons/png/128/1247/1247431.png' 
where co_empresa = (SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Solecitos Daycare');

--- GRUPOS
insert into co_grupo(nombre,color,co_empresa,genero)
values('Kinder 1','#CC10C1',2,1);


--- costo de cargo extra y horas extras
--- cobran a 50 pesos la hora extra
insert into cat_cargo(nombre,descripcion,precio,notificar,co_empresa,identificador,genero)
values('Hora Extra','',50,true,2,'TIEX',1);

-- cobran a 100 pesos el cargo extra por no pagar a tiempo
insert into cat_cargo(nombre,descripcion,precio,notificar,co_empresa,identificador,genero)
values('Extra mensualidad ','',100,true,2,'CAEX',1);



--//////////////////////////////
-- REGISTRO DE CARGOS 
/*insert into cat_cargo(nombre, descripcion,precio, 
					notificar,
					es_facturable,escribir_cantidad,escribir_monto,
					seleccionar_fecha,aplica_descuento,
					co_empresa,genero )
values('Cuota de Materiales','Cuota anual de materiales',4000,	   			
	   				true,
	   				false,false,false,
	   				false,false,
	   				2,1);

--*-conf magic
 update configuracion set co_empresa=2, remitente_from = 'Magic Intelligence<joel@magicintelligence.com>'
 where id = 2;


-- empresa defecto
update co_empresa set logotipo='https://image.flaticon.com/icons/png/128/1247/1247431.png' where id = 2;
*/
