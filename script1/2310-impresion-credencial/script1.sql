alter table co_sucursal add column plan_foto_alumnos boolean default false not null;

alter table co_alumno add column foto_agregada boolean default false not null;


CREATE TABLE si_tipo_facturacion_recurso(
	id serial NOT NULL primary key,		
	nombre text not null,	
	precio numeric not null,
	fecha_genero timestamp  DEFAULT (getDate('')+getHora('')),
	fecha_modifico timestamp,
	genero integer NOT NULL references usuario(id),
	modifico integer references usuario(id),
	eliminado boolean NOT NULL DEFAULT false    
);

CREATE TABLE si_facturacion_recursos(
	id serial NOT NULL primary key,			
	si_tipo_facturacion_recurso integer NOT NULL references si_tipo_facturacion_recurso(id),	
	precio numeric not null,	
	co_sucursal integer NOT NULL references co_sucursal(id),	
	nota text,
	texto_ayuda text,
	fecha_genero timestamp  DEFAULT (getDate('')+getHora('')),
	fecha_modifico timestamp,
	genero integer NOT NULL references usuario(id),
	modifico integer references usuario(id),
	eliminado boolean NOT NULL DEFAULT false    
);


insert into si_tipo_facturacion_recurso(id,nombre,precio,genero)
values(1,'Sistema',650,1),
	 (2,'Desarrollo Nuevo',1,1),
	 (3,'Alta de Foto',15,1),
	 (4,'Impresión de credencial',0,1);
	 

alter table co_sucursal add column credito_fotos integer not null default 0;

update co_sucursal set credito_fotos = 10,plan_foto_alumnos =true ; --creditos para las fotos 

alter table co_template add column template_credencial text;

update co_template set template_credencial = '
<!DOCTYPE html>
<html>
<head>
<title>Credencial</title>
<style type="text/css" media="print">
#print { 
	margin: 0px 0px 10px 0px;  
}
@page{
   margin: 10;
   size: A4;
   
}
@media print {
            body {
                -webkit-print-color-adjust: exact;
                -moz-print-color-adjust: exact;
                -ms-print-color-adjust: exact;
                print-color-adjust: exact;
                /*box-shadow: inset 0 0 0 1000px gray;*/
            }

            .noprint {
                display: none;
            }
        }
</style>

</head>
<body style="font-family: ''Trebuchet MS'', sans-serif;font-size:12px;">

<table id="print" width="416px" style="border: 1px dashed gray; border-radius:5px; background-image: url(''https://res.cloudinary.com/dyabmkg2p/image/upload/v1697131138/prepa_cecan/suc_cecan/fondo3_npq8de.png''); background-repeat: no-repeat; "  cellspacing="2" cellpadding="0">
	<tr>
    		<!-- parte delantera-->
        <td style="width:208px; border: 1px solid gray;  border-radius:5px; padding:1px">
        	<table width="100%" border="0"  cellspacing="0" cellpadding="0">
            	<tr >
                	<td width="30%"  style="background-color:#1B72C0; border-radius:5px;"  >
          				
                    </td>
                    <td  width="40%"  align="right" style="text-align:left">
                    	<!--<img style="height:70px;" src="{{& logotipo}}" />-->
                        <img style="height:50px; " src="https://res.cloudinary.com/dyabmkg2p/image/upload/v1696957520/prepa_cecan/suc_cecan/31369099_781212635421940_2008629288055603200_n_b8wm82.png" />                        
                    </td>       
                    <td width="30%">
          				
                    </td>
                </tr>
                <!-- foto-->
                <tr >
                	<td width="30%"  >
          				
                    </td>
                    <td  width="40%"  align="right">
                    	<img style="height:80px; width:100%; border: 2px solid #1B72C0; border-radius:5px;" src="{{& foto}}" />                                                
                    </td>       
                    <td width="30%">
          				
                    </td>
                </tr>
                <tr style="text-align:center">
                	<td colspan="3"  >
          				<span style="color:#1B72C0"><strong>Estudiante</strong></span>
                    </td>                    
                </tr>
                <tr style="text-align:center">
                    <td colspan="3" >
          				{{nombre_alumno}}
                    </td>
                </tr>
                 <tr style="text-align:center">
                    <td colspan="3" >
          				{{nombre_carrera}}
                    </td>
                </tr>
                <tr style="text-align:center">
                    <td colspan="3" >
          				{{ciclo}}
                    </td>
                </tr>
                 <tr style="text-align:center" >
                    <td colspan="3">
          				<img style="height:20px;" src="https://res.cloudinary.com/dyabmkg2p/image/upload/v1696954481/prepa_cecan/suc_cecan/2560px-SEP_Logo_2019.svg_bovgve.png" />
                    </td>
                </tr>
                 <tr style="text-align:center;background-color:#1B72C0;height:40px;">
                    <td colspan="3" style="border-radius:5px;color:white" >
          				{{domicilio_sucursal}}
                    </td>
                </tr>
            </table>            
        </td>        
        
        <!-- parte trasera-->
        <td style="width:208px; border: 1px solid gray;  border-radius:5px; padding:1px">
        	<table width="100%"  border="0" cellspacing="1" cellpadding="1">
            	<tr >
                	<td align="center" style="height:50px; "  >           				
                        <table width="100%" style="height: 150px; text-align: center;"  >
                        	<tr >
                            	<td style="border-bottom: 0px solid gray;text-align: center;">
                    				
                            	</td>
                            </tr>
                            <tr>
                            	<td style=" vertical-align:top">
                    			<img style="height:30px;"
                        src="https://res.cloudinary.com/dyabmkg2p/image/upload/v1696957520/prepa_cecan/suc_cecan/31369099_781212635421940_2008629288055603200_n_b8wm82.png" />                         
                                </td>
                            </tr>
                            <tr>
                            	<td>
                                	<img style="height:100px;" src="{{& qr}}"/>                                             			
                                </td>
                            </tr>
                             <tr>
                            	<td>
                                <img style="height:40px;"
                        src="https://res.cloudinary.com/dyabmkg2p/image/upload/v1696975476/prepa_cecan/suc_cecan/firma_lhffmk.png" />                         
                    			
                                </td>
                            </tr>
                              <tr>
                            	<td>
                    			<strong>Lic. Jesús Vargas</strong>
                                </td>
                            </tr>
                        </table>
                    </td>
               </tr>
               <tr>
                    <td   align="right">
                    	<table width="100%" style="height: 70px;border: 0px solid black;text-align: center; border-radius: 5px;"  cellspacing="1">
                        	<tr >
                            <td style="border-bottom: 0px solid gray;text-align: center;">
                    			
                            </td>
                            </tr>
                            <tr>
                            	<td style="text-align: left;">                    			
                                	<p><span> <strong>CCT</strong></span>: 28PBTOO34J</p>
                                 	<p><span> <strong>CCT</strong></span>: 18FT428 Y 18FT429</p>
                                </td>
                            </tr>
                            <tr>
                            	<td style="text-align: left;">
                    			
                                </td>
                            </tr>
                             
                        </table>
                    </td>                    
                </tr>
            </table>            
        </td>        
    </tr>
   
               
</table>
</body>
</html>
' 
where id = 4



--- plantilla para las demas sucurisales


update co_template set template_credencial = '

<!DOCTYPE html>
<html>
<head>
<title>Credencial</title>
<style type="text/css" media="print">
#print { 
	margin: 0px 0px 10px 0px;  
}
@page{
   margin: 10;
   size: A4;
   
}
@media print {
            body {
                -webkit-print-color-adjust: exact;
                -moz-print-color-adjust: exact;
                -ms-print-color-adjust: exact;
                print-color-adjust: exact;
                /*box-shadow: inset 0 0 0 1000px gray;*/
            }

            .noprint {
                display: none;
            }
        }
</style>

</head>
<body style="font-family: ''Trebuchet MS'', sans-serif;font-size:12px;">

<table id="print" width="416px" style="border: 1px dashed gray; border-radius:5px; background-image: url(''https://res.cloudinary.com/dyabmkg2p/image/upload/v1697152443/prepa_cecan/suc_cecan/fondopairs_wvhsff.png''); "  cellspacing="2" cellpadding="0">
	<tr>
    		<!-- parte delantera-->
        <td style="width:208px; border: 1px solid #9D03B5;  border-radius:5px; padding:1px">
        	<table width="100%" border="0"  cellspacing="0" cellpadding="0">
            	<tr >
                	<td width="30%"  style="background-color:#9D03B5; border-radius:5px;"  >
          				
                    </td>
                    <td  width="40%"  align="right" style="text-align:left">
                    	<!--<img style="height:70px;" src="{{& logotipo}}" />-->
                        <img style="height:50px; " src="https://res.cloudinary.com/dwttlkcmu/image/upload/v1640639519/static/thumbnail_LOGO_PARIS_aw1o2o.png" />                        
                    </td>       
                    <td width="30%">
          				
                    </td>
                </tr>
                <!-- foto-->
                <tr >
                	<td width="30%"  >
          				
                    </td>
                    <td  width="40%"  align="right">
                    	<img style="height:80px; width:100%; border: 2px solid #9D03B5; border-radius:5px;" src="{{& foto}}" />                                                
                    </td>       
                    <td width="30%">
          				
                    </td>
                </tr>
                <tr style="text-align:center">
                	<td colspan="3"  >
          				<span style="color:#9D03B5"><strong>Estudiante</strong></span>
                    </td>                    
                </tr>
                <tr style="text-align:center">
                    <td colspan="3" >
          				{{nombre_alumno}}
                    </td>
                </tr>
                 <tr style="text-align:center">
                    <td colspan="3" >
          				{{nombre_carrera}}
                    </td>
                </tr>
                <tr style="text-align:center">
                    <td colspan="3" >
          				{{ciclo}}
                    </td>
                </tr>
                 <tr style="text-align:center" >
                    <td colspan="3">
          				<img style="height:20px;" src="https://res.cloudinary.com/dyabmkg2p/image/upload/v1696954481/prepa_cecan/suc_cecan/2560px-SEP_Logo_2019.svg_bovgve.png" />
                    </td>
                </tr>
                 <tr style="text-align:center;background-color:#9D03B5;height:40px;">
                    <td colspan="3" style="border-radius:5px;color:white" >
          				{{domicilio_sucursal}}
                    </td>
                </tr>
            </table>            
        </td>        
        
        <!-- parte trasera-->
        <td style="width:208px; border: 1px solid gray;  border-radius:5px; padding:1px">
        	<table width="100%"  border="0" cellspacing="1" cellpadding="1">
            	<tr >
                	<td align="center" style="height:50px; "  >           				
                        <table width="100%" style="height: 150px; text-align: center;"  >
                        	<tr >
                            	<td style="border-bottom: 0px solid gray;text-align: center;">
                    				
                            	</td>
                            </tr>
                            <tr>
                            	<td style=" vertical-align:top">
                    			<img style="height:30px;"
                        src="https://res.cloudinary.com/dwttlkcmu/image/upload/v1640639519/static/thumbnail_LOGO_PARIS_aw1o2o.png" />                         
                                </td>
                            </tr>
                            <tr>
                            	<td>
                                	<img style="height:100px;" src="{{& qr}}"/>                                             			
                                </td>
                            </tr>
                             <!--<tr>
                            	<td>
                                <img style="height:40px;"
                        src="https://res.cloudinary.com/dyabmkg2p/image/upload/v1696975476/prepa_cecan/suc_cecan/firma_lhffmk.png" />                         
                    			
                                </td>
                            </tr>-->
                              <tr>
                            	<td>
                    			<strong>Dirección General</strong>
                                </td>
                            </tr>
                        </table>
                    </td>
               </tr>
               <tr>
                    <td   align="right">
                    	<table width="100%" style="height: 70px;border: 0px solid black;text-align: center; border-radius: 5px;"  cellspacing="1">
                        	<tr >
                            <td style="border-bottom: 0px solid gray;text-align: center;">
                    			
                            </td>
                            </tr>
                            <tr>
                            	<td style="text-align: left;">                    			
                                	<p><span> <strong>CCT</strong></span>: </p>
                                 	<p><span> <strong>CCT</strong></span>: </p>
                                </td>
                            </tr>
                            <tr>
                            	<td style="text-align: left;">
                    			
                                </td>
                            </tr>
                             
                        </table>
                    </td>                    
                </tr>
            </table>            
        </td>        
    </tr>
   
               
</table>
</body>
</html>
' 
where id <> 4;

alter table co_curso add column public_id_foto text;

alter table co_sucursal add column plan_foto_cursos boolean default false;

update co_sucursal set plan_foto_cursos = true;