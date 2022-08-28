const jwt = require('jsonwebtoken');

 module.exports =
 (req, res, next) => {
    if(!req.headers.authorization) return res.status(401).send({message: 'Could not authorise user : No Authentication details were received'})
    try {
        const token = req.headers.authorization.split(' ')[1];
      
        req.userData = jwt.verify(token,process.env.ACCESS_SECRET);
        

        next();
    }catch(err) {

       if(err.expiredAt){
        
           return res.status(400).send({tokenExpired:true,message:"Refresh Page.."})

      
  
       }

       if(err)
     
        return res.status(401).json({message:"Could not authorise user : " + err})
    }
  

    

}