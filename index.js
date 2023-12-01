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
const session = require("cookie-session");  
const Sanitize = require('./middleware/Sanitize'); 
const RandomStrings = require('./config/RandomStrings');

var app = express();
dotenv.config({
  path:path.join(__dirname, './.env')
});


app.use(passport.initialize()); 
app.use(Cors({credentials:true,  origin:'http://localhost:3000', methods:'GET,POST,DELETE,PUT'}));
app.use(express.json()); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
 




app.set('trust proxy', 1) // trust first proxy

const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'http://localhost:3000',
    path: 'foo/bar',
    expires: expiryDate
  }
}))
  
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const sessionStore = null;

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



 



 

 
