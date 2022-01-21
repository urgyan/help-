const User = require('../models/user');
const fs = require('fs');
const path = require('path');

// let's keep it same as before
module.exports.profile = async function(req,res){

    try{
        let user = await User.findById(req.params.id)
    
        return res.render('profile',{
            title:"Profile",
            user_profile:user
            
        });
    }catch(err){
        console.log('There is an error in profile loading',err);
        return;
    }

    
    
}

module.exports.update = async function(req, res){
   

    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            User.uploadAvatar(req, res, function(err){
                if (err) {console.log('*****Multer Error: ', err)}
                
                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file){

                    if (user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }


                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/user/profile');
    }


    return res.render('sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/user/profile');
    }
    return res.render('sign_in', {
        title: "Codeial | Sign In"
    })
}

//Taking user data and add up in database to make it signup
module.exports.create =async function(req,res){
    //validadting user password
     if(req.body.password != req.body.confirm_password){
        return res.redirect("back");
    }
 
    try{
         let user = await User.findOne({email:req.body.email})
         if(!user){
                 User.create(req.body,function(err,user){
                     
                     if(err){console.log("There is an error in creating user in database the user email",err); return; }
                     req.flash('success','Data is saved successfully in database');
                     return res.redirect('/user/sign-in');
                 });
             }else{
                 req.flash('error','Data is not correct!!');
                 return res.redirect("back");
             }
    }catch(err){
         req.flash('error','Data is not correct!!');
        console.log('There is an error in create person db',err)
    }
 
    
 }
//used to create sessionn
module.exports.createSession = function(req,res){
    req.flash('success','Logged in Successfully');
    return res.redirect('/');
}

//Destroy the session or sign pout
module.exports.destroySession = function(req,res){
    req.flash('success','Logged out Successfully');
    req.logout();
    return res.redirect('/');
}


//Reset password form link
module.exports.resetPasswordForm = function(req,res){
    return res.render('resetform',{
        title:'Title password'
    });
}