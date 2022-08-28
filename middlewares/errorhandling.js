

const errorMiddleware = (err,req,res,next) => {
     
  
        if(typeof err.status != typeof undefined) {

                res.status(err.status).send({message:err.message});
        }else{
                res.status(501).send({message:err.message});

        }
    
    
}


module.exports = {errorMiddleware:errorMiddleware}