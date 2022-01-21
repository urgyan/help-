const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const commentsMailer = require('../mailers/comment_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Likes = require('../models/like');

module.exports.create = async function(req, res){

    try{
   
        let post = await Post.findById(req.body.post);


        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();
            await comment.populate('user', 'name email avatar')
           
            let job =  queue.create('emails',comment).save(function(err){
                if(err){
                    console.log("Error in creating queue");
                    return;
                }

                console.log('job enqueued',job.id);
            });
            commentsMailer.newComment(comment);
            if (req.xhr){
                
                
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }


            req.flash('success', 'Comment published!');

            res.redirect('/');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}



//Deletion of comment 
module.exports.destroy = async function(req,res){

    try{
        let comment =await Comment.findById(req.params.id );
        let user = await User.findById(req.user.id);
    
        if(comment.user == req.user.id || user.id == req.user.id){
            let postId = comment.post;
            comment.remove()
            let post = await Post.findByIdAndUpdate(postId,{$pull:{comments: req.params.id}});
            
            await Likes.deleteMany({likeable:comment._id ,onModel: 'Comment' });
        }

        if(req.xhr){
            return res.status(200).json({
                data:{
                    comment_id:req.params.id
                },
                message:"Yeah am deleting the comment",
                name:req.user.name
            })
        }

        req.flash('success','Comment is deleted');
        return res.redirect('back');

    }catch(err){
        req.flash('error','You are not authorized!!');
        return res.redirect('back');
    }

    
}