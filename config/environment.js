const dotenv = require('dotenv');
dotenv.config();


const development = {
    name:'development',
    asset_path:'./assets',
    session_cookie_key:'something',
    db:'chatter_devlopment',
    smtp:{
        service:'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'vaid77167@gmail.com', // generated ethereal user
          pass: 'ktkpyidzgcrxfuyl', // generated ethereal password
        }
    },
    google_client_id:"1047602371675-5gshghk4836bq8l97j81lscp1n0vl55i.apps.googleusercontent.com",
    google_client_secret:"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",
    google_callback_url:"http://localhost:8000/user/auth/google/callback",
    jwt_secret_key:'chatter'

}

const production = {
    name:'production',
    asset_path:process.env.CHATTER_ASSET_PATH,
    session_cookie_key:process.env.CHATTER_SESSION_SECRET_KEY,
    db:process.env.CHATTER_DB,
    smtp:{
        service:'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.CHATTER_GMAIL_USERNAME, // generated ethereal user
          pass: process.env.CHATTER_GMAIL_PASS, // generated ethereal password
        }
    },
    google_client_id:process.env.CHATTER_GOOGLE_CLIENT_ID,
    google_client_secret:process.env.CHATTER_GOOGLE_CLIENT_SECRET_KEY,
    google_callback_url:process.env.CHATTER_GOOGLE_CLIENT_CALLBACK_URL,
    jwt_secret_key:process.env.CHATTER_JWT_SECRET_KEY
}

console.log(process.env.CHATTER_ENVIRONEMENT)
// console.log( eval(echo CHATTER_ENVIRONEMENT) == undefined ? development : eval(echo CHATTER_ENVIRONEMENT))
// development
// eval(process.env.CHATTER_ENVIRONEMENT) == undefined ? development : eval(process.env.CHATTER_ENVIRONEMENT);
module.exports =eval(process.env.CHATTER_ENVIRONEMENT) == undefined ? development : eval(process.env.CHATTER_ENVIRONEMENT); ;