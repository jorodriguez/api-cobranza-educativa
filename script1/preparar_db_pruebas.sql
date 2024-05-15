

update usuario set password = '$2a$08$XOjFNU1bEQ4YjNm0/jfvJO4CVbqYKy/DZV0B1QtWuwWFcnh2bmKOC', correo = '_'||correo;

update co_alumno set correo = '_'||correo;

update configuracion  set remitente_from = 'Academia Luxy - demo <softlineas.info@gmail.com>' where id = 1;

update configuracion 
set configuracion_correo='
{
      "host":"smtp.gmail.com",
      "port":465,
      "secureConnection":true,
      "auth":{
         "user":"softlineas.info@gmail.com",
         "pass":"@lucilu15"
      },
      "tls":{
         "ciphers":"SSLv3"
      }
   }'
   where id = 1
   
