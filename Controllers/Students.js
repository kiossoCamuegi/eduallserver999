const { DATABASE } = require("../config/Database"); 

  const GetStudents = async(req, res)=>{  
   const  query = `SELECT * FROM eduall_students`;
   const PARAMS = [];
     DATABASE.query(query, PARAMS, (err, rows)=>{ 
          console.log(err)
        if(err) return res.status(400).json({status:300, success:false, msg:err});
        return res.json(rows);
     });
}

 
module.exports = {GetStudents};
