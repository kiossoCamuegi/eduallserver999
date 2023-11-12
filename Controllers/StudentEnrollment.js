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
 


const GetStudentEnrollments = async(req, res)=>{
    const  query = 'SELECT * FROM eduall_student_enrollment WHERE ed_student_enrollment_deleted = 0 AND ed_enroll_institute_code = ?';
    const PARAMS = [GetCurrentUserData(1)];
    DATABASERUN(res, query , PARAMS, 0); 
}

const GetSingleStudentEnrollment = async(req, res)=>{
    const  {ID} = req.params;
    const  query = 'SELECT * FROM eduall_student_enrollment WHERE ed_student_enrollment_deleted = 0 AND ed_student_enrollment_id = ? ';
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 0); 
}

const CheckExistentStudentEnrollment = async(req, res)=>{
    const  {STUDENT} = req.params; 
    const  query = 'SELECT * FROM eduall_student_enrollment WHERE ed_student_enrollment_deleted = 0 AND ed_student_enrollment_studentcode = ? ';
    const PARAMS = [STUDENT];
    DATABASERUN(res, query , PARAMS, 0);
}

const RegisterStudentEnrollment = async(req, res)=>{
    
}

const StudentEnrollmentDelete = async(req, res)=>{
    const {ID} = req.params; 
      const  query = `UPDATE eduall_student_enrollment SET ed_student_enrollment_deleted = 1
      WHERE ed_student_enrollment_deleted = 0 AND ed_student_enrollment_id = ?`;
      const PARAMS = [ID];
      DATABASERUN(res, query , PARAMS, 1);
} 

const StudentEnrollmentUpdate = async(req, res)=>{
    const {ID} = req.params;
    const {enrollment_service_code} = req.body; 
    const  query = `UPDATE eduall_student_enrollment SET ed_student_enrollment_service = ?
    WHERE ed_student_enrollment_deleted = 0 AND ed_student_enrollment_id = ?`;
    const PARAMS = [enrollment_service_code , ID];
    DATABASERUN(res, query , PARAMS, 1);
} 

module.exports = {GetStudentEnrollments, GetSingleStudentEnrollment, CheckExistentStudentEnrollment, RegisterStudentEnrollment, StudentEnrollmentDelete, StudentEnrollmentUpdate};