const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

//Tell the passport to use the new library
passport.use(new googleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_callback_url
    },

    function(accessToken,refreshToken, profile,done){
        //Find a user
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){console.log("Error in google strategy passport",err);return;}

            console.log(profile);

            if(user){
                //If found set this user as req.user
                return done(null,user);
            }else{
               //IF not found then create that user and se it as req.user
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex')
                },function(err,user){
                    if(err){console.log("Error in  creating user",err);return;}
                    return done(null,user);
                });
            }
        });
    }

));

module.exxports = passport;