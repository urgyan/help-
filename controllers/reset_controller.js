//sending the access token by mail to reset the password
const resetPassword = require('../models/reset_password');
const User = require('../models/user');
const crypto = require('crypto'); 
const resetMailer = require('../mailers/reset_password_mailer');
let queue = require('../config/kue');

module.exports.sendToken = async function(req,res){
    // return res.redirect('/')
    console.log(req.body.email)
    try{
        let user =await User.findOne({email:req.body.email});
        //If user is not there
        if(!user){
            console.log("The user is not registered yet please registered !!");
            return;
        }

        //If user is there then create or add data to the database
        let resettoken = await resetPassword.create({
            user:user.id,
            accesstoken:crypto.randomBytes(20).toString('hex'),
            isvalid:true
        });
        await resettoken.populate('user')
        console.log("TIll model everything is fine")
        resetMailer.newToken(resettoken);

        return res.render('validate_access_token',{
            token:resettoken.accesstoken,
            user:resettoken.user.email,
            title:'mail sent'          
        });
    }catch(err){
        console.log("There is an error in reset controller");
        return;
    }

}


//validate the token
module.exports.validateToken = async function(req,res){
    try{
       

        //This is used to remove the extra spaces in access token
        newsendtoken = req.body.sendtoken.replace(/\s+/g,'');
        
        //VALIDATE THE TOKEN GENERATED AND SEND TO THE MAIL
        if(req.params.id == newsendtoken){
            console.log('Validate successfull!!');
            let resetToken =await resetPassword.findOne({accesstoken:req.params.id});

            return res.render('password_reset',{
                token:resetToken,
                title:"Reset password"
            })

        }else{
            console.log('Not validate');
            return;
        }



    }catch(err){
        console.log("There is an error in validating the token in reset controller")
        return;
    }
}

//Update password 
module.exports.changePassword =async function(req,res){

    try{
        let resetToken =await resetPassword.findOne({accesstoken:req.params.id});
        console.log(resetToken.user)
        let user = await User.findById(resetToken.user);
      

        if(req.body.password != req.body.confirm_password){
            console.log("Passwords do not match!!");
            req.flash('error','Passwords do not match');
            res.redirect(`/user/password_reset/${resetToken.accesstoken}`);
        }else{
            console.log(user);
            console.log("password matched!!");
            console.log(req.body.password,user.password);
            user.password = req.body.password;
            user.save();
            resetToken.isvalid=false;
            resetToken.save();
            req.flash('success','Password changed');
            return res.redirect('/user/sign-in');

        }


    }catch(err){
        console.log("There is an error in reset password in changepassword controller!");
        return;
    }

}