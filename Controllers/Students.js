const { DATABASE } = require("../config/Database"); 

   DATABASE.connect();
  const GetStudents = async(req, res)=>{  
  const  query = `SELECT * FROM eduall_students`;
  DATABASE.query(query, params,  function (error, results, fields) {
      if (error){return res.json(error)}
      return res.json(results);
  });
 DATABASE.end();
}
 
module.exports = {GetStudents};
