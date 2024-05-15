alter table co_template  add column template_gasto text;


update co_template set template_gasto = '
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
  .borderbottom {border-bottom: 1px solid #BBBBBB;}
  .borderbottomTotal {border-top: 2px solid #BBBBBB;}
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
  body[yahoo] .button a {background-color: #ec378c; padding: 15px 15px 13px!important;}
  body[yahoo] .unsubscribe {display: block; margin-top: 20px; padding: 10px 50px; background: #ec378c; border-radius: 5px; text-decoration: none!important; font-weight: bold;}
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
    <table bgcolor="#ffffff" class="content" align="center" cellpadding="0" cellspacing="0" border="0" >
    <tr >
        <td class="borderbottom">
            <table width="100%" bgcolor="#5C595A" border="0" cellspacing="0" cellpadding="0" style="vertical-align: middle;
    text-align: left;">                    				
                <tr>
                    <td style="padding: 0 20px 20px 0; width:100px">
                         <img style="height:70px;width:100px" class="fix" src="{{& logotipo}}" />
                    </td>
                    <td style="color:#fff;">
                    	<h2 >Notificación de Gasto</h2>                       
                        <p> {{nombre_sucursal}} </p>
                        
                    </td>
                </tr>                
            </table>
        </td>
        </tr>      
      <tr>
        <td class="innerpadding ">
          <!-- BODY -->
          
			
            <center>
            	<h2  >#{{movimiento}}</h2>
            </center>
            
		 	<table width="100%" style="background-color:white; " cellspacing="10">
            	
            	<tr>
                    <td><strong>Forma</strong></td>
                    <td>{{forma_pago}}</td>
                </tr> 
                <tr>
                    <td  width="20%"><strong>Fecha/hora</strong></td>
                    <td>{{fecha}}</td>
                </tr>
                <tr>
                    <td  width="20%"><strong>Gasto</strong></td>
                    <td style="background-color:yellow; ">${{monto}}</td>
                </tr>
                             
                 <tr>
                    <td width="20%"><strong>Tipo</strong></td>
                    <td>{{tipo}}</td>
                </tr>
                <tr >
                    <td><strong>Observaciones</strong></td>
                    <td >{{observaciones}}</td>
                </tr>                                              
            </table>
            
            
            <table width="100%" style="background-color:white;" cellspacing="10">
             <tr style="background-color:#E5E5E5; text-align:center;">                    
                    <td style="padding:10px" >Gasto mensual <strong> ${{gasto_mensual}} </strong></td>
             </tr> 
                                                         
            </table>
            






  <!-- Esto es el final del template -->
          <!-- BODY -->
        </td>
      </tr>     
          
      <tr>
      <!-- Color de tema  -->
        <td class="footer" bgcolor="#5C595A">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" class="footercopy">
                &reg; {{nombre_empresa}}<br/>                
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px 0 0 0;">
                <table border="0" cellspacing="0" cellpadding="0">
                 
                  <tr >
       					<td colspan="2"  style="text-align: center; padding: 10px 10px 0 10px;">
                        <a style="text-decoration: none;" href="http://www.softlineas.com">
                        <small style="color:#fff;">http://www.softlineas.com</small> 
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
'

