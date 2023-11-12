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
 


const GetAllTeacherTiming = async(req, res)=>{
   const { CODE } = req.params; 
   const  query = `SELECT * FROM eduall_teacher_timings 
   LEFT JOIN eduall_timing ON eduall_teacher_timings.ed_tch_timing_code = eduall_timing.ed_timing_id
   LEFT JOIN eduall_subjects ON eduall_teacher_timings.ed_tch_timing_subject = eduall_subjects.ed_subject_id  
   LEFT JOIN eduall_class ON eduall_teacher_timings.ed_tch_timing_class = eduall_class.ed_class_id
   WHERE eduall_teacher_timings.ed_tch_timing_deleted = 0 AND eduall_teacher_timings.ed_tch_timing_teacher_code = ? AND  eduall_teacher_timings.ed_tch_timing_institute_code = ? `;
   const PARAMS = [CODE, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0);  
} 


const GetAllClassTimings = async(req, res)=>{
   const { CODE } = req.params; 
   const  query = `SELECT * FROM eduall_teacher_timings 
   LEFT JOIN eduall_timing ON eduall_teacher_timings.ed_tch_timing_code = eduall_timing.ed_timing_id
   LEFT JOIN eduall_subjects ON eduall_teacher_timings.ed_tch_timing_subject = eduall_subjects.ed_subject_id  
   LEFT JOIN eduall_class ON eduall_teacher_timings.ed_tch_timing_class = eduall_class.ed_class_id
   WHERE eduall_teacher_timings.ed_tch_timing_deleted = 0 AND eduall_teacher_timings.ed_tch_timing_class = ? AND  eduall_teacher_timings.ed_tch_timing_institute_code = ? `;
   const PARAMS = [CODE, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0);  
} 



const GetTeacherTimingByClassSub = async(req, res)=>{
   const {ID, CODE, CLASS, SUBJECT} = req.params; 
   const  query = `SELECT * FROM eduall_teacher_timings WHERE ed_tch_timing_deleted = 0 AND 
   ed_tch_timing_teacher_code =? AND ed_tch_timing_code =? AND ed_tch_timing_class =? AND ed_tch_timing_subject = ?`;
   const PARAMS = [CODE, ID,CLASS,SUBJECT];
   DATABASERUN(res, query , PARAMS, 0);  
} 


const GetSingleTeacherTiming = async(req, res)=>{
   const {ID, CODE, CLASS, SUBJECT} = req.params; 
   const  query = `SELECT * FROM eduall_teacher_timings WHERE ed_tch_timing_deleted = 0 AND 
   ed_tch_timing_teacher_code =? AND ed_tch_timing_code = ? AND ed_tch_timing_class = ? AND ed_tch_timing_subject = ? `;
   const PARAMS = [CODE, ID, CLASS, SUBJECT] ;
   DATABASERUN(res, query , PARAMS, 0);  
}


const RegisterTeacherTiming = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_teacher_timings(ed_tch_timing_code,ed_tch_timing_class,ed_tch_timing_subject, ed_tch_timing_teacher_code,
   ed_tch_timing_institute_code) VALUES(?,?,?,?,?)`; 
   const PARAMS = [req.body.teacher_timing_code, req.body.teacher_timing_class,req.body.teacher_timing_subject,
   req.body.teacher_timing_teacher_code, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);  
} 


const TeacherTimingDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_teacher_timings SET ed_tch_timing_deleted = 1
   WHERE ed_tch_timing_deleted = 0 AND ed_tch_timing_id = ?`;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);  
} 

module.exports = {GetSingleTeacherTiming,GetTeacherTimingByClassSub,GetAllTeacherTiming ,
TeacherTimingDelete,  RegisterTeacherTiming , GetAllClassTimings}; 


