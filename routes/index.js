const express = require("express"); 
const router = express.Router();
 const {GetStudents} = require("../Controllers/Students");

router.get("/", (req, res)=>{
   res.send("Hello my greatest friennds !");
})

router.get('/eduallstudentsapi/get', GetStudents);

module.exports =  router;
