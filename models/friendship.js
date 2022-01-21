const mongoose = require('mongoose');

const friendshipShema = new mongoose.Schema({
    //Person who sends the request
    from_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //Person to which we make a request
    to_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

},{
    timestamps:true
});


//Create model to be exported
const FriendShip = mongoose.model('FriendShip', friendshipShema);
module.exports = FriendShip;