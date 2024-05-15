

select * from usuario;

--alta de usuario
insert into usuario(nombre, correo, password,cat_tipo_usuario,hora_entrada,hora_salida,activo,acceso_sistema,sueldo_mensual,sueldo_quincenal,alias,co_sucursal,co_empresa,genero)
values('Admin','admin@gmail.com','$2a$08$X9Wi1WD7PKvzKwJBpKhyRO1uevvmQq7TxCgqY2hQn2V9mGv124sZm',1,'00:00','00:00',true,true,0,0,'Admin',1,1,1);




---alta de roles

