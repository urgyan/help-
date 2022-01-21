const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');


module.exports.toggleLike = async function(req,res){
    
    
    try{
        let likeable;
        let deleted = false;

        //Check the type of request for like
        if(req.query.type=='Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        //check that like exist or not
        let existingLike = await Like.findOne({
            user:req.user._id,
            likeable:req.query.id,
            onModel:req.query.type
        });


        //if there is an existing like we simply remove it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted = true;
           

        }else{
            
            let newLike = await Like.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type
            });
            
            likeable.likes.push(newLike._id);
            likeable.save();
        }
        

  
        return res.status(200).json({
            data:{
                deleted:deleted
            },
            message:"Request Succeddfull!!"
        });
        
        
        

    }catch(err){
        

        return res.status(500).json({
            message:"Internal Servor error!!"
        });
    }
   
}