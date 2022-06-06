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
    }

})

module.exports = mongoose.model('User', userSchema)