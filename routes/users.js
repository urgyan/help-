const express = require('express');
const router = express.Router();
const user = require('../controllers/user_controller');
const post = require('../controllers/post_controller');
const passport = require('passport');
const reset = require('../controllers/reset_controller');
console.log("Am user controllers")

router.get('/profile/:id',passport.checkAuthentication,user.profile);
router.post('/update-profile/:id',passport.checkAuthentication,user.update);

//ROute to the user signin and signup page
router.get('/sign-up',user.signUp);
router.get('/sign-in',user.signIn);


//Module for create user and login user
router.post('/create',user.create);


router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/user/sign-in'},
), user.createSession);

//create route for google auth
router.get('/auth/google',passport.authenticate('google',{scope:['profile' , 'email']}));
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/user/sign-in' },
  ),user.createSession);

router.get('/sign-out',user.destroySession);

//Forget password
router.get('/reset-password',user.resetPasswordForm);
router.post('/mail-accessToken',reset.sendToken);
router.post('/reset-password-page/:id',reset.validateToken);
router.post('/confirm-change/:id',reset.changePassword);

module.exports = router;