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
 


const GetStudentAttendance = async(req, res)=>{  
      const  query = `SELECT * FROM eduall_student_attendence WHERE ed_student_attd_deleted = 0 AND ed_student_attd_institute_code = ?`;
      const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
      DATABASERUN(res, query , PARAMS, 0);
}

const GetStudentAttendanceByTeacher = async(req,res)=>{ 
    const  query = `SELECT * FROM eduall_student_attendence WHERE ed_student_attd_deleted = 0 AND ed_student_attd_id = ? `; 
    const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
    DATABASERUN(res, query , PARAMS, 0);
} 

const GetStudentAttendanceByTeacherAndClassSub = async(req,res)=>{ 
   const {ID} = req.params; 
    const  query = `SELECT * FROM eduall_student_attendence 
    LEFT JOIN eduall_students ON eduall_students.ed_student_id = eduall_student_attendence.ed_student_attd_student_code
    LEFT JOIN eduall_timing ON eduall_timing.ed_timing_id =  eduall_student_attendence.ed_student_attd_timing
    WHERE eduall_student_attendence.ed_student_attd_deleted = 0 AND eduall_student_attendence.ed_student_attd_teacherSubClass = ? `; 
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 0);
}  

const GetSingleStudentAttendance = async(req,res)=>{
    const {ID} = req.params; 
    const  query = `SELECT * FROM eduall_student_attendence WHERE ed_student_attd_deleted = 0 AND ed_student_attd_id = ? `; 
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 0);
}

const CheckExistentSingleStudentAttendance = async(req,res)=>{
    const {CLASS, STUDENT,TIME, SUBJECT, DATE} = req.params; 
    const  query = `SELECT * FROM eduall_student_attendence WHERE  ed_student_attd_class = ?  AND ed_student_attd_student_code = ?
    AND ed_student_attd_timing = ? AND ed_student_attd_subject = ? AND ed_student_attd_date = ? AND ed_student_attd_deleted = 0 
    AND ed_student_attd_id = ? `;  
    const PARAMS = [CLASS,STUDENT,TIME, SUBJECT, DATE, ID];
    DATABASERUN(res, query , PARAMS, 0);
}
 

const  GetStudentAttendanceByClassSubStuQrt = async(req,res)=>{
    const {CLASS, STUDENT, QRT, SUBJECT} = req.params; 
    const  query = `SELECT * FROM eduall_student_attendence WHERE  ed_student_attd_class = ?  AND ed_student_attd_student_code = ?
    AND ed_student_attd_quarter = ? AND ed_student_attd_subject = ?   AND ed_student_attd_deleted = 0`; 
    const PARAMS = [CLASS,STUDENT,QRT, SUBJECT];
    DATABASERUN(res, query , PARAMS, 0);
}


const UpdateExistentSingleStudentAttendance = async(req,res)=>{
    const {CLASS, STUDENT,TIME, SUBJECT, DATE} = req.params;  
                   
    /*ed_student_attd_deleted:0, 
                    ed_student_attd_class:CLASS,
                    ed_student_attd_student_code:STUDENT,
                    ed_student_attd_timing:TIME, 
                    ed_student_attd_subject:SUBJECT, 
                    ed_student_attd_date:DATE
                    */


    const  query = `UPDATE eduall_student_attendence SET ed_student_attd_deleted = 1
    WHERE ed_student_attd_deleted = 0 AND ed_student_attd_id = ?`; 
    const PARAMS = [CLASS, STUDENT,TIME, SUBJECT, DATE];
    DATABASERUN(res, query, PARAMS, 1);
}


const GetAllStudentAttendance = async(req,res)=>{
    const {CODE, CLASS} = req.params;  
    const  query = `SELECT * FROM eduall_student_attendence WHERE ed_student_attd_deleted = 0 AND 
    ed_student_attd_student_code = ? AND ed_student_attd_class = ? `; 
    const PARAMS = [CODE, CLASS];
    DATABASERUN(res, query , PARAMS, 0);
}

const RegisterStudentAttendance = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_student_attendence(ed_student_attd_class, ed_student_attd_student_code,ed_student_attd_timing, ed_student_attd_status,
    ed_student_attd_subject,ed_student_attd_teacherSubClass,ed_student_attd_date,ed_student_attd_institute_code) VALUES(?,?,?,?,?,?,?,?)`;
    const PARAMS = [req.body.student_attendance_class,req.body.student_attendance_code,req.body.student_attendance_time,req.body.student_attendance_status,
    req.body.student_attendance_subject,req.body.student_attendance_subClass,req.body.student_attendance_date, req.session.user.eduall_user_session_curentinstitute] ;
    DATABASERUN(res, query , PARAMS, 1);
}
  

const StudentAttendanceDelete = async(req, res)=>{
    const {ID} = req.params; 
    const  query = `UPDATE eduall_student_attendence SET ed_student_attd_deleted = 1
    WHERE ed_student_attd_deleted = 0 AND ed_student_attd_id = ?`; 
    const PARAMS = [ID];
    DATABASERUN(res, query, PARAMS, 1);
}  

const StudentAttendanceUpdate = async(req, res)=>{
    const {ID} = req.params;
    const {student_attendance_class, student_attendance_code, student_attendance_date,
    student_attendance_time, student_attendance_status, student_attendance_subject, student_attendance_tch_subClass} = req.body; 
    const  query = `UPDATE eduall_student_attendence SET ed_student_attd_timing = ?, ed_student_attd_status = ?,
    ed_student_attd_date = ?  WHERE ed_student_attd_deleted = 0 AND ed_student_attd_id = ?`; 
    const PARAMS = [student_attendance_time, student_attendance_status ,student_attendance_date,ID];
    DATABASERUN(res, query , PARAMS, 1);
} 

module.exports = {GetStudentAttendanceByClassSubStuQrt, GetStudentAttendance, UpdateExistentSingleStudentAttendance, GetStudentAttendanceByTeacher,GetStudentAttendanceByTeacherAndClassSub,
GetSingleStudentAttendance,CheckExistentSingleStudentAttendance,  GetAllStudentAttendance, RegisterStudentAttendance, StudentAttendanceDelete, StudentAttendanceUpdate};