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
            res.status(200).send(saved)
         }).catch((err) => {res.status(401).send({error:err})});


    },
    deleteAllPosts:(req, res) =>{
        //Validate that person signed in as user

        if(req.userData._id !== req.params.id){
            return res.status(403).send({error: 'You are not allowed to delete this'})
        }
        Post.deleteMany({user:mongoose.Types.ObjectId(req.params.id)}).exec().then((posts)=>{
            res.status(200).send({posts:posts})
           }).catch((err) =>res.status(404).send({err:err}))
    },

    deleteSingle: (req, res)=>{
        if(req.userData.id !== req.params.id){
            return res.status(403).send({error: 'You are not allowed to delete this',user:req.userData})
        }
        Post.deleteOne({user:mongoose.Types.ObjectId(req.params.id),_id:req.params.postId}).exec().then((post)=>{
            res.status(200).send({post:post,message:`${post.heading} - post deleted`})
           }).catch((err) =>res.status(404).send({err:err}))
        
    }



}