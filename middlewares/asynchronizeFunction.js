


//Takes function (actual code to do), calls it in try block and catches errors and pass them down the chain
//DO NOT THROW ERRORS IN YOUR CATCH BLOCK
const asynchronizeFunction =   (func )=>{

    //An async middleware which calls the function u pass it
    
  
        return async function(req,res,next) {
        
        
            try{
    
                await func(req,res,next)
                
             }catch(err){
                next(err)
             }
         
         
        }
   
  
}



// (req,res) => res.send(200)
module.exports.asynchronizeFunction = asynchronizeFunction