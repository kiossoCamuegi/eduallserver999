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
 

const GetEmployeesAttendance = async(req, res)=>{ 
      const  query = `SELECT * FROM eduall_employee_attendence WHERE ed_employee_attd_deleted = 0 AND ed_employee_attd_institute_code = ? `;
      const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
      DATABASERUN(res, query , PARAMS, 0);
}

const GetEmployeeAttendanceBycode = async(req,res)=>{
   const {CODE} = req.params; 
   const  query = `SELECT * FROM eduall_employee_attendence

   
   LEFT JOIN eduall_subjects ON eduall_employee_attendence.ed_employee_attd_subject = eduall_subjects.ed_subject_id  
   LEFT JOIN eduall_class ON eduall_employee_attendence.ed_employee_attd_class = eduall_class.ed_class_id
   LEFT JOIN eduall_timing ON eduall_timing.ed_timing_id =  eduall_employee_attendence.ed_employee_attd_timing
 

   WHERE eduall_employee_attendence.ed_employee_attd_deleted = 0 AND eduall_employee_attendence.ed_employee_attd_code = ? 
   AND eduall_employee_attendence.ed_employee_attd_institute_code = ?`;
   const PARAMS = [CODE, req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 0);
}  
 
const GetSingleEmployeeAttendance = async(req,res)=>{
   const {ID} = req.params;
   const  query = `SELECT * FROM eduall_employee_attendence WHERE ed_employee_attd_deleted = 0 AND ed_employee_attd_id = ? `;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);
}
 
const RegisterEmployeeAttendance = async(req, res)=>{
   const  query = `INSERT INTO eduall_employee_attendence(ed_employee_attd_code ,ed_employee_attd_date,ed_employee_attd_timing,
   ed_employee_attd_status, ed_employee_attd_institute_code) VALUES(?,?,?,?,?)`;
   const PARAMS = [req.body.employee_attendance_code,req.body.employee_attendance_date,req.body.employee_attendance_timing,
   req.body.employee_attendance_status,  req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 1);
}

const EmployeeAttendanceDelete = async(req, res)=>{
    const {ID} = req.params; 
   const  query = `UPDATE eduall_employee_attendence SET ed_employee_attd_deleted = 1
   WHERE ed_employee_attd_deleted = 0 AND ed_employee_attd_id = ?`; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
}  

const EmployeeAttendanceUpdate = async(req, res)=>{
    const {ID} = req.params;
    const {employee_attendance_code,employee_attendance_date,employee_attendance_timing,  employee_attendance_status } = req.body; 
    const  query = `UPDATE eduall_employee_attendence SET ed_employee_attd_code = ?, ed_employee_attd_date =  ?, 
    ed_employee_attd_timing =  ?,  ed_employee_attd_status = ?, WHERE ed_employee_attd_deleted = 0 AND ed_employee_attd_id = ?`;
   const PARAMS = [employee_attendance_code, employee_attendance_date, employee_attendance_timing, employee_attendance_status, ID] ;
   DATABASERUN(res, query , PARAMS, 1);
} 
 

module.exports = {RegisterEmployeeAttendance, GetEmployeesAttendance,
GetEmployeeAttendanceBycode, EmployeeAttendanceUpdate, EmployeeAttendanceDelete, GetSingleEmployeeAttendance };