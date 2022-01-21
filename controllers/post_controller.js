const Post = require('../models/post');
const Comment = require('../models/comment');
const Likes = require('../models/like');

//Post controller
module.exports.createPost = async function(req,res){
    // console.log(req.body);
    // console.log(req.user._id);
    // return res.redirect('/');
        try{
            
            let post = await Post.create({
                content:req.body.content,
                user:req.user._id,
                
            });
            await post.populate('user');
            

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post:post,
                    },
                   
                    message:"post created!",
                    name:req.user.name
                });
            }

            return res.redirect('/');
        }catch(err){
            req.flash('error','Some error in post');
            console.log("Error",err);
        }
        
}

//Controller to delete comments using params
module.exports.destroy = async function(req,res){

    try{
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id){

            //Deleted the associated likes and all its comment too
            await Likes.deleteMany({likeable:post, onModel:'Post'});
            await Likes.deleteMany({_id:{$in: post.comments}});

            post.remove();
    
            await Comment.deleteMany({post:req.params.id});

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    message:"Post deleted!!",
                    name:req.user.name
                })
            }

          
            return res.redirect('back');
        }else{
            req.flash('error','You cannot delete this post!!');
            console.log("post user and deleted user not matched")
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error',err);
        console.log("Error in logout");
        return res.redirect('back');
    }
    
}