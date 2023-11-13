const express = require("express"); 
const path = require('path');
const router = express.Router();
 
router.get("/", (req, res)=>{
   res.send("Hello my greatest friennds !");
})

module.exports =  router;
