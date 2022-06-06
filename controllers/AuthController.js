const {validateRegister, validateLogin} = require('../config/validation');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = {

    register: async (req, res) => {
     
        let validationError = validateRegister({
            name:req.body.name,
            password:req.body.password,
            email:req.body.email,
            passwordConfirmation:req.body.passwordConfirmation
        }).error

        if(validationError){
           return res.status(401).send({error:validationError.details[0].message})
        }
       
        

       const {name,email,password,passwordConfirmation} = req.body;

       if(passwordConfirmation !== password){
        return res.status(401).send({error:"Password confirmation is wrong, please try again"})
       }



       try{

       
        let user = await User.findOne({email:email}).exec()

        if(user){
            return res.status(401).send({error:"Email already exists"})
        }

       

        const hashedPassword = await bcrypt.hash(password,10)

        
        const registeredUser = new User({name:name,email:email,password:hashedPassword});

        const savedUser = await registeredUser.save();

        res.send(savedUser);
    }catch(err){
        res.status(402).send(err.message);
    }

        //Use a database service to send email

        

    },
    
    login: async(req, res) => {

        let validationError = validateLogin({
            email:req.body.email,
            password:req.body.password,
         
           
        }).error

        if(validationError){
            return res.status(400).send("email and password are required");
        }

      

    try{
        
        
        let user = await  User.findOne({email:req.body.email}).exec()
        if(user){
          
            let truth = await bcrypt.compare(req.body.password,user.password);

           
            if(truth){
                let encrypted = generateAccessToken({id:user._id});
                return res.status(200).send(encrypted);

            }
        }
      
            return res.status(401).send({error:"Invalid Credentials"});
    }catch(err){
        res.status(402).send({error:"DATABASE ERROR"});
    }

      
    
     
    }

    
}

var generateAccessToken = (pass)=>{

    return jwt.sign(pass,process.env.ACCESS_SECRET)

}