var mysql  = require('mysql');
var connection = mysql.createConnection({
  host:"bbwmy0j6vnqfwlwreg3x-mysql.services.clever-cloud.com", 
  user:"uf3c2i1lgdfrfn9v",
  password:"mY92miw96iMOuJHuWXH9",   
  database:"bbwmy0j6vnqfwlwreg3x",
  port:3306
});
 
connection.connect(); 
  const GetStudents = async(req, res)=>{  
  connection.query('SELECT * FROM eduall_students', function (error, results, fields) {
    if (error){return error;}
      return res.json(results);
  });
 connection.end();
}
 
module.exports = {GetStudents};
