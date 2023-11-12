var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require("dotenv"); 
const bodyParser = require("body-parser"); 
const Cors = require("cors");   
const passport = require("passport")
var router = require('./routes/index'); 
var Authrouter = require('./routes/Auth'); 
const session = require("express-session"); 
const Sanitize = require('./middleware/Sanitize');

var app = express();
dotenv.config({
  path:path.join(__dirname, './.env')
});

 
app.use(session({secret:"eduallapp", cookie: { maxAge:24 * 60 * 60 * 1000}}))



app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json()); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(Cors({
  credentials:true, 
  origin:'https://eduallsys.com', 
  methods:'GET,POST,DELETE,PUT'
 }));

 
 /*
 app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, GET, DELETE, OPTIONS');
  next();
});
*/


app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(router);
app.use(Authrouter);
app.use(Sanitize());
app.use('/images', express.static(__dirname+'/images'));
app.use('/assets', express.static(__dirname+'/assets'));

 

app.listen(process.env.PORT , function () {
  console.log("Server started at port: 5000");
})

module.exports = app;
