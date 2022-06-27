const User = require("../models/User")

module.exports = {
    get:(req, res) =>{
        let queries = req.query
       
     

        //Return All Users in form of Json
        User.find(queries).exec().then( (data) => 
        {
            if(data.length == 0) return res.status(200).json({message: "no users found"})
            res.status(200).json(data)
        }
        ).catch((err) =>
            res.status(403).json({error:"Couldn't Query Users, : " + err}),
        )

    },

    getById : (req, res) =>{
        
        idParam = req.params.id

        if(!(req.userData.id == idParam)){
            return res.status(401).json({error:"Logged in as wrong user"})
        }
        //Return User with ID id
        User.findById(idParam).exec().then(
            (data) => res.status(200).json(data)
            ).catch((err)=>
                res.status(403).json({error:"Error occured querying database - " + err})
            )
    }
}

