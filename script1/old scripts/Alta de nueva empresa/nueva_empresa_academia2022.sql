
/*
		SCRIPT PARA ALTA DE UNA NUEVA EMPRESA
*/

--alta empresa de prueba -- Academia Roma
insert into co_empresa(nombre,direccion,telefono,nombre_representante,logotipo,rfc,configuracion,nombre_folder,genero)
values('Academía de Belleza Roma','Calle juan n aldama ','81124545','Prueba','https://img.freepik.com/foto-gratis/mujer-hermosa-joven-flores-junto-cara_186202-5624.jpg','AODJ780723ERS',1,'roma_prueba',1);


--======= REGISTRO DE SUCURSALES =======
INSERT INTO CO_SUCURSAL(nombre,direccion,class_color,co_empresa,nombre_folder,genero)
VALUES('Roma Mty','Av. Gomez Morín San Pedro Garza Garcia NL CP:66266.','#9D03B5',2,'roma_mty',1)
RETURNING ID;


-----------------------------------------------------------
------------ USUARIO ADMIN -ACCESO A TODO -----------------------
-----------------------------------------------------------
insert into usuario(nombre,
					correo,
					password,
					co_sucursal,permiso_gerente,cat_tipo_usuario,hora_entrada,hora_salida,acceso_sistema,co_empresa,sueldo_mensual,sueldo_quincenal,genero)
values('Admin Roma',
	   'admin_roma@gmail.com',
	   '$2a$08$XOjFNU1bEQ4YjNm0/jfvJO4CVbqYKy/DZV0B1QtWuwWFcnh2bmKOC',
	   (select id from co_sucursal where nombre='Roma Mty'),
	   false,1,'07:00','20:00',true,2,0,0,1)
	   RETURNING ID;

select * from si_rol



-- roles para el usuario admin roma
insert into si_usuario_sucursal_rol(usuario,co_sucursal,si_rol,co_empresa,genero)
values(127, (select id from co_sucursal where nombre='Roma Mty'),1,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Academía de Belleza Roma'),1);--Rol 1 director	  
	 --(127, (select id from co_sucursal where nombre='Roma Mty'),2,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Academía de Belleza Roma'),1), -- rol 2 cobranza
	 --(127, (select id from co_sucursal where nombre='Roma Mty'),3,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Academía de Belleza Roma'),1), -- rol 3 corte del dia
	 --(127, (select id from co_sucursal where nombre='Roma Mty'),4,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Academía de Belleza Roma'),1), -- rol 4 inscripciones
	 --(127, (select id from co_sucursal where nombre='Roma Mty'),6,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Academía de Belleza Roma'),1); -- rol 6 ventas

--ventas
insert into si_usuario_sucursal_rol(usuario,co_sucursal,si_rol,co_empresa,genero)
values (127, (select id from co_sucursal where nombre='Roma Mty'),6,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Academía de Belleza Roma'),1); -- rol 6 ventas

insert into si_usuario_sucursal_rol(usuario,co_sucursal,si_rol,co_empresa,genero)
values (127, (select id from co_sucursal where nombre='Roma Mty'),2,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Academía de Belleza Roma'),1); -- rol 2 cobranza




	   
-----------------------------------------------------------
------------ USUARIO PARA COBRANZA -----------------------
-----------------------------------------------------------
insert into usuario(nombre,
					correo,
					password,
					co_sucursal,permiso_gerente,cat_tipo_usuario,hora_entrada,hora_salida,acceso_sistema,co_empresa,sueldo_mensual,sueldo_quincenal,genero)
values('Cobranza Roma',
	   'cobranza_roma@gmail.com',
	   '$2a$08$XOjFNU1bEQ4YjNm0/jfvJO4CVbqYKy/DZV0B1QtWuwWFcnh2bmKOC',
	   (select id from co_sucursal where nombre='Roma Mty'),
	   false,1,'07:00','20:00',true,2,0,0,1)
	   RETURNING ID;



-- roles para el usuario admin roma
insert into si_usuario_sucursal_rol(usuario,co_sucursal,si_rol,co_empresa,genero)
values--(127, (select id from co_sucursal where nombre='Roma Mty'),1,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Academía de Belleza Roma'),1),--Rol 1 director	  
	 (128, (select id from co_sucursal where nombre='Roma Mty'),2,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Academía de Belleza Roma'),1); -- rol 2 cobranza
	 --(128, (select id from co_sucursal where nombre='Roma Mty'),3,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Academía de Belleza Roma'),1), -- rol 3 corte del dia
	 --(127, (select id from co_sucursal where nombre='Roma Mty'),4,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Academía de Belleza Roma'),1), -- rol 4 inscripciones
	 --(128, (select id from co_sucursal where nombre='Roma Mty'),6,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Academía de Belleza Roma'),1); -- rol 6 ventas




-----------------------------------------------------------
------------ USUARIO PARA INSCRIPCIONES -----------------------
-----------------------------------------------------------
insert into usuario(nombre,
					correo,
					password,
					co_sucursal,permiso_gerente,cat_tipo_usuario,hora_entrada,hora_salida,acceso_sistema,co_empresa,sueldo_mensual,sueldo_quincenal,genero)
values('Inscripciones Roma',
	   'inscripciones_roma@gmail.com',
	   '$2a$08$XOjFNU1bEQ4YjNm0/jfvJO4CVbqYKy/DZV0B1QtWuwWFcnh2bmKOC',
	   (select id from co_sucursal where nombre='Roma Mty'),
	   false,1,'07:00','20:00',true,2,0,0,1)
	   RETURNING ID;



-- roles para el usuario admin roma
insert into si_usuario_sucursal_rol(usuario,co_sucursal,si_rol,co_empresa,genero)
values--(127, (select id from co_sucursal where nombre='Roma Mty'),1,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Academía de Belleza Roma'),1),--Rol 1 director	  
	 --(129, (select id from co_sucursal where nombre='Roma Mty'),2,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Academía de Belleza Roma'),1), -- rol 2 cobranza
	 --(129, (select id from co_sucursal where nombre='Roma Mty'),3,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Academía de Belleza Roma'),1), -- rol 3 corte del dia
	 (129, (select id from co_sucursal where nombre='Roma Mty'),4,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Academía de Belleza Roma'),1) -- rol 4 inscripciones
	 --(129, (select id from co_sucursal where nombre='Roma Mty'),6,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Academía de Belleza Roma'),1); -- rol 6 ventas



-------------------------------------
--------LOGO DE LA SUCURSAL---------
----------------------------------
update co_sucursal set foto = 'https://as1.ftcdn.net/v2/jpg/02/38/52/00/1000_F_238520076_aOorjpZxhfE7PNmbYxv9pHR4U02GQwbq.jpg' 
where co_empresa = (SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Roma Mty');


--CARGOS
insert into cat_cargo(nombre,descripcion,precio,notificar,co_empresa,identificador,genero)
values('Hora Extra','',50,true,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Roma Mty'),'TIEXROMA',1);

-- cobran a 100 pesos el cargo extra por no pagar a tiempo
insert into cat_cargo(nombre,descripcion,precio,notificar,co_empresa,identificador,genero)
values('Extra mensualidad ','',100,true,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Roma Mty'),'CAEXROMA',1);

-- cobran a 100 pesos el cargo extra por no pagar a tiempo
insert into cat_cargo(nombre,descripcion,precio,notificar,co_empresa,genero)
values('kIT DE BELLEZA ','',250,true,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Roma Mty'),1);

-- cobran a 100 pesos el cargo extra por no pagar a tiempo
insert into cat_cargo(nombre,descripcion,precio,notificar,co_empresa,genero)
values('PLAYERA ','',250,true,(SELECT ID FROM CO_EMPRESA WHERE NOMBRE = 'Roma Mty'),1);


select * from cat_dia

-------------------------------------
--------  LISTA DE DIAS QUE LABORA  ---------
----------------------------------

INSERT INTO CAT_DIA(id,co_empresa,nombre,numero_dia,genero)
values(8,2,'Lunes',1,1),
	(9,2,'Martes',2,1),
	(10,2,'Míercoles',3,1),
	(11,2,'Jueves',4,1),
	(12,2,'Viernes',5,1),
	(13,2,'Sabado',6,1),
	(14,2,'Domingo',7,1);

-------------------------------------
--------  LISTA DE ESPECIALIDADES O TALLERES  ---------
----------------------------------

insert into cat_especialidad(co_empresa, nombre,descripcion,alumnos_permitidos,cat_duracion,duracion,genero)
values(2,'Carrera de Belleza Profesional','Carrera ',20,1,71,1),
	 (2,'Diplomado de Barbería','Diplomado ',20,1,12,1),
	 (2,'Diplomado de Uñas','Diplomado ',20,1,12,1),
	 (2,'Diplomado de Maquillaje','Diplomado ',20,1,12,1),
	 (2,'Diplomado de Cosmetología','Diplomado ',20,1,12,1),
	 (2,'Diplomado de Colorimetría','Diplomado ',20,1,12,1);





-------------------------------------
--------  GENERAR EL CONSECUTIVO  ---------
----------------------------------
-- CONSECUTIVO PARA [RECIBO DE PAGO] : PREFIJO : RO 
insert into co_consecutivo(id,nombre,identificador,anio,valor,co_sucursal,co_empresa,prefijo,genero)
values(6,'RECIBO_PAGO_ROMA','RECIBO_PAGO',22,0,4,2,'RO',1);

-- CONSECUTIVO PARA [MATRICULA] : PREFIJO : RO 
insert into co_consecutivo(id,nombre,identificador,anio,valor,co_sucursal,co_empresa,prefijo,genero)
values(7,'MATRICULA_ROMA','MATRICULA',22,0,4,2,'ROM',1);

-- CONSECUTIVO PARA [MATRICULA] : PREFIJO : RO 
insert into co_consecutivo(id,nombre,identificador,anio,valor,co_sucursal,co_empresa,prefijo,genero)
values(8,'TICKET_VENTA_ROMA','TICKET_VENTA',22,0,4,2,'',1);



--- LOGO del correo
update co_template set logo_correo = 'https://img.freepik.com/foto-gratis/mujer-hermosa-joven-flores-junto-cara_186202-5624.jpg' where id = 1;



update co_template set template_recibo_pago = (select template_recibo_pago from co_template where id = 2) where id=1;

update co_template set template_corte_dia = (select template_corte_dia from co_template where id = 2) where id=1;


update co_template set template_ticket_venta = (select template_ticket_venta from co_template where id = 2) where id=1;


update co_template set template_correo_bienvenida = '

<table width="100%" border="0" style="padding-top:10px" cellspacing="0" cellpadding="0">
    <tr>
        <td class="bodycopy">         
			<p>
            	Hola <strong>{{nombre_alumno}}</strong>,           
            </p>
            <p>
            	Te damos la bienvenida a nuestra institución.
            </p>                        
        </td>
    </tr>
</table>
<p>Por favor revisa tu registro </p>
<table width="100%" border="0" style="padding-top:10px" cellspacing="1" cellpadding="1">
	<tr>
        <td><strong>Matrícula</strong></td>
        <td>{{matricula_alumno}}</td>        
    </tr>    
    <tr>
        <td><strong>Nombre</strong></td>
        <td>{{nombre_alumno}}</td>        
    </tr>
    <tr>
        <td><strong>Apellidos</strong></td>
        <td>{{apellidos_alumno}}</td>        
    </tr>
    <tr>
        <td><strong>Dirección</strong></td>
        <td>{{direccion_alumno}}</td>        
    </tr>
    <tr>
        <td><strong>Correo</strong></td>
        <td>{{correo_alumno}}</td>        
    </tr>
    <tr>
        <td><strong>Teléfono</strong></td>
        <td>{{telefono_alumno}}</td>        
    </tr>
    <tr>
        <td><strong>F. Nacimiento</strong></td>
        <td>{{fecha_nacimiento_alumno}}</td>        
    </tr>    
</table>
<br/>
<p><strong>Inscripción {{fecha_inscripcion}}</strong></p>
<table width="100%" border="0" style="padding-top:10px" cellspacing="1" cellpadding="1">
	<tr>
      <td >
      <img width="20%" class="fix" src="{{& logo_taller}}" />
      </td>           
      <td>
    <table width="100%" border="0" style="padding-top:10px" cellspacing="1" cellpadding="1">
    	<tr><td><strong>{{nombre_taller}}</strong></td>               </tr>
        <tr>
    	<td><strong>{{horario_taller}}</strong></td>             
    </tr>
    <tr>
    <td><strong>Día {{dia_taller}}</strong></td>        
    </tr>
    <tr>
    <td ><strong>{{sucursal}}</strong></td>        
    </tr>
    </table>
    </td>
    </tr>           
</table>
<br/>
<p>* En caso de haber algun detalle con el registro por favor comunicate con nosotros para realizar el cambio.</p>
<br/>
<p><strong>Agradecemos tu confianza</strong></p>
'
where id = 1;


update configuracion set remitente_from = 'Softlineas<familyconnectinfo1@gmail.com>' where id = 1;



select * from co_empresa

select * from configuracion-- where id = 1

select * from co_template where id = 1

select * from co_template



