const { DATABASE } = require("../config/Database"); 

  const GetStudents = async(req, res)=>{  
   const  query = `SELECT * FROM eduall_students LEFT JOIN eduall_class  ON eduall_students.ed_student_class =  eduall_class.ed_class_id  
   LEFT JOIN eduall_cicles ON ed_cicle_id = eduall_class.ed_class_cicle  WHERE ed_student_deleted = 0  ORDER BY ed_student_name ASC`;
   const PARAMS = [];
     DATABASE.query(query, PARAMS, (err, rows)=>{ 
          console.log(err)
        if(err) return res.status(400).json({status:300, success:false, msg:err});
        return res.json(rows);
     });
}

 
module.exports = {GetStudents};
