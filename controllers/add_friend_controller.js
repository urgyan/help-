const FriendShip = require('../models/friendship');
const User = require('../models/user');

module.exports.addFriend =async function(req,res){


    try{
        //console.log(req.user.id);
        let toggle;
        let friendId = req.query.id;
        let friend = await FriendShip.findOne({from_user:req.user.id , to_user:req.query.id});
        // console.log(friend)
        if(friend!=null){
            toggle = 0;
            let index=req.user.friendShips.indexOf(req.query.id);
            // console.log(index);
            req.user.friendShips.splice(index,1);
            req.user.save();
            await FriendShip.deleteOne({"_id": friend._id});
        }else{

            console.log("Am here");
            toggle = 1;
            
            let friend=await FriendShip.create({
                from_user:req.user.id,
                to_user:req.query.id
            });
            req.user.friendShips.push(req.query.id);
            req.user.save();
        } 

        return res.status(200).json({
            data:{
                toggle:toggle,
                friendId:friendId
            },
            message:"Request Succeddfull!!"
        });


    }catch(err){
        if(err){
            console.log("There is an error in friendship controller",err);
            return res.status(500).json({
                message:"Internal Servor error!!"
            });
        }
    }


}