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
 

const GetExamsCalendar = async(req,res)=>{  
      const  query = `SELECT * FROM eduall_student_exams LEFT JOIN  eduall_subjects ON 
      eduall_student_exams.ed_student_exam_subject = eduall_subjects.ed_subject_id  LEFT JOIN eduall_class ON
      eduall_student_exams.ed_student_exam_class = eduall_class.ed_class_id 
      WHERE eduall_student_exams.ed_student_exam_deleted  = 0 AND eduall_student_exams.ed_student_exam_institute_code = ?`;
      const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
      DATABASERUN(res, query , PARAMS, 0);
}


const GetExamsCalendarByClass = async(req,res)=>{  
    const {CLASS} = req.params;
    const  query = `SELECT * FROM eduall_student_exams LEFT JOIN  eduall_subjects ON 
    eduall_student_exams.ed_student_exam_subject = eduall_subjects.ed_subject_id  LEFT JOIN eduall_class ON
    eduall_student_exams.ed_student_exam_class = eduall_class.ed_class_id 
    WHERE eduall_student_exams.ed_student_exam_deleted  = 0 AND eduall_student_exams.ed_student_exam_class = ?`;
    const PARAMS = [CLASS];
    DATABASERUN(res, query , PARAMS, 0);
}


const GetSingleExamCalendar = async(req,res)=>{  
    const {ID} = req.params;
    const  query = `SELECT * FROM eduall_student_exams LEFT JOIN  eduall_subjects ON 
    eduall_student_exams.ed_student_exam_subject = eduall_subjects.ed_subject_id  LEFT JOIN eduall_class ON
    eduall_student_exams.ed_student_exam_class = eduall_class.ed_class_id 
    WHERE eduall_student_exams.ed_student_exam_deleted  = 0 AND eduall_student_exams.ed_student_exam_id = ?`;
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 0);
}   

const RegisterStudentExamCalendar = async(req, res)=>{
   const  query = `INSERT INTO eduall_student_exams(ed_student_exam_class, ed_student_exam_subject, ed_student_exam_date, ed_student_exam_time, ed_student_exam_institute_code) VALUES(?,?,?,?,?)`; 
   const PARAMS = [req.body.exam_calendar_class, req.body.exam_calendar_subject , req.body.exam_calendar_date ,  req.body.exam_calendar_time,,  req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 1);  
}



const UpdateStudentExamCalendar = async(req, res)=>{
   const {ID} = req.params;
   const  query = `UPDATE eduall_student_exams SET 
   ed_student_exam_class  = ?, ed_student_exam_subject = ?, ed_student_exam_date  = ?, ed_student_exam_time  = ? 
   WHERE ed_student_exam_deleted = 0 AND ed_student_exam_id = ?`;
   const PARAMS = [req.body.exam_calendar_class, req.body.exam_calendar_subject , req.body.exam_calendar_date , req.body.exam_calendar_time, ID];
   DATABASERUN(res, query , PARAMS, 1);  
} 



const DeleteStudentExamCalendar = async(req, res)=>{
    const {ID} = req.params;
    const  query = `UPDATE eduall_student_exams SET ed_student_exam_deleted = 1 WHERE ed_student_exam_deleted = 0 AND ed_student_exam_id = ?`;
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 1);  
 } 
 


module.exports = {GetExamsCalendar, GetExamsCalendarByClass, GetSingleExamCalendar, RegisterStudentExamCalendar, UpdateStudentExamCalendar, DeleteStudentExamCalendar};