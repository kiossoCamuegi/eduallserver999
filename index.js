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



    
const http = require("http");
const { Server } = require("socket.io"); 



var AppServer = express();
dotenv.config({
  path:path.join(__dirname, './.env')
});

 
AppServer.use(session({secret:"eduallapp", cookie: { maxAge:24 * 60 * 60 * 1000}}))



AppServer.use(passport.initialize());
AppServer.use(passport.session());
AppServer.use(logger('dev'));
AppServer.use(express.json()); 
AppServer.use(cookieParser());
AppServer.use(express.static(path.join(__dirname, 'public')));
AppServer.use(Cors({
  credentials:true, 
  origin:'http://localhost:3000/', 
  methods:'GET,POST,DELETE,PUT'
 }));

 

AppServer.use(express.json());
AppServer.use(bodyParser.urlencoded({extended:true}));
AppServer.use(bodyParser.json());
AppServer.use(router);
AppServer.use(Authrouter); 
AppServer.use(Sanitize());
AppServer.use('/images', express.static(__dirname+'/images'));
AppServer.use('/assets', express.static(__dirname+'/assets'));

 

const app = http.createServer(AppServer);
const io = new Server(app); 

io.on("connection", (socket) => {
  console.log(`a user connected ${socket.id}`);
  
  socket.on("send_message", (data) => {
    console.log(data)
    socket.broadcast.emit("receive_message", data);
  });
});
  

app.listen(process.env.PORT , function () {
  console.log("Server started at port: 5000");
})

module.exports = app;



 



 
