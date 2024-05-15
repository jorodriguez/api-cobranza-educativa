
CREATE TABLE cat_esquema_pago
(
	id serial NOT NULL primary key,		
	nombre text not null,	
	fecha_genero timestamp  DEFAULT (getDate('')+getHora('')),
	fecha_modifico timestamp,
	genero integer NOT NULL references usuario(id),
	modifico integer references usuario(id),
	eliminado boolean NOT NULL DEFAULT false    
);

insert into cat_esquema_pago(id,nombre, genero) values(1,'Semanal',1),(2,'Mensual',1);

alter table co_inscripcion add column cat_esquema_pago integer not null default 1 references cat_esquema_pago(id);

alter table co_cargo_balance_alumno add column cat_esquema_pago integer references co_cargo_balance_alumno(id);

update co_cargo_balance_alumno set cat_esquema_pago = 1;

alter table co_inscripcion alter column cat_esquema_pago drop default;

alter table co_cargo_balance_alumno alter column cat_esquema_pago drop default;

alter table co_cargo_balance_alumno alter column cat_esquema_pago drop not null;



update co_template 
set template_recibo_pago = '


<!DOCTYPE html>
<html>
<head>
<title>Recibo pago CECAN</title>
<style type="text/css" media="print">
#print {
/* height: auto;
 width: auto;
 margin: 0px 0px 10px 0px;
 padding: 10px;      */
}

body  
{ 
    /* this affects the margin on the content before sending to printer */ 
    margin: 0px;  
  
} 
@page{
    size: A4;

    /* this affects the margin in the printer settings */ 
    margin: 10mm 5mm 10mm 5mm;      
}
@media print {
.page { margin: 0; border: initial; border-radius: initial; width: initial; min-height: initial; box-shadow: initial; background: initial; page-break-after: always; } }


</style>
</head>
<body>
<table id="print" border="0" style=" vertical-align:top;;min-height:14cm; border: 1px solid #000" cellspacing="2" cellpadding="0">
	<tr valign="top" style="vertical-align:top;" >
        <td style="border-bottom: 1px solid gray;">
        	<table width="100%" border="0" cellspacing="0" cellpadding="0" >
            	<tr  >
                	<td>                    	 
                        <table width="100%" 
                        	  style="height: 130px;border: 1px solid black;text-align: center; border-radius: 5px;"  cellspacing="0" cellpadding="0">
                        	<tr >
                            	<td rowspan="5" style="text-align: left;">
                    				<!--<img src="{{& logotipo}}" />-->
                                    <img style="height: 120px" src="https://res.cloudinary.com/dwttlkcmu/image/upload/v1655236198/static/oferta_educativa_cecan/WhatsApp_Image_2022-06-11_at_4.36.34_PM_ytp9er.jpg"/>
                                </td>
                             </tr>
                             <tr style="text-align: left;">
                                <td>
                                	<strong>CENTRO DE CAPACITACIÓN Y NIVELACIÓN DE NUEVO LAREDO</strong>
                                </td>
                             <tr style="text-align: left;">
                                <td>
                                	<small>{{nombre_sucursal}} {{direccion_sucursal}}</small>
                                </td>
                              </tr>
                              <tr style="text-align: left;">
                              <td><small>Clave C.C.T 28PBT0034J ACUERDO 18FT428 Y 18FT429</small></td></tr>
                              
                              <tr style="text-align: left;">
                               <td><small>{{telefono_sucursal}}</small></td>
                              </tr>                            
                                                     
                            
                        </table>
                        
                    </td>
                    <td width="30%"  align="right" >
                    	<table width="100%" style="height: 70px;border: 1px solid black;text-align: center; border-radius: 5px;"  cellspacing="0">
                        	<tr >
                            <td style="border-bottom:0px solid #000;text-align: center;">
                    				<strong>Recibo</strong>
                                </td>
                            </tr>
                            <tr>
                            	<td>
                    			<strong>{{folio}}</strong>
                                </td>
                            </tr>                          
                        </table>
                        <table width="100%" style="height: 60px;border: 1px solid black;text-align: center; border-radius: 5px;"  cellspacing="0">
                        	<tr >
                            <td style="border-bottom:px solid #000;text-align: center;">
                    				<strong>Fecha</strong>
                                </td>
                            </tr>
                            <tr>
                            	<td>
                    			<strong>{{fecha}}</strong>
                                </td>
                            </tr>                          
                        </table>
                    </td>                       
                </tr>
            </table>            
        </td>        
    </tr>
    
    <tr  style="vertical-align:top;" >
        <td style="padding-left:5px;">
        <!-- datos alumno -->
        <table width="100%" style="text-align: left;padding-top:5px;"   border="0" cellspacing="0" cellpadding="0">
            	<tr >
                	<td width="15%">
                    	<strong>Alumno</strong>
                    </td>                 
                    <td>
                    	<p>{{nombre_alumno}} {{apellidos_alumno}} </p>                                           		</td>                                 
                   <td><strong> Forma de pago</strong></td>
                </tr>                           
                <tr>
                	<td width="15%">
                    	<strong>Atendió</strong>
                    </td>                 
                    <td>
                    	{{nombre_usuario}}</strong>                                           
                     </td>     
                   <td>{{forma_pago}}</td>
                </tr>                   
            </table>          
        </td>
    </tr>
    
    <tr style="vertical-align:top" >
    	<td style="padding-left:5px;padding-top:15px;vertical-align:top">           
            <table  width="100%" border="0" cellspacing="2" cellpadding="2">
                <tr style="background-color:#fff;">
                    <th  style="border:1px solid #000;text-align: left;" >Descripción</th>                    
                    <th style="border:1px solid #000;" width="10%">Cant.</th>
                    <th style="border:1px solid #000;text-align:right" width="15%" align="right">Cargo</th>                                   
                    <th style="border:1px solid #000;text-align:right" width="15%" align="right">Adeuda</th>                                   
                    <th style="border:1px solid #000;text-align:right" width="15%" align="right">Pagado</th>                </tr>                
                {{#cargos}}
                <!-- IF -->
                <tr style="text-align:left">
                    <td colspan="5">{{nombre_cargo}}                   
                   {{#especialidad}}             
                 <span >{{especialidad}}</span>
                  {{/especialidad}}
                  {{#numero_semana_curso}}             
                 <span > -- {{numero_semana_curso}}</span>
                 {{/numero_semana_curso}}   
                 {{#texto_ayuda}}             
                 <span >{{texto_ayuda}}</span>
                 {{/texto_ayuda}}     
                 </td>
                 </tr>
                 <tr style="text-align:right">
                    <td colspan="2" style="border-bottom:1pt solid #000;">{{cantidad}}</td>
                    <td style="border-bottom:1pt solid #000;text-align:right" align="right">${{cargo}}</td>                    
                    <td style="border-bottom:1px solid #000;text-align:right" align="right">${{total}}</td>
                    <td style="border-bottom:1px solid #000;text-align:right" align="right">${{pago}}</td>                                   <!--<td>{{nota}}</td>-->
                </tr>
                {{/cargos}}
                <tr>
                	
                    <td colspan="4" style="text-align:right;">
                        <strong>Pago recibido:</strong>
                    </td>
                    <td style="border-bottom:2pt solid #57A8B6;text-align:right;background-color:#F7F7F7" valign="center" align="right">
                        <h4><strong> ${{pago}}</strong> </h4>
                    </td>
            </tr>
            <tr>
             <td <td colspan="5">      
              	<table width="100%" style="text-align: center;"   border="0" >
            	<tr>
                	<td style="heigth:12px" >                    	
                        <strong><small> ¡Gracias por su confianza¡ </small></strong><br/>
                        <small>NO HAY DEVOLUCIONES EN INSCRIPCIONES Y COLEGIATURAS</small><br/>
                        <small>impresión {{fecha_impresion}} - <small>softlineas.com</small> </small> 
                	</td>
                </tr>    
         
         	</table>              
         	
        </td>
            </tr>
          </table>
        </td>
      </tr>   
      
</table>
<hr style="border: 1px dashed gray" />
<!-- Copia -->
<table id="print" border="0" style="vertical-align:top;min-height:14cm;border: 1px solid #000" cellspacing="2" cellpadding="0">
	<tr style="vertical-align:top">
        <td style="border-bottom: 1px solid gray;">
        	<table width="100%" border="0" cellspacing="0" cellpadding="0">
            	<tr>
                	<td>                    	 
                        <table width="100%" 
                        	  style="height: 130px;border: 1px solid black;text-align: center; border-radius: 5px;"  cellspacing="1">
                        	<tr >
                            	<td rowspan="5" style="text-align: left;">
                    				<!--<img src="{{& logotipo}}" />-->
                                    <img style="height: 120px" src="https://res.cloudinary.com/dwttlkcmu/image/upload/v1655236198/static/oferta_educativa_cecan/WhatsApp_Image_2022-06-11_at_4.36.34_PM_ytp9er.jpg"/>
                                </td>
                             </tr>
                             <tr style="text-align: left;">
                                <td>
                                	<strong>CENTRO DE CAPACITACIÓN Y NIVELACIÓN DE NUEVO LAREDO</strong>
                                </td>
                             <tr style="text-align: left;">
                                <td>
                                	<small>{{nombre_sucursal}} {{direccion_sucursal}}</small>
                                </td>
                              </tr>
                              <tr style="text-align: left;">
                              	<td><small>Clave C.C.T 28PBT0034J ACUERDO 18FT428 Y 18FT429</small></td>
                              </tr>
                              <tr style="text-align: left;">
                                <td>
                                	<small>{{telefono_sucursal}}</small>
                                </td>
                            </tr>                            
                        </table>
                        
                    </td>
                    <td width="30%"  align="right" >
                    	<table width="100%" style="height: 70px;border: 1px solid black;text-align: center; border-radius: 5px;"  cellspacing="0">
                        	<tr >
                            <td style="border-bottom:0px solid #000;text-align: center;">
                    				<strong>Recibo</strong>
                                </td>
                            </tr>
                            <tr>
                            	<td>
                    			<strong>{{folio}}</strong>
                                </td>
                            </tr>                          
                        </table>
                        <table width="100%" style="height: 60px;border: 1px solid black;text-align: center; border-radius: 5px;"  cellspacing="0">
                        	<tr >
                            <td style="border-bottom:px solid #000;text-align: center;">
                    				<strong>Fecha</strong>
                                </td>
                            </tr>
                            <tr>
                            	<td>
                    			<strong>{{fecha}}</strong>
                                </td>
                            </tr>                          
                        </table>
                    </td>                       
                </tr>
            </table>            
        </td>        
    </tr>
    
    <tr>
        <td style="padding-left:5px;">
        <!-- datos alumno -->
        <table width="100%" style="text-align: left;padding-top:5px;"   border="0" cellspacing="0" cellpadding="0">
            	<tr >
                	<td width="15%">
                    	<strong>Alumno</strong>
                    </td>                 
                    <td>
                    	<p>{{nombre_alumno}} {{apellidos_alumno}} </p>                                           		</td>                                 
                   <td><strong> Forma de pago</strong></td>
                </tr>                           
                <tr>
                	<td width="15%">
                    	<strong>Atendió</strong>
                    </td>                 
                    <td>
                    	{{nombre_usuario}}</strong>                                           
                     </td>     
                   <td>{{forma_pago}}</td>
                </tr>                   
            </table>          
        </td>
    </tr>
    
    <tr>
    	<td style="padding-left:5px;padding-top:15px;">           
            <table  width="100%" border="0" cellspacing="2" cellpadding="2">
                <tr style="background-color:#fff;">
                    <th  style="border:1px solid #000;text-align: left;" >Descripción</th>                    
                    <th style="border:1px solid #000;" width="10%">Cant.</th>
                    <th style="border:1px solid #000;text-align:right" width="15%" align="right">Cargo</th>                                   
                    <th style="border:1px solid #000;text-align:right" width="15%" align="right">Adeuda</th>                                   
                    <th style="border:1px solid #000;text-align:right" width="15%" align="right">Pagado</th>                </tr>                
                {{#cargos}}
                <!-- IF -->
                <tr style="text-align:left">
                    <td colspan="5">{{nombre_cargo}}                   
                   {{#especialidad}}             
                 <span >{{especialidad}}</span>
                  {{/especialidad}}
                  {{#numero_semana_curso}}             
                 <span > -- {{numero_semana_curso}}</span>
                 {{/numero_semana_curso}}                            
                 {{#texto_ayuda}}             
                 <span >{{texto_ayuda}}</span>
                 {{/texto_ayuda}}                            
                 </td>
                 </tr>
                 <tr style="text-align:right">
                    <td colspan="2" style="border-bottom:1pt solid #000;">{{cantidad}}</td>
                    <td style="border-bottom:1pt solid #000;text-align:right" align="right">${{cargo}}</td>                    
                    <td style="border-bottom:1px solid #000;text-align:right" align="right">${{total}}</td>
                    <td style="border-bottom:1px solid #000;text-align:right" align="right">${{pago}}</td>                                   <!--<td>{{nota}}</td>-->
                </tr>
                {{/cargos}}
                <tr>
                	
                    <td colspan="4" style="text-align:right;">
                        <strong>Pago recibido:</strong>
                    </td>
                    <td style="border-bottom:2pt solid #57A8B6;text-align:right;background-color:#F7F7F7" valign="center" align="right">
                        <h4><strong> ${{pago}}</strong> </h4>
                    </td>
            </tr>
            <tr>
             <td <td colspan="5">      
              	<table width="100%" style="text-align: center;"   border="0" >
            	<tr>
                	<td style="heigth:12px" >                    	
                        <strong>¡Gracias por su confianza¡</strong><br/>
                         <small>NO HAY DEVOLUCIONES EN INSCRIPCIONES Y COLEGIATURAS</small><br/>
                        <small>impresión {{fecha_impresion}} - <small>softlineas.com</small> </small> 
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
where id = 4;



update co_template 
set template_recibo_pago = '
   


<!DOCTYPE html>
<html>
<head>
<title>Page Title</title>
<style type="text/css" media="print">
{{#estilo_ticket}}
#print {
 height: auto;
 width: 310px;
 margin: 0px 0px 10px 0px;
 padding: 10px;     
 font-size:.25em !important; 
}  
{{/estilo_ticket}}
{{^estilo_ticket}}
  #print {
 height: auto;
 width: auto;
 margin: 0px 0px 10px 0px;
 padding: 10px;      
} 
{{/estilo_ticket}}

@page{
   margin: 10;
}
</style>
</head>
<body>
<table id="print" border="0" cellspacing="0" cellpadding="0">
	<tr>
        <td style="border-bottom: 1px solid gray;">
        	<table width="100%" border="0" cellspacing="3" cellpadding="3">
            	<tr>
                	<td>
                    	 <img style="height:70px;" src="{{& logotipo}}" />
                    </td>
                    <td  width="30%"  align="right">
                    	<table width="100%" style="height: 70px;border: 1px solid black;text-align: center; border-radius: 5px;"  cellspacing="1">
                        	<tr >
                            <td style="border-bottom: 0px solid gray;text-align: center;">
                    				<strong>Recibo</strong>
                                </td>
                            </tr>
                            <tr>
                            	<td>
                    			<strong>{{folio}}</strong>
                                </td>
                            </tr>
                        </table>
                    </td>                    
                </tr>
            </table>            
        </td>        
    </tr>
    <tr>
        <td style="border-bottom: 1px solid gray;">          
         <table width="100%"  style="height: 70px;border: 0px solid black;text-align: left;"  border="0" cellspacing="0" cellpadding="0">
            	<tr><td><small>{{nombre_empresa}}</small></td></tr>
                <tr><td>{{rfc}}<tr><td>
                <tr><td>{{nombre_sucursal}}<tr><td>
                <tr><td>{{direccion_sucursal}}<tr><td>
                <tr><td>{{telefono_sucursal}}<tr><td>               
            </table>                          
        </td>
    </tr>   
    <tr>
        <td style="border-bottom: 1px solid gray;">
        <!-- datos alumno -->
        <table width="100%"  style="border: 0px solid black;text-align: left;"   border="0" cellspacing="3" cellpadding="3">
            	<tr>
                	<td width="15%">
                    	<p><strong>Alumno</strong></p>                        
                    </td>                 
                    <td>
                    	<p>{{nombre_alumno}} {{apellidos_alumno}}</strong></p>                                            </td>                 
                </tr>                           
            </table>          
        </td>
    </tr>
    <tr>
        <td style="border-bottom: 1px solid gray;">
            <br/>
            <table width="100%" style="background-color:white">
                <tr>
                    <td  width="15%"><strong>Fecha</strong></td>
                    <td>{{fecha}}</td>
                </tr>
                <tr>
                    <td><strong>Forma de Pago</strong></td>
                    <td>{{forma_pago}}</td>
                </tr>               
            </table>
            <br/>
            <table width="100%" border="0" cellspacing="2" cellpadding="2">
                <tr>
                    <th  style="border-bottom:1pt solid #57A8B6;text-align: left;" >Descripción</th>                    
                    <th style="border-bottom:1pt solid #57A8B6;" width="10%">Cant.</th>
                    <th style="border-bottom:1pt solid #57A8B6;text-align:right" width="15%" align="right">Cargo</th>                                   <th style="border-bottom:1pt solid #57A8B6;text-align:right" width="15%" align="right">Adeuda</th>                                   <th style="border-bottom:1pt solid #57A8B6;text-align:right" width="15%" align="right">Pagado</th>                </tr>                
                {{#cargos}}
                <!-- IF -->
                <tr style="text-align:left">
                    <td colspan="5">{{nombre_cargo}}                   
                   {{#especialidad}}             
                 <span >{{especialidad}}</span>
                  {{/especialidad}}
                  {{#numero_semana_curso}}             
                 <span > -- {{numero_semana_curso}}</span>
                 {{/numero_semana_curso}}                            
                 {{#texto_ayuda}}             
                 <span > {{texto_ayuda}}</span>
                 {{/texto_ayuda}}                            
                 </td>
                 </tr>
                 <tr style="text-align:right">
                    <td colspan="2" style="border-bottom:1pt solid #57A8B6;">{{cantidad}}</td>
                    <td style="border-bottom:1pt solid #57A8B6;text-align:right" align="right">${{cargo}}</td>                    
                    <td style="border-bottom:1px solid #57A8B6;text-align:right" align="right">${{total}}</td>
                    <td style="border-bottom:1px solid #57A8B6;text-align:right" align="right">${{pago}}</td>                                   <!--<td>{{nota}}</td>-->
                </tr>
                {{/cargos}}
                <tr>
                    <td colspan="4" style="text-align:right">
                        <strong>Pago recibido:</strong>
                    </td>
                    <td style="border-bottom:2pt solid #57A8B6;text-align:right;background-color:#F7F7F7" valign="center" align="right">
                        <h4><strong> ${{pago}}</strong> </h4>
                    </td>
            </tr>
          </table>
        </td>
      </tr>   
      <!-- mensaje final -->
       <tr>
        <td >      
        	<br/>
        	<table width="100%" style="text-align: center;"   border="0" >
            	<tr>
                	<td>
                    	<p>Atendió {{nombre_usuario}}</p> 
                        <p><strong>¡Gracias por su confianza¡</strong></p> 
                        <small>{{fecha_impresion}}</small> 
                	</td>
                </tr>    
                <tr>
                	<td><small>http://www.softlineas.com</small> </td>
                </tr>

         	</table>              
         	<br/>
         	<br/>
         	<br/>
        </td>
    </tr>    
      <!-- fin mensaje final-->                
</table>
</body>
</html>

'
where id = 2;
