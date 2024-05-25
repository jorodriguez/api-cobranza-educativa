
const { QUERY,getCatalogo } = require('./sqlHelper');

const getFormasPago = (request, response) => {
    console.log("@getFormasPago");    
    getCatalogo(QUERY.FORMA_PAGO,response);              
};

const getCatGeneroFamiliar = (request, response) => {
    console.log("@getCatGeneroFamiliar");       
    getCatalogo(QUERY.CAT_GENERO_FAMILIAR,response);
};

const getCatGeneroAlumno = (request, response) => {
    console.log("@getCatGeneroAlumno");       
    getCatalogo(QUERY.CAT_GENERO_ALUMNO,response);
};

// esquema pago
const getCatEsquemaPago = (request, response) => {
    console.log("@getCatEsquemaPago");       
    getCatalogo(QUERY.CAT_GENERO_ALUMNO,response);
};


module.exports = {
    getCatalogo,
    getFormasPago,
    getCatGeneroFamiliar,    
    getCatGeneroAlumno,   
    getCatEsquemaPago 
  
}