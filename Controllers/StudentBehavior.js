const CheckInternet = require("../config/CheckInternet");
const { DB_SQLITE, DATABASE } = require("../config/Database"); 
const { GetCurrentUserData } = require("./GetCurrentUserData");
 

const DATABASERUN = (res, query, params, type)=>{
   try { 
      if(CheckInternet() === true){  
         if(type === 0){
            DATABASE.query(query, params, (err, rows)=>{ 
               if(err) return res.status(300).json({status:300, success:false, error:err});
               return res.json(rows);
            });
         }else{
            DATABASE.query(query, params , (err)=>{ 
               if(err) return res.status(300).json({status:300, success:false, error:err});
               return res.json("success");
             }); 
         } 
      }else{  
         if(type === 0){
            DB_SQLITE.all(query, params, (err, rows)=>{ 
               if(err) return res.status(300).json({status:300, success:false, error:err});
               return res.json(rows);
            }); 
         }else{
            DB_SQLITE.run(query, params , (err)=>{ 
               if(err) return res.status(300).json({status:300, success:false, error:err});
               return res.json("success");
           }); 
         } 
      } 
   } catch (error) {
      res.status(400).json(error); 
   }  
} 

const GetAllStudentBehavior = async(req,res)=>{
  const  query = `SELECT * FROM eduall_student_behavior WHERE ed_student_behavior_deleted = 0 AND ed_student_behavior_instituteCode	= ?`; 
  const PARAMS = [GetCurrentUserData(1)];
  DATABASERUN(res, query , PARAMS, 0);
}


const GetAllStudentBehaviorByStudentCode = async(req,res)=>{
    const  query = `SELECT * FROM eduall_student_behavior 
    LEFT JOIN eduall_employees ON eduall_employees.ed_employee_id = eduall_student_behavior.ed_student_behavior_employeeCode
    LEFT JOIN eduall_user_accounts ON eduall_user_accounts.ed_user_account_id = eduall_student_behavior.ed_student_behavior_user
    WHERE eduall_student_behavior.ed_student_behavior_deleted = 0 AND eduall_student_behavior.ed_student_behavior_Studentcode = ?`; 
    const {ID} = req.params;  
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 0);
}


const RegisterStudentBehavior = async(req, res)=>{
   const  query = `INSERT INTO eduall_student_behavior(ed_student_behavior_Studentcode, ed_student_behavior_description, ed_student_behavior_employeeCode, 
    ed_student_behavior_stars, 	ed_student_behavior_classSub, ed_student_behavior_type, ed_student_behavior_user,ed_student_behavior_instituteCode) VALUES(?,?,?,?,?,?,?,?)`;
   const PARAMS = [req.body.student_behavior_code, req.body.student_behavior_description, req.body.student_behavior_employee, 
  req.body.student_behavior_stars, req.body.student_behavior_subClass, req.body.student_behavior_type, GetCurrentUserData(0), GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);
} 



const GetSingleStudentBehavior = async(req, res)=>{
   const  query = 'SELECT * FROM eduall_student_behavior WHERE ed_student_behavior_deleted = 0 AND ed_academic_year_id = ? ';
   const {ID} = req.params;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);
} 

const StudentBehaviorDelete = async(req, res)=>{
   const  query = `UPDATE eduall_student_behavior SET ed_student_behavior_deleted = 1
   WHERE ed_student_behavior_deleted = 0 AND ed_academic_year_id = ?`;
   const {ID} = req.params;  
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
}  

const StudentBehaviorUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {title , year_date_start, year_date_finish}  = req.body   
   const query = `UPDATE eduall_student_behavior SET ed_academic_year_title = ?,
   ed_academic_year_startDate = ?, ed_academic_year_endDate = ?
   WHERE ed_student_behavior_deleted = 0 AND ed_academic_year_id = ?`; 
   const PARAMS = [title, year_date_start, year_date_finish, ID];
   DATABASERUN(res, query , PARAMS, 1);
} 


module.exports = {RegisterStudentBehavior, GetAllStudentBehaviorByStudentCode}