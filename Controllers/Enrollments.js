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
 

const GetEnrolledStudents = async(req, res)=>{ 
   const  query = `SELECT * FROM eduall_enrollment 
   LEFT JOIN  eduall_students ON  eduall_enrollment.ed_enrollment_student  = eduall_students.ed_student_id
   LEFT JOIN eduall_class ON eduall_class.ed_class_id = eduall_students.ed_student_class
   LEFT JOIN eduall_academic_year ON eduall_academic_year.ed_academic_year_id =  eduall_class.ed_class_year
   LEFT JOIN eduall_services ON eduall_services.ed_service_id  =  eduall_enrollment.ed_enrollment_service
   WHERE eduall_enrollment.ed_enrollment_deleted = 0 AND eduall_enrollment.ed_enrollment_institute_code = ? `;
   const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 0);
}

const GetSingleEnrolledStudent = async(req,res)=>{
   const {ID} = req.params; 
   const  query = `SELECT * FROM eduall_enrollment
   LEFT JOIN  eduall_students ON  eduall_enrollment.ed_enrollment_student  = eduall_students.ed_student_id
   LEFT JOIN eduall_class ON eduall_class.ed_class_id = eduall_students.ed_student_class
   LEFT JOIN eduall_academic_year ON eduall_academic_year.ed_academic_year_id =  eduall_class.ed_class_year
   LEFT JOIN eduall_services ON eduall_services.ed_service_id  =  eduall_enrollment.ed_enrollment_service
    WHERE ed_enrollment_deleted = 0 AND ed_enrollment_id = ? AND eduall_enrollment.ed_enrollment_institute_code = ?
   `;
   const PARAMS = [ID, req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 0);    
}
 

const RegisterEnrollment = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_enrollment(ed_enrollment_student, ed_enrollment_class, ed_enrollment_service,
   ed_enrollment_institute_code) VALUES(?,?,?,?)`;
   const PARAMS = [req.body.enrollment_student_code, req.body.enrollment_class,req.body.enrollment_service_code, req.session.user.eduall_user_session_curentinstitute];
    DATABASERUN(res, query , PARAMS, 1);
} 

const EnrolledStudentDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_enrollment SET ed_enrollment_deleted = 1 WHERE ed_enrollment_deleted = 0 AND ed_enrollment_id = ?`; 
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 1);
}  

const EnrolledStudentUpdate = async(req, res)=>{
   const {ID} = req.params;
   const  {enrollment_student_code, enrollment_class , enrollment_service_code} =  req.body; 
   const  query = `UPDATE eduall_enrollment SET ed_enrollment_student =?, ed_enrollment_class =?, ed_enrollment_service =?
   WHERE ed_enrollment_deleted = 0 AND ed_enrollment_id = ?`; 
   const PARAMS = [enrollment_student_code, enrollment_class, enrollment_service_code,ID];
   DATABASERUN(res, query , PARAMS, 1);
} 


module.exports = {GetEnrolledStudents, GetSingleEnrolledStudent, RegisterEnrollment, EnrolledStudentDelete, EnrolledStudentUpdate};

