const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();
const configEnv = require('../config/configEnv');

//db desarrollo
/*
const dbParams = {
    user: (process.env.USER_DB || 'pffyesodvpvsrp'),
    host: (process.env.HOST_DB || 'ec2-174-129-242-183.compute-1.amazonaws.com'),
    database: (process.env.DATABASE_NAME || 'd83inhs3bq9ufb'),
    password: (process.env.PASSWORD_DB ||'f4de35950e23261169a79f8ac3007630aaefc8ff887c147b9283a8f68b165019'),
    port: (process.env.PORT_DB ||5432),
    ssl:true
   // ssl: { rejectUnauthorized: false }
};
*/

console.log("================ INIT PARAMS DB ===============");
console.log(`USER ${configEnv.USER_DB}`);
console.log(`HOST ${configEnv.HOST_DB}`);
console.log(`DATABASE_NAME ${configEnv.DATABASE_NAME}`);
console.log(`PASSWORD_DB ${configEnv.PASSWORD_DB}`);
console.log(`PORT_DB ${configEnv.PORT_DB}`);
console.log(`SSL_DB ${configEnv.SSL_DB}`);

const pool = new Pool({
    user: configEnv.USER_DB,
    host: configEnv.HOST_DB,
    database: configEnv.DATABASE_NAME,
    password: configEnv.PASSWORD_DB,
    port: configEnv.PORT_DB,
    max: 10,   
    ssl: configEnv.SSL_DB == 'true' ? { rejectUnauthorized: false } : false
});
/*
const pool = new Pool({
    user: "steifvljsbjelz",
    host: "ec2-52-72-125-94.compute-1.amazonaws.com",
    database: "ddouqvi1mtviob",
    password: "5b1387564423855725fa5fa33c91696d5baf3f4362876a2dc329dcc80e46ebed",
    port: 5432,
    max: 5,    
    ssl: { rejectUnauthorized: false }
});*/

(async function() {
    console.log("====== TESTING DB =========");
    try{
      pool.connect((err, client, release) => {
         if (err) {
            console.log("ERROR al conectar a la db "+err);
            return;
        }
        console.log(" === OK ===");
        client.query('show timezone', (err, result) => {
        release();
        if (err) {
            return console.error('Error executing query', err.stack);
        }
        console.log(result.rows);
        });    
     });

     pool.connect((err, client, release) => {
        if (err) {
           console.log("ERROR al conectar a la db "+err);
           return;
       }
       console.log(" === hora ===");
       client.query('SELECT current_timestamp,current_date,current_time,now()', (err, result) => {
       release();
       if (err) {
           return console.error('Error executing query', err.stack);
       }
       console.log(result.rows);
       });    
    });

}catch(e){
    console.log(e);
}
})();

const knex = require('knex')({
    client: 'pg',
    connection: {
      host : configEnv.HOST_DB,
      port : configEnv.PORT_DB,
      user :  configEnv.USER_DB,
      password :  configEnv.PASSWORD_DB,
      database :configEnv.DATABASE_NAME,
    },
    pool: { min: 0, max: 10 }
  });


module.exports = {
    pool,knex
};