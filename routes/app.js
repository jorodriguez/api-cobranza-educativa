const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { pool } = require('../db/conexion');
const port = process.env.PORT || 5000;

//version/branch

const version = "2402-reportes opcion de reporte";

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Origin,Accept,Authorization,x-access-token'); // If needed	
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    next();
});

app.get('/', (request, response) => {
    console.log(process.env);
    console.log("=====================");
    //console.log(JSON.stringify(pool));
    response.json({ info: `Instituto paris ${version} (env:${process.env.ENV})` });
});

app.listen(port, () => {
    console.log(`App corriendo en el puerto ${port} ${version} (env:${process.env.ENV})`);
});


module.exports = app;