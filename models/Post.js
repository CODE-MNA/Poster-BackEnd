const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    heading: {
        type: String,
        required: true,
        maxLength:70

    },
   content: {
        type: String,
        required: true
    },
    user:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    comments: {
        type: [mongoose.Types.ObjectId],
        required: true,
    },
    likes:{
        type:Number,
        required: true
    }

},{
    timestamps: true
})

module.exports = mongoose.model('Post', postSchema)