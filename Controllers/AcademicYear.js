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

const GetAcademicYear = async(req,res)=>{
  const  query = `SELECT * FROM eduall_academic_year WHERE ed_academic_year_deleted = 0 AND ed_academic_year_institute_code =?`; 
  const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
  DATABASERUN(res, query , PARAMS, 0);
}

const RegisterAcademicYear = async(req, res)=>{
   const  query = `INSERT INTO eduall_academic_year(ed_academic_year_title, ed_academic_year_startDate, ed_academic_year_endDate, 
   ed_academic_year_institute_code) VALUES(?,?,?,?)`;
   const PARAMS = [req.body.title , req.body.year_date_start, req.body.year_date_finish, req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 1);
} 

const GetSingleAcademicYear = async(req, res)=>{
   const  query = 'SELECT * FROM eduall_academic_year WHERE ed_academic_year_deleted = 0 AND ed_academic_year_id = ? ';
   const {ID} = req.params;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);
} 

const AcademicyearDelete = async(req, res)=>{
   const  query = `UPDATE eduall_academic_year SET ed_academic_year_deleted = 1
   WHERE ed_academic_year_deleted = 0 AND ed_academic_year_id = ?`;
   const {ID} = req.params;  
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
}  

const AcademicyearUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {title , year_date_start, year_date_finish}  = req.body   
   const query = `UPDATE eduall_academic_year SET ed_academic_year_title = ?,
   ed_academic_year_startDate = ?, ed_academic_year_endDate = ?
   WHERE ed_academic_year_deleted = 0 AND ed_academic_year_id = ?`; 
   const PARAMS = [title, year_date_start, year_date_finish, ID];
   DATABASERUN(res, query , PARAMS, 1);
} 


module.exports = {GetAcademicYear, RegisterAcademicYear, GetSingleAcademicYear, AcademicyearDelete, AcademicyearUpdate}