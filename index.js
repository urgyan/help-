const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const env = require('./config/environment');
const app = express();
require('./config/view_helpers')(app);
const port = process.env.PORT || 8000;
const cookieParser = require('cookie-parser');

//Importing the express layouts
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//Import express session for encryption of session cookie
const session = require('express-session');
const passport = require('passport');

//Passport strategy importing
const passportLocal = require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy');
const passportGoogleAuth = require('./config/passport-google-oauth2-strategy');

//Importing the connect mongo for storing the session cookie
const MongoStore = require('connect-mongo');

//Import sass middle wear for styling
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

//Socket.io code
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log("Chat server is listening ar port 5000");
const path = require('path');


//using scss middleware
if(env.name == 'development'){
    app.use(sassMiddleware({
        src:path.join(__dirname,env.asset_path,'/scss'),
        dest:path.join(__dirname,env.asset_path,'/css'),
        debug:true,
        outputStyle:'expanded',
        prefix:'/css'
    }));                                                    
}
app.use(cookieParser());
//use the express layouts before it work with routes
app.use(expressLayouts);
//set up static files
app.use(express.static(env.asset_path));
//make the upload folder used by browser
app.use('/uploads',express.static(__dirname+'/uploads'));
//To decoded the post request we use urlencoded
app.use(express.urlencoded({extended:false}));


//set up the way to handle substyle and scripts in our html file
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//Setup the view engine
app.set('view engine','ejs');
app.set('views','./views');

//mongo store is used to strore the session cookie in db
app.use(session({
    name: 'Chatter',
    //Todo before deployment
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave:false,
    cookie:{
        maxAge: (1000*60*100)
    },
    store: MongoStore.create(
        {
        // mongooseConnection: db,
        mongoUrl:'mongodb://localhost/chatter_devlopment',
        autoRemove: 'disabled'
    },
    function(err){
        console.log(err || "Connect-mongodb setup store");
    }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//app use flash
app.use(flash());
app.use(customMware.setFlash);

//Use express router 
app.use('/',require('./routes'));


app.listen(port,(err)=>{

    if(err){
        console.log(`Error occurs on running the server: ${err}`);
        return ;
    }

    console.log(`The server is up and running on port: ${port}`);
    
});