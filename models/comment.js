const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    //Comments belong to a user
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //Comment is done on some user
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Like'
        }
    ]
},{
    timestamps:true
});

const Comment = mongoose.model("Comment",commentSchema);

module.exports = Comment;