const handle = require('../helpers/handlersErrors');

class ControllerBase {

    constructor(service){  
        console.log("INIT SERVICE "+service)       
        this.service = service;          
    

   // this.validar = ()=> { if(this.service == ''){ throw "La tabla no esta definida" }};
   
    this.insert = async (request, response)=>{
        try {
               const body = request.body;
               
               const results = await this.service.insert(body);              
               
               response.status(200).json(results);

        } catch (e) {
            console.log(e);
            handle.callbackErrorNoControlado(e, response);
        }
    }

    this.update = async(request, response )=>{
        //id,modelData
        try {
            const body = request.body;

            const id = request.params.id;
            
            const results = await this.service.update(id,body);              
            
            response.status(200).json(results);

     } catch (e) {
         console.log(`UPDATE CRUD ERROR ${e}`);
         handle.callbackErrorNoControlado(e, response);
     }
    }

    this.remove = async (request, response )=>{
        //id,genero
        try {
            const {id} = request.body;

            const genero = request.params.genero;
            
            const results = await this.service.remove(id,genero);              
            
            response.status(200).json(results);

     } catch (e) {
        console.log(`REMOVE CRUD ERROR ${e}`);
         handle.callbackErrorNoControlado(e, response);
     }
    }

    this.findAll = async (request, response )=>{
        try {      
                       
            const results = await this.service.findAll();              
            
            response.status(200).json(results);

     } catch (e) {
        console.log(`FINDALL CRUD ERROR ${e}`);
         handle.callbackErrorNoControlado(e, response);
     }        
    }

    this.findById = async (request, response )=>{
        //id
        try {      
                  
            const id = request.params.id;

            const results = await this.service.findById(id);              
            
            response.status(200).json(results);

        } catch (e) {
            console.log(`FIND_BY_ID CRUD ERROR ${e}`);
            handle.callbackErrorNoControlado(e, response);
        }        
    }
    }   
}

module.exports = ControllerBase;

