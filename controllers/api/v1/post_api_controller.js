const Post = require('../../../models/post'); 
const Comment = require('../../../models/comment');
module.exports.post =async function(req,res){

    let posts = await Post.find({})
    .sort('-createdAt')
    .lean().populate('user','_id email name')
    .populate({
        path:'comments' ,
        populate:{
            path:'user'
        }
    })


    return res.json({
        message:"All post is there",
        post: posts
    });
}




module.exports.destroy = async function(req,res){

    try{
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id){
            post.remove()
    
            await Comment.deleteMany({post:req.params.id});

           return res.json(200,{
               message:"post and associated comments deleted"
           });
        }else{
            return res.json(401,{
                message:"You are unauthorized to delete that post!!"
            });
        }
    }catch(err){
        // req.flash('error',err);
        console.log("Error in logout");
        // return res.redirect('back');
        return res.json(500,{
            message:"Internal servor error"
        });
    }
    
}