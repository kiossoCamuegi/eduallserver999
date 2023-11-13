
const mysql = require("mysql"); 
 
let DATABASE = mysql.createConnection({
  host:"bbwmy0j6vnqfwlwreg3x-mysql.services.clever-cloud.com", 
  user:"uf3c2i1lgdfrfn9v",
  password:"mY92miw96iMOuJHuWXH9",   
  database:"bbwmy0j6vnqfwlwreg3x", 
  port:3306
});
module.exports =  {DATABASE};
 
 
