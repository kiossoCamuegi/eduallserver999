const CheckInternet = require("../config/CheckInternet");
const { DB_SQLITE, DATABASE } = require("../config/Database"); 
const { GetCurrentUserData } = require("./GetCurrentUserData");
 

const DATABASERUN = (res, query, params, type)=>{
   try { 
      if(CheckInternet() === true){  
         if(type === 0){
            DATABASE.query(query, params, (err, rows)=>{ 
               if(err) return res.status(300).json({status:300, success:false, error:err});;
               return res.json(rows);
            });
         }else{
            DATABASE.query(query, params , (err)=>{ 
               if(err) return res.status(300).json({status:300, success:false, error:err});;
               return res.json("success");
             }); 
         } 
      }else{  
         if(type === 0){
            DB_SQLITE.all(query, params, (err, rows)=>{ 
               if(err) return res.status(300).json({status:300, success:false, error:err});;
               return res.json(rows);
            }); 
         }else{
            DB_SQLITE.run(query, params , (err)=>{ 
               if(err) return res.status(300).json({status:300, success:false, error:err});;
               return res.json("success");
           }); 
         } 
      } 
   } catch (error) {
      res.status(400).json(error); 
   }  
}
 


const GetStudentTransferences = async(req, res)=>{ 
   const  query = `SELECT * FROM eduall_student_transference 
   LEFT JOIN eduall_students ON eduall_students.ed_student_id =  eduall_student_transference.ed_student_transference_code
   WHERE eduall_student_transference.ed_student_transference_deleted = 0 AND eduall_student_transference.ed_student_transference_institute_code = ?`;
   const PARAMS = [GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0);  
}


const GetSingleStudentTransference = async(req, res)=>{
   const {ID} = req.params;
   const  query = `SELECT * FROM eduall_student_transference WHERE ed_student_transference_deleted = 0 AND ed_student_transference_id = ? `;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0); 
}


const RegisterStudentTransference = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_student_transference(ed_student_transference_code , ed_student_transference_reason,
   ed_student_transference_to, ed_student_transference_with_marks, ed_student_transference_description,ed_student_transference_institute_code) VALUES(?,?,?,?,?,?)`; 
   const PARAMS =  [req.body.transference_student, req.body.transference_reason,req.body.transference_place,
   req.body.transference_with_marks, req.body.transference_description, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);  
}
 

const StudentTransferenceDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_student_transference SET ed_student_transference_deleted = 1
   WHERE ed_student_transference_deleted = 0 AND ed_student_transference_id = ?`; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);  
} 


const StudentTransferenceUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {transference_student, transference_reason, transference_place, transference_with_marks,  transference_description} = req.body;
   const  query = `UPDATE eduall_student_transference SET ed_student_transference_code = ? ,ed_student_transference_reason = ?,
   ed_student_transference_to = ?, ed_student_transference_with_marks = ?,  ed_student_transference_description = ? 
   WHERE ed_student_transference_deleted = 0  AND ed_student_transference_id = ?`; 
   const PARAMS = [transference_student, transference_reason, transference_place,  transference_with_marks, transference_description,ID];
   DATABASERUN(res, query , PARAMS, 1);  
} 


module.exports = {GetStudentTransferences, GetSingleStudentTransference, 
RegisterStudentTransference, StudentTransferenceDelete, StudentTransferenceUpdate};