
CREATE TABLE co_facturacion_sucursal
(
	id serial NOT NULL primary key,		
	co_sucursal integer not null references co_sucursal(id),	
	fecha_mensualidad date  DEFAULT (getDate('')),		
	nombre_mensualidad varchar(24) not null,	
	nota text,	
	comprobante_pago_url text,				
	monto numeric not null,	
	pago_aceptado boolean, -- null pendiente, false rechazado true aceptado
	fecha_pago_aceptado timestamp,	
	fecha_pago_cancelado timestamp,	
	fecha_genero timestamp  DEFAULT (getDate('')+getHora('')),
	fecha_modifico timestamp,
	genero integer NOT NULL references usuario(id),
	modifico integer references usuario(id),	
	eliminado boolean NOT NULL DEFAULT false    
);



	  alter table co_facturacion_sucursal add UNIQUE(nombre_mensualidad,co_sucursal);


update co_sucursal set mensualidad = 650;

alter table co_sucursal alter column mensualidad set not null;


update co_sucursal set dia_limite_pago = dia_pago + 3;

alter table co_sucursal alter column dia_limite_pago set not null;


alter table co_facturacion_sucursal add column fecha_adjunto_comprobante date;

alter table co_facturacion_sucursal add column nota_rechazo text




/*

-- query para detectar el registro 
select * 
from co_sucursal
where id not in (
	select co_sucursal 
	from co_facturacion_sucursal f 
	where f.eliminado = false and to_char(f.fecha_mensualidad,'YYYYMM') = to_char(getDate(''),'YYYYMM')
) and eliminado = false



insert automatico
insert into co_facturacion_sucursal(co_sucursal,nombre_mensualidad,nota,monto,genero)
values(1,
	  (select nombre||' '||to_char(getDate(''),'YY') from si_meses where id = to_char(getDate(''),'MM')::integer and eliminado = false), 
	  'Monto mensual correspondiente a '||(select nombre from si_meses where id = to_char(getDate(''),'MM')::integer and eliminado = false), 
	  (select mensualidad from co_sucursal where id = 1),
	  1);


*/