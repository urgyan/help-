const FriendShip = require('../models/friendship');
const Post = require('../models/post');
const User = require('../models/user');


//NOW HERE WE HAVE USER OBJECT ID BUT WE WANT THE INFORMATION RELATED TO THAT OBJECT ID FOR THAT WE HAVE TO CHECK IN THE USER MODEL AND SEARCH FOR THE USER ID AND FETCH DATA FROM THERE . IN MONGOOSE WE HAVE A CONCEPT OF POPULATING WHICH WE USED HERE
//Here we convert our code in asynchronous code
module.exports.home = async function(req,res){
    
    try{
        // CHANGE :: populate the likes of each post and comment
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: [
                {
                    path: 'user'
                },
                {
                    path: 'likes'
                }
            ]
        }).populate('likes')
        
        let currUser;
        if(req.user){
            currUser =await User.findById(req.user._id)
            .populate('friendShips')
        }

        // console.log(currUser.friendShips);
        // currUser.friendShips.splice(0, currUser.friendShips.length);
        // currUser.save();
        let users = await User.find({});
        
        
        
        return res.render('home', {
            title: "Chatter | Home",
            posts:  posts,
            all_users: users,
            currUser:currUser
        });
    }catch(err){
        console.log('There is an error in the servor',err);
        return;
    }
 
};
