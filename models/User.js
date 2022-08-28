const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
   name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength:7
    },
    confirmed:{
        type: Boolean,
        required: true,
        default: false
        
    },
    refresh: {
        type: String,
        required: false
    }

})

module.exports = mongoose.model('User', userSchema)