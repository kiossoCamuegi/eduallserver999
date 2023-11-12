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
 

const GetAcademicLevel = async(req,res)=>{ 
   const  query = `SELECT * FROM eduall_academic_level WHERE ed_academic_level_deleted = 0 AND ed_academic_level_institute_code = ?`;
   const PARAMS = [GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0);
 }
 
 const RegisterAcademicLevel = async(req, res)=>{
   const  query = `INSERT INTO eduall_academic_level(ed_academic_level_title,  ed_academic_level_forExam, 
   ed_academic_level_forFt, ed_academic_level_institute_code) VALUES(?,?,?,?)`; 
   const PARAMS = [req.body.academic_level_title , req.body.academic_level_forExam, 
   req.body.academic_level_forFt, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);
 }
 
 
 const GetSingleAcademicLevel = async(req, res)=>{
   const  query = `SELECT * FROM eduall_academic_level WHERE ed_academic_level_deleted = 0 AND ed_academic_level_id = ?`;
   const {ID} = req.params;
   const PARAMS = [ID] 
   DATABASERUN(res, query , PARAMS, 0);
 }

 const AcademicLevelDelete = async(req, res)=>{ 
   const  query = `UPDATE eduall_academic_level SET ed_academic_level_deleted = 1
   WHERE ed_academic_level_deleted = 0 AND ed_academic_level_id = ?`;
   const {ID} = req.params;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
}  

const AcademicLevelUpdate = async(req, res)=>{ 
   const {ID} = req.params;
   const  {academic_level_title, academic_level_forExam, academic_level_forFt } = req.body
   const  query = `UPDATE eduall_academic_level SET ed_academic_level_title = ? AND ed_academic_level_forExam = ? AND 
   ed_academic_level_forFt = ? WHERE ed_academic_level_deleted = 0 AND ed_academic_level_id = ?`; 
   const PARAMS = [academic_level_title, academic_level_forExam,academic_level_forFt, ID];
   DATABASERUN(res, query , PARAMS, 1);
} 




module.exports = {GetAcademicLevel  , RegisterAcademicLevel, GetSingleAcademicLevel, AcademicLevelDelete, AcademicLevelUpdate  }