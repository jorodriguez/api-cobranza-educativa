
-- Script 2 - son modificaciones a datos

update cat_genero set nombre = 'Hombre', foto='https://static.vecteezy.com/system/resources/previews/002/508/442/non_2x/avatar-male-man-portrait-cartoon-character-line-and-fill-style-icon-free-vector.jpg' where id = 4;
update cat_genero set nombre = 'Mujer', foto='https://st3.depositphotos.com/11953928/35426/v/1600/depositphotos_354263092-stock-illustration-avatar-woman-female-character-portrait.jpg' where id = 5;

insert into co_grupo(nombre,color,co_empresa,genero)
values('Diseñadora de imagen profesional','#BF4B7A',3,1),
	 ('Diplomado en Barberia','#BF4B7A',3,1),
	 ('Diplomado en Uñas','#BF4B7A',3,1),
	 ('Diplomado en Maquillaje','#BF4B7A',3,1),
	 ('Diplomado en Cosmetología','#BF4B7A',3,1),
	 ('Diplomado en Colorimetría','#BF4B7A',3,1);


alter table co_alumno add column direccion text;
alter table co_alumno add column telefono text;
alter table co_alumno add column correo text;  
alter table co_alumno add column uid uuid DEFAULT uuid_generate_v4 ()
alter table co_curso add column dias_array integer[];
alter table co_curso add column motivo_baja text;
alter table co_alumno add column originario text;
alter table co_alumno add column ocupacion text;
alter table co_alumno add column tutor text;
alter table co_alumno add column telefono_tutor text;
alter table co_curso add column uid uuid DEFAULT uuid_generate_v4 ()

create table cat_escolaridad(
	id serial not null primary key,
	nombre text not null,
	genero integer not null references usuario(id),
	fecha_genero timestamp default current_timestamp,
	modifico integer references usuario(id),
	fecha_modifico timestamp,
	eliminado boolean default false	
);

alter table co_inscripcion add column confirmado boolean;

alter table co_inscripcion add column fecha_confirmado timestamp;

alter table co_inscripcion add column usuario_confirmo integer references usuario(id);
alter table co_inscripcion add column total_adeuda numeric not null default 0;

alter table co_inscripcion add column co_cargo_inscripcion int references co_cargo_balance_alumno(id);
alter table co_cargo_balance_alumno add column co_curso int references co_curso(id);
alter table co_alumno add column total_adeuda numeric default 0;

update cat_cargo set nombre ='Colegiatura' where id  = 1;

alter table co_inscripcion add column co_cargo_inscripcion int references co_cargo_balance_alumno(id);

insert into cat_escolaridad(nombre,genero)
values('Ninguna',1),('Licenciatura',1),('Preparatoria',1),('Secundaria',1);


alter table co_alumno add column cat_escolaridad integer REFERENCES cat_escolaridad(id);



update cat_horario set nombre = 'Vespertino 2-7' where id = 2

update cat_cargo set nombre = 'Colegiatura' where id =1
alter table co_curso drop column cat_dia;

  insert into cat_cargo(nombre,descripcion,precio,notificar,escribir_monto,co_empresa,genero)
  values('Colegiatura Quincenal','Pago quincenal',1,true,true,3,1);

  insert into cat_cargo(nombre,descripcion,precio,notificar,escribir_monto,co_empresa,genero)
  values('Colegiatura Semanal','Pago por semana',1,true,true,3,1);


insert into cat_cargo(nombre,descripcion,precio,notificar,escribir_monto,co_empresa,genero)
  values('Credencial','',1,true,true,3,1);

  insert into cat_cargo(nombre,descripcion,precio,notificar,escribir_monto,co_empresa,genero)
  values('Playera','',1,true,true,3,1);

  insert into cat_cargo(nombre,descripcion,precio,notificar,escribir_monto,co_empresa,genero)
  values('kit de curso','',1,true,true,3,1);

  alter table co_cargo_balance_alumno drop column co_balance_alumno;

  --Semanas curso
create table co_curso_semanas(
	id serial not null primary key,	
	co_curso integer not null references co_curso(id),
	co_materia_modulo_especialidad integer not null references co_materia_modulo_especialidad(id),
	co_modulo_especialidad integer not null references co_modulo_especialidad(id),
	numero_semana_curso integer not null,
	numero_semana_anio integer not null,
	fecha_inicio_semana date not null,
	fecha_fin_semana date not null,
	fecha_clase date not null,		
	anio integer not null,
	genero integer not null references usuario(id),
	fecha_genero timestamp default current_timestamp,
	modifico integer references usuario(id),
	fecha_modifico timestamp,
	eliminado boolean default false	
);

alter table co_cargo_balance_alumno add column folio text;

alter table co_cargo_balance_alumno add column co_curso_semanas integer references co_curso_semanas(id);

alter table cat_especialidad add column folio text not null default '' ;

alter table co_sucursal add column folio text not null default '' ;

alter table co_empresa add column folio text not null default '' ;

alter table co_curso add column folio text not null default '' ;

alter table co_inscripcion drop column co_cargo_inscripcion;


alter table co_pago_balance_alumno add column co_alumno integer not null references co_alumno(id)

alter table co_pago_balance_alumno drop column co_balance_alumno;


		  alter table co_curso_semanas add column co_cargo_balance_alumno integer references co_cargo_balance_alumno(id);
alter table co_cargo_balance_alumno drop column co_curso_semanas

alter table co_alumno add column correo text 



    update co_template 
    set logo_correo = 'https://res.cloudinary.com/dwttlkcmu/image/upload/v1640639519/static/thumbnail_LOGO_PARIS_aw1o2o.png',
    		encabezado = '
    		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>{{nombre_empresa}}</title>
  <style type="text/css">
  body {margin: 0; padding: 0; min-width: 100%!important;}
  img {height: auto;}
  .content {width: 100%; max-width: 600px;}
  .header {padding: 10px 20px 10px 10px;}
  .innerpadding {padding: 30px 30px 30px 30px;}
  .borderbottom {border-bottom: 1px solid #f2eeed;}
  .subhead {font-size: 15px; color: #ffffff; font-family: sans-serif; letter-spacing: 10px;}
  .h1, .h2, .bodycopy {color: #153643; font-family: sans-serif;}
  .h1 {font-size: 20px; line-height: 38px; }
  .h2 {padding: 0 0 18px 0; font-size: 16px; line-height: 28px; }
  .bodycopy {font-size: 16px; line-height: 28px;}
  .button {text-align: center; font-size: 18px; font-family: sans-serif; font-weight: bold; padding: 0 30px 0 30px;}
  .button a {color: #ffffff; text-decoration: none;}
  .footer {padding: 20px 30px 15px 30px;}
  .footercopy {font-family: sans-serif; font-size: 14px; color: #ffffff;}
  .footercopy a {color: #ffffff; text-decoration: underline;}
  @media only screen and (max-width: 550px), screen and (max-device-width: 550px) {
  body[yahoo] .hide {display: none!important;}
  body[yahoo] .buttonwrapper {background-color: transparent!important;}
  body[yahoo] .button {padding: 0px!important;}
  body[yahoo] .button a {background-color: #e05443; padding: 15px 15px 13px!important;}
  body[yahoo] .unsubscribe {display: block; margin-top: 20px; padding: 10px 50px; background: #2f3942; border-radius: 5px; text-decoration: none!important; font-weight: bold;}
  }
  /*@media only screen and (min-device-width: 601px) {
    .content {width: 600px !important;}
    .col425 {width: 425px!important;}
    .col380 {width: 380px!important;}
    }*/
  </style>
</head>
<body yahoo bgcolor="#FFF">
<table width="100%" bgcolor="#fff" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td>
    <!--[if (gte mso 9)|(IE)]>
      <table width="600" align="center" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
    <![endif]-->     
    <table bgcolor="#ffffff" class="content" align="center" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td bgcolor="#FC8EC4" class="header">
          <table width="40" align="left" border="0" cellpadding="0" cellspacing="0">  
            <tr>
              <td height="20" style="padding: 0 20px 20px 0;>                
                <img class="fix" src="{{& logotipo}}" />                               
              </td>
              <td>
              	<span class="h2"> {{nombre_empresa}}</span>
              </td>
            </tr>
          </table>         
        </td>
      </tr>
      <tr>
        <td class="innerpadding borderbottom">
          <!-- BODY -->
    		',
    	pie='
    	  <!-- Esto es el final del template -->
          <!-- BODY -->
        </td>
      </tr>     
      <tr>
        <td class="innerpadding borderbottom">                    
          {{anexo_pie_correo}}          
        </td>
      </tr>     
      <tr>
      <!-- Color de tema  -->
        <td class="footer" bgcolor="#FC8EC4">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" class="footercopy">
                &reg; {{nombre_empresa}}<br/>                
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px 0 0 0;">
                <table border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="37" style="text-align: center; padding: 0 10px 0 10px;">
                      <a href="http://www.facebook.com/">
                        <img src="images/facebook.png" width="37" height="37" alt="Facebook" border="0" />
                      </a>
                    </td>
                    <td width="37" style="text-align: center; padding: 0 10px 0 10px;">
                      <a href="http://www.twitter.com/">
                        <img src="images/twitter.png" width="37" height="37" alt="Twitter" border="0" />
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <!--[if (gte mso 9)|(IE)]>
          </td>
        </tr>
    </table>
    <![endif]-->
    </td>
  </tr>
</table>
<!--analytics-->
<script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
<script src="http://tutsplus.github.io/github-analytics/ga-tracking.min.js"></script>
</body>
</html>               	
    	',
    	anexo_pie_correo=' ',
    	anexo_recibo_pago=''
    where id = 2;



CREATE OR REPLACE FUNCTION public.obtener_consecutivo(IN identificador_param text,IN id_sucursal integer,OUT consecutivo co_consecutivo)  
AS $function$
DECLARE
	fecha_current timestamp;
	retorno integer := 0;
	consecutivo_anterior RECORD;
	--consecutivo co_consecutivo%ROWTYPE;	
	anio_current integer;
	sqlerr_message_text TEXT;
	sqlerr_exception_detail TEXT;
	sqlerr_exception_hint TEXT;							

BEGIN    

	raise notice 'OBTENER CONSECUTIVO';			
		 
		--consultar el consecutivo actual	
	select * from co_consecutivo where identificador = identificador_param and co_sucursal = id_sucursal INTO consecutivo_anterior;

	raise notice 'consecutivo_anterior %',consecutivo_anterior;
	
	IF FOUND THEN				
				fecha_current := ((getDate('')+getHora(''))::timestamp);										
				raise notice 'consecutivo_anterior %',consecutivo_anterior;								

				select EXTRACT(YEAR FROM fecha_current)::integer INTO anio_current;		

				IF anio_current = consecutivo_anterior.anio THEN
					--son iguales los años, procedera generar un nuevo consecutivo
					 update co_consecutivo 
					 set valor = (consecutivo_anterior.valor+1)
					 where id = consecutivo_anterior.id
					 returning *
					 INTO consecutivo;
					 
				ELSE
					--son DIFERENTES los años, procedera generar un nuevo consecutivo y actualizar el año
					update co_consecutivo 
					 set valor = (consecutivo_anterior.valor+1),
					 	anio = anio_current,
					 	valor = 1
					 where id = consecutivo_anterior.id
					 returning *
					 INTO consecutivo;
				END IF;			   			
			
	ELSE
		raise notice 'NO EXISTE EL IDENTIFICADOR';
		consecutivo := null;
	END IF;		
	raise notice 'consecutivo %',consecutivo;
	
	--return  consecutivo;
END;
$function$
LANGUAGE 'plpgsql';


alter table co_pago_balance_alumno add column folio text not null default '';



alter table co_inscripcion drop column co_sucursal

alter table co_inscripcion add column co_sucursal integer references co_sucursal(id);

update co_inscripcion set co_sucursal = 1 

alter table co_inscripcion alter column co_sucursal set not null;



alter table co_pago_balance_alumno add column co_sucursal integer references co_sucursal(id);

alter table co_pago_cargo_balance_alumno add column co_sucursal integer references co_sucursal(id);

update co_pago_cargo_balance_alumno set co_sucursal = 1 where id <> 41


update co_pago_balance_alumno set co_sucursal = 1 where id <> 38


ALTER TABLE co_pago_balance_alumno ALTER COLUMN co_sucursal set NOT NULL

ALTER TABLE co_pago_cargo_balance_alumno ALTER COLUMN co_sucursal set NOT NULL;

alter table co_template add column template_corte_dia text;