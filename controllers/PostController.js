const User = require("../models/User")
const Post = require("../models/Post")
const mongoose = require("mongoose")
module.exports ={
    get:(req, res) =>{
        

       Post.find({user:req.params.id}).exec().then((posts)=>{
        res.status(200).send({posts:posts})
       }).catch((err) =>res.status(404).send({err:err}))

    },


    newPost:(req, res) =>{

    }



}