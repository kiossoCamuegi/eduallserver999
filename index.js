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
const session = require("express-session"); 

var app = express();
dotenv.config({
  path:path.join(__dirname, './.env')
});

 
app.use(session({secret:"eduallapp", cookie: { maxAge:24 * 60 * 60 * 1000}}))

app.use(logger('dev'));
app.use(express.json()); 
app.use(cookieParser());
 


app.use(express.json());
app.use(router); 
 

app.listen(5000 , function () {
  console.log("Server started at port: 5000");
})

module.exports = app;
