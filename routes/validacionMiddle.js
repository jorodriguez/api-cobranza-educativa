const handle = require('../helpers/handlersErrors');

const validarSchema = async(request,response,next,schema)=>{

    try{         
        const body = request.body;
        await schema.validateAsync(body);
        next();
    }catch(e){
        handle.callbackError(e, response);
    }
}

modules.exports={
    validarSchema
}