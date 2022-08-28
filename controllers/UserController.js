const { ThrowApiError, createApiError, modifyError } = require("../helpers/createApiError")
const { asynchronizeFunction } = require("../middlewares/asynchronizeFunction")
const User = require("../models/User")

var idFunc = (req, res,next) =>{
        
    (req, res,next)=> asynchronizeFunction(
        async ()=>{
            idParam = req.params.id

            // if(!(req.userData.id == idParam)){
             
            //     next(ThrowApiError("Logged in as wrong user",401))
              
            // }
            //Return User with ID id
            
            User.findById(idParam).exec().then(
                (data) =>
                    
                    data ? res.status(200).json(data) : next(ThrowApiError("No user found",404))
                     
                ).catch((err)=> next(ThrowApiError("Couldn't query + " + err,418)))
        })

}

module.exports = {
    get:(req, res,next) =>{
        let queries = req.query
       
        let nameQuery = queries.name

       

        let findingQueries;

        if(queries){
            findingQueries = {name : {$regex:new RegExp(nameQuery) , $options:'i'}}
        }

        //Return All Users in form of Json that exactly match the queries
        User.find(findingQueries).exec().then( (data) => 
        {
            if(data.length == 0 && !findingQueries) return ThrowApiError("No users exist in database",404)
            else if(data.length == 0 && findingQueries && nameQuery === "" &&  Object.keys(queries).length === 1) return ThrowApiError("No users exist in database",404)
            else if(data.length == 0 && findingQueries) return ThrowApiError("No users found based on queries",404)
            res.status(200).json(data)
        }
        ).catch((err) =>
            next(modifyError(err,"Couldn't Query Users from Database",401,false))
        )

    },

    search : (req, res,next) =>{
        res.status(501)
    },

    getById : asynchronizeFunction( async (req,res,next) => {

 
        idParam = req.params.id

        // if(!(req.userData.id == idParam)){
         
        //     next(ThrowApiError("Logged in as wrong user",401))
          
        // }
        //Return User with ID id
        

          const query = User.findById(idParam).exec()
        
          query
                
                .then(async data =>  data ? await res.status(200).json(data) : ThrowApiError("No user found",404))
            .catch( err =>
                {  
            
                  next(  modifyError(err,"Couldn't QUERY",417,false) )   
        })
      
    
              
                 
         
    })
    
}


