const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
   body: {
        type: String,
        required: true
    },
    user:{
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true
    },
    comments: {
        type: [mongoose.Types.ObjectId],
        required: true,
        minLength:7
    }

},{
    timestamps: true
})

module.exports = mongoose.model('Post', postSchema)