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
 


const GetSubjects = async(req, res)=>{
   const  query = 'SELECT * FROM eduall_subjects WHERE ed_subject_deleted = 0 AND ed_subject_institute_code = ?';
   const PARAMS = [GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0);  
}


const GetSingleSubject = async(req,res)=>{
    const {ID} = req.params;
    const  query = 'SELECT * FROM eduall_subjects WHERE ed_subject_deleted = 0 AND ed_subject_id = ? ';
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 0);    
 }
 


const RegisterSubject = async(req, res)=>{
   const  query = `INSERT INTO eduall_subjects(ed_subject_title, ed_subject_category, ed_subject_type, 
   ed_subject_institute_code) VALUES(?,?,?,?)`; 
   const PARAMS = [req.body.subject_title,req.body.subject_category, req.body.subject_type, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);  
}


const SubjectDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_subjects SET ed_subject_deleted = 1
   WHERE ed_subject_deleted = 0 AND ed_subject_id = ?`; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);  
} 


const SubjectUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {subject_title, subject_category, subject_type } = req.body; 
   const  query = `UPDATE eduall_subjects SET ed_subject_title = ?, ed_subject_category =  ? ,ed_subject_type = ? 
   WHERE ed_subject_deleted = 0 AND ed_subject_id = ?`;
   const PARAMS = [subject_title,subject_category, subject_type, ID];
   DATABASERUN(res, query , PARAMS, 1);  
} 

            


module.exports = {GetSubjects, GetSingleSubject, RegisterSubject, SubjectDelete, SubjectUpdate};