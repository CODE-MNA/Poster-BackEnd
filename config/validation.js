const joi = require('@hapi/joi');


//Validation When User is registering and entering data in form

module.exports.validateRegister = (data) => {

    const requirements =    joi.object(
        {
            name: joi.string().required().alphanum(),
            email: joi.string().email().required(),
            password: joi.string().min(7).custom(includesAllSymbols,"Contains All Symbols"),
            passwordConfirmation: joi.string()
    
        }
    )

 return requirements.validate(data)
    
}

 module.exports.validateLogin = (data) => {

    const requirements = joi.object({
        email: joi.string().required().email(),
       
        password: joi.string().min(7).custom(includesAllSymbols,"Contains All Symbols")
        

    })

    return requirements.validate(data)
}



//Helpers

const includesAllSymbols = (value,helpers) => {
        const numbers = new RegExp("[0-9]");
        const letters = new RegExp("[a-zA-Z]");
        const symbols = new RegExp("[^a-zA-Z0-9]");
        
        if(numbers.test(value) && letters.test(value) && symbols.test(value)){
            return value;
        }else{
            throw new Error("Password should have symbols,letters AND numbers")
        }

    }