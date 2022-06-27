const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
   body: {
        type: String,
        required: true
    },

    //Using reference to post and user since there could technically be infinite comments for post/schema
    //but this will increase read time so in front end we will display comments only if user clicks show comments
    post:{
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        minLength:7
    }

})

module.exports = mongoose.model('User', userSchema)