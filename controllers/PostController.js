const User = require("../models/User")
const Post = require("../models/Post")
const mongoose = require("mongoose")
module.exports ={
    get:(req, res) =>{
    
        //TODO Validate if user exists

       Post.find({user:mongoose.Types.ObjectId(req.params.id)}).exec().then((posts)=>{
        res.status(200).send({posts:posts})
       }).catch((err) =>res.status(404).send({err:err}))

    },


    newPost:(req, res) =>{

        //TODO Validate if user exists, authorise user first

        const content = req.body.content
        const heading = req.body.heading
        
        let newpost = Post({content: content, heading: heading,comments:[],user:mongoose.Types.ObjectId(req.params.id)})
        
         newpost.save().then((saved) => {
            res.send(saved)
         }).catch((err) => {res.status(401).send(err)});


    }



}