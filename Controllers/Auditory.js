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
 
const GetAuditoryData = async(req, res)=>{
   const  query = 'SELECT * FROM eduall_auditory'; 
   const PARAMS = [];
   DATABASERUN(res, query , PARAMS, 0);
} 

const AuditoryRegister = async(req, res)=>{  
   const  query = `INSERT INTO eduall_auditory(ed_auditory_form, ed_auditory_user_code, ed_auditory_action_type,
   ed_auditory_action,ed_auditory_action_description,ed_auditory_institute_code)
   VALUES(?,?,?,?,?,?)`;
   const PARAMS = [req.body.auditory_form, auditory_user_code, req.body.auditory_action_type,
   req.body.auditory_action, req.body.auditory_form, auditory_user_code, req.body.auditory_action_type,
   req.body.auditory_description ,GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);
}
 
module.exports = {GetAuditoryData, AuditoryRegister}