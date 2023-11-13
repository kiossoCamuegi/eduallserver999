var express = require('express');
var router = require('./routes/index');  
var app = express();
 
app.use(express.json()); 
app.use(router); 
 

app.listen(5000 , function () {
  console.log("Server started at port: 5000");
})

module.exports = app;
