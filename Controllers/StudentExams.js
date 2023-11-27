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
 

const GetsingleStudentExamNotebYSubStCls = async(req,res)=>{
    const {SUBJECT, STUDENT, CLASS} = req.params; 
      const  query = `SELECT * FROM eduall_student_exam_notes        
          
    LEFT JOIN eduall_class 
    ON eduall_class.ed_class_id = ?
    LEFT JOIN eduall_academic_level ON eduall_academic_level.ed_academic_level_id  = eduall_class.ed_class_academic_level
      
      WHERE ed_student_exam_subject  = ? AND ed_student_exam_studentCode = ? 
       AND ed_student_exam_class  = ? AND  ed_student_exam_deleted  = 0 AND  ed_student_exam_institute_code  = ?  `;
      const PARAMS = [CLASS, SUBJECT, STUDENT, CLASS, req.session.user.eduall_user_session_curentinstitute];
      DATABASERUN(res, query , PARAMS, 0);
}


const RegisterStudentExamNotes = async(req, res)=>{
   const  query = `INSERT INTO eduall_student_exam_notes(ed_student_exam_studentCode, ed_student_exam_class, ed_student_exam_subject, 
   ed_student_exam_score, ed_student_exam_institute_code	) VALUES(?,?,?,?,?)`; 
   const PARAMS = [req.body.student_exam_code, req.body.student_exam_class  , req.body.student_exam_subject , req.body.student_exam_score, req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 1);  
}



const UpdateStudentExamNotes = async(req, res)=>{
   const {ID} = req.params;
   const  query = `UPDATE eduall_student_exam_notes SET ed_student_exam_studentCode = ?, ed_student_exam_class =  ? ,ed_student_exam_subject = ? , ed_student_exam_score = ?
   WHERE ed_student_exam_deleted = 0 AND ed_student_exam_id = ?`;
   const PARAMS = [req.body.student_exam_code, req.body.student_exam_class , req.body.student_exam_subject , req.body.student_exam_score, ID];
   DATABASERUN(res, query , PARAMS, 1);  
} 




module.exports = {GetsingleStudentExamNotebYSubStCls, UpdateStudentExamNotes, RegisterStudentExamNotes};