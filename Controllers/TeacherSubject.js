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
 

const GetTeacherSubjects = async(req, res)=>{
   const {CODE} = req.params; 
   const  query = 'SELECT * FROM eduall_teacher_subjects WHERE ed_tch_subject_deleted = 0 AND ed_tch_subject_teacher_code = ?  AND ed_tch_subject_institute_code = ?';
   const PARAMS = [CODE, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0);  
}


const GetSingleTeacherSubject = async(req, res)=>{
    const {ID, CODE, CLASS} = req.params;
   const  query = `SELECT * FROM eduall_teacher_subjects WHERE ed_tch_subject_deleted = 0  AND
   ed_tch_subject_teacher_code = ? AND  ed_tch_subject_code = ? AND  ed_tch_subject_class = ? AND ed_tch_subject_institute_code = ?`;
   const PARAMS = [CODE,ID, CLASS, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0);  
}

const RegisterTeacherSubject = async(req, res)=>{
   const  query = `INSERT INTO eduall_teacher_subjects(ed_tch_subject_code, ed_tch_subject_class,ed_tch_subject_teacher_code,
   ed_tch_subject_institute_code) VALUES(?,?,?,?)`;
   const PARAMS = [req.body.teacher_subject_code,  req.body.teacher_subject_class,
   req.body.teacher_subject_teacher_code,  GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);  
}
 
const TeacherSubjectDelete = async(req, res)=>{
    const {ID} = req.params;
   const  query = `UPDATE eduall_teacher_subjects SET ed_tch_subject_deleted = 1
   WHERE ed_tch_subject_deleted = 0 AND ed_tch_subject_id = ?`;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);  
} 



 
module.exports = { TeacherSubjectDelete, GetTeacherSubjects, GetSingleTeacherSubject, RegisterTeacherSubject };