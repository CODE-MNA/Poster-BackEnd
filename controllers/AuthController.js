const {validateRegister, validateLogin} = require('../config/validation');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mailer = require('nodemailer');
const { request, response } = require('express');

module.exports = {

    register: async (req, res) => {
     
        let validationError = validateRegister({
            name:req.body.name,
            password:req.body.password,
            email:req.body.email,
            passwordConfirmation:req.body.passwordConfirmation
        }).error

        if(validationError){
           return res.status(401).send({message:validationError.details[0].message})
        }
       
        

       const {name,email,password,passwordConfirmation} = req.body;

       if(passwordConfirmation !== password){
        return res.status(401).send({message:"Password confirmation is wrong, please try again"})
       }

       let savedUser = {}

       try{

       
        let user = await User.findOne({email:email}).exec()

        if(user){
            
            //email


            return res.status(401).send({message:"Email already exists"})
        }



        


        const hashedPassword = await bcrypt.hash(password,10)

        
        const registeredUser = new User({name:name,email:email,password:hashedPassword,confirmed:false});

        savedUser = await registeredUser.save();
    }catch(err){
        return res.status(402).send({message:err.message});
    }
    


        let errorMail = await ProcessMail(savedUser)
        //------------------------------------------------------------------------------------------------
    console.log(errorMail)
        res.status(200).send({user:savedUser,mailError:errorMail});


   

      
        

    },
    
    login: async(req, res) => {

        if (req.headers.authorization){
            return res.status(403).send({message: 'Already logged In'})
        }
        let validationError = validateLogin({
            email:req.body.email,
            password:req.body.password,
         
           
        }).error

        if(validationError){
            return res.status(403).send({message:"Invalid Credentials"});
        }

      

    try{
        
        
        let user = await  User.findOne({email:req.body.email}).exec()

        
        if(user){

            if(user.confirmed === false){

                let errEmail = await ProcessMail(user)

                if(errEmail === ""){
                    


                    res.status(400).send({message:"User Not Activated, sending verification email"});
                }else{
                    res.status(400).send({message:"User Not Activated, couldn't send verification email"});

                }


             return
            }
          
            let truth = await bcrypt.compare(req.body.password,user.password);

           
            if(truth){
                let encrypted = generateAccessToken({id:user._id});
                let returnToken = user.refreshToken

                try{
                   let id =  jwt.verify(user.refreshToken,process.env.REFRESH_SECRET)
                }catch(e){
                    if(e.expiredAt || user.refreshToken === undefined || user.refreshToken === ""){
                      returnToken =  generateRefreshToken({id:user._id})
                     user.refresh = returnToken
                      await user.save()
                    }
                }
                let returnUser = {
                    _id:user._id,
                    email:user.email,
                    name:user.name,
                    confirmed:user.confirmed
                }
                return res.status(200).send({token:encrypted,userData:returnUser,reloggerToken:returnToken});

            }
        }
      
            return res.status(401).send({message:"Invalid Credentials"});
    }catch(err){
        res.status(402).send({message:"DATABASE ERROR"});
    }

      
    
     
    },

    //Kinda useless cuz in this api we always searching db so not used for now..
    refresh: async (req, res) =>{        
        

        //Find one where REFRESH TOKENS MATCH (DATABASE AND COOKIES)
       const user = await User.findOne({refresh:req.body.token}).exec() ;
       
       try{
           
         let userData = jwt.verify(user.refresh,process.env.REFRESH_SECRET)
         const newAccesssToken = generateAccessToken({id:userData.id})

         let returnUser = {
             _id:user._id,
             email:user.email,
             name:user.name,
             confirmed:user.confirmed
         }
         
        return res.status(200).send({refresh:true,token:newAccesssToken,userData:returnUser})
 
       }catch(e){
            return res.status(401).send({message:"Please Log in Again",refresh:false})
       }
       
 
    },

    logout:(req, res,next)=>{

      
    },

    verify:  (req, res,next) =>{
        const activationToken = req.params.activationToken
        const activatedID = jwt.verify(activationToken,process.env.VERIFY_SECRET)

        User.findById(activatedID.id).exec().then(async (user) =>{
            if(user){
                user.confirmed = true
                user.refreshToken = generateRefreshToken({id:user.id})
                await user.save()

                res.status(200).send(`<h2>POSTER BACKEND</h2> <br> <p>You successfully verified your account, You can now close this window and login.</p>`)
            }else{
                res.status(400).send(`<h2>POSTER BACKEND</h2> <br> <p>Verification failed, Please Try logging again if you require the link again and try verification with a valid link. .</p>`)
            }
        }).catch(err =>{
            console.log(err.message)
            next(err)
        })

    },

    checkToken: (req, res,next) => {
        return res.status(200).send({message:"Token is valid"})
    }
    
}

var generateAccessToken = (pass)=>{
   
    return jwt.sign(pass,process.env.ACCESS_SECRET,{expiresIn: "2h"})

}

var generateRefreshToken = (payload)=>{
    return jwt.sign(payload,process.env.REFRESH_SECRET,{expiresIn:"60d"})
}

var appendRefreshCookie = (res,refreshToken)=>{

    jwt.verify(refreshToken,process.env.REFRESH_SECRET)

  
}


var ProcessMail = async (user)=>{
    
    const gmailMailer = mailer.createTransport({
        service:"gmail",
        port:465,
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAILPASS
        },
        host:'smtp.gmail.com',
       tls:{
        rejectUnauthorized:true
       }
    })

   const signed =  jwt.sign({id : user._id},process.env.VERIFY_SECRET,{expiresIn:"1h"})

   const verifyURL = `${process.env.PUBLIC_URL}/auth/verify/${signed}`

    let errorMail = "";

    gmailMailer.sendMail({
        from: "Poster Activator"+ " " + process.env.EMAIL,
        to:user.email,
        subject:"Activate your Poster Account",
        text:"do something",
        html:`<h2>Welcome to Poster</h2><br><p>Thank you, ${user.name} for signing up!</p><p><a href=${verifyURL}> Click here to activate your Poster Account</a></p>`
    }).catch(err => {

      errorMail = err.message

      
      
      console.log(errorMail)
    })

    return errorMail;

}