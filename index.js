var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); 
const dotenv = require("dotenv"); 
const bodyParser = require("body-parser"); 
const Cors = require("cors");   
const passport = require("passport")
var router = require('./routes/index');  
var Authrouter = require('./routes/Auth'); 
const session = require("express-session");  
const Sanitize = require('./middleware/Sanitize'); 
const MySQLStore = require('express-mysql-session-ci')(session);
 


var app = express();
dotenv.config({
  path:path.join(__dirname, './.env')
});


app.use(passport.initialize()); 
app.use(Cors({credentials:true,  origin:'http://localhost:3000', methods:'GET,POST,DELETE,PUT'}));
app.use(express.json()); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
 

const options = {
 host:"bbwmy0j6vnqfwlwreg3x-mysql.services.clever-cloud.com",  
 user:"uf3c2i1lgdfrfn9v",
  password:"mY92miw96iMOuJHuWXH9",   
 database:"bbwmy0j6vnqfwlwreg3x", 
 port:3306,
  createDatabaseTable: true,
};
 
const sessionStore = new MySQLStore(options);
const expiryDate = new Date(Date.now() + 24 * 60 * 60 * (1000*24*10))

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  maxAge:1000000,
  expires: 1000000,
  cookie: {
    //secure: true,
    //httpOnly: true,
    expires: expiryDate      
}

}));
  
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.use((req, res, next)=>{
  req.session.init = "init";
   console.log(req.session);
   next();
});


app.use(router);
app.use(Authrouter); 
app.use(Sanitize());
app.use('/images', express.static(__dirname+'/images'));
app.use('/assets', express.static(__dirname+'/assets'));

 
 
 
 

app.listen(process.env.PORT , function () {
  console.log("Server started at port: 5000");
})

module.exports = {app, sessionStore};



 



 

 
