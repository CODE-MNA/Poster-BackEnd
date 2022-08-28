const User = require("../models/User")
const Post = require("../models/Post")
const mongoose = require("mongoose")
const {ThrowApiError} = require("../helpers/createApiError")
module.exports ={
    get:(req, res) =>{
    
        //TODO Validate if user exists
     
       Post.find({user:mongoose.Types.ObjectId(req.params.id)}).exec().then((posts)=>{
       res.status(200).send({posts:posts.reverse()})
       }).catch((err) =>res.status(404).send({err:err}))

    },


    newPost:(req, res,next) =>{

        //TODO Validate if user exists, authorise user first

        const content = req.body.content
        const heading = req.body.heading
        
        let newpost = Post({content: content, heading: heading,comments:[],user:mongoose.Types.ObjectId(req.params.id)})
        
         newpost.save().then((saved) => {
            res.status(200).send(saved)
         }).catch(err=>next(err));


    },
    deleteAllPosts:(req, res) =>{
        //Validate that person signed in as user

        if(req.userData._id !== req.params.id){
            return res.status(403).send({message: 'You are not allowed to delete this'})
        }
        Post.deleteMany({user:mongoose.Types.ObjectId(req.params.id)}).exec().then((post)=>{
            if(post.acknowledged) return res.status(200).send({message:`${post.deletedCount} posts deleted.`})
           }).catch((err) =>res.status(404).send({message:err}))
    },

    deleteSingle: (req, res)=>{
        if(req.userData.id !== req.params.id){
            return res.status(403).send({message: 'You are not allowed to delete this',user:req.userData})
        }
        Post.deleteOne({user:mongoose.Types.ObjectId(req.params.id),_id:req.params.postId}).exec().then((post)=>{
            if(post.deletedCount === 0) return ThrowApiError("Post doesn't exist",404)
            if(post.acknowledged){
                res.status(200).send({message: `post deleted`})

            }
           }).catch((err) =>res.status(404).send({message:err}))
        
    }



}