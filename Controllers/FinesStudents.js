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
 
const GetFinesStudents = async(req, res)=>{ 
      const  query = 'SELECT * FROM eduall_fines_students WHERE ed_fine_student_deleted = 0 AND ed_fine_student_institute_code = ?'; 
      const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
      DATABASERUN(res, query , PARAMS, 0);
}

const GetSingleFineStudent = async(req,res)=>{
   const {ID} = req.params; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);
 }
 
const GetAllFinesStudentByCode = async(req,res)=>{
    const {CODE} = req.params; 
    const  query = 'SELECT * FROM eduall_fines_students WHERE ed_fine_student_deleted = 0 AND ed_fine_student_fineCode = ? '; 
    const PARAMS = [CODE];
    DATABASERUN(res, query , PARAMS, 0);
 }
 

const RegisterFineStudent = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_fines_students(ed_fine_student_id, ed_fine_student_fineCode, ed_fine_student_institute_code) VALUES(?,?,?)`;
   const PARAMS = [req.body.fine_student_code, req.body.fine_student_fineCode , req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 1);
}

const FineStudentDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_fines_students SET ed_fine_student_deleted = 1
   WHERE ed_fine_student_deleted = 0 AND ed_fine_students_id = ?`; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
}  

const FineStudentsUpdate = async(req, res)=>{
     const {ID} = req.params;
     const  {fine_student_fineCode, fine_student_code} =  req.body; 
      const  query = `UPDATE eduall_fines_students SET ed_fine_student_fineCode = ?, ed_fine_student_id =  ?
      WHERE ed_fine_student_deleted = 0 AND ed_fine_students_id = ?`; 
      const PARAMS = [fine_student_fineCode, fine_student_code,ID];
     DATABASERUN(res, query , PARAMS, 1);
} 





module.exports = {GetFinesStudents, GetSingleFineStudent, GetAllFinesStudentByCode, RegisterFineStudent, FineStudentDelete, FineStudentsUpdate};