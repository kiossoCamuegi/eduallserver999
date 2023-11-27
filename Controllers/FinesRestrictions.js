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
 


const GetFinesRestrictions = async(req, res)=>{ 
      const  query = 'SELECT * FROM eduall_fines_restrictions WHERE ed_fine_restriction_deleted = 0 AND ed_fine_restriction_institute_code = ?';
      const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
     DATABASERUN(res, query , PARAMS, 0);
}

const GetSingleFineRestriction = async(req,res)=>{
   const {ID} = req.params; 
   const  query = 'SELECT * FROM eduall_fines_restrictions WHERE ed_fine_restriction_deleted = 0 AND ed_fine_restriction_id = ? '; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);
}

const GetAllFinesRestrictionsByCode = async(req,res)=>{
   const {CODE} = req.params; 
   const  query = 'SELECT * FROM eduall_fines_restrictions WHERE ed_fine_restriction_deleted = 0 AND ed_fine_restriction_for_elCode = ? ';
   const PARAMS = [CODE];
   DATABASERUN(res, query , PARAMS, 0);
} 
 
const RegisterFineRestriction = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_fines_restrictions(ed_fine_restriction_fineCode, ed_fine_restriction_for,
   ed_fine_restriction_type, ed_fine_restriction_for_elCode, ed_fine_restriction_institute_code) VALUES(?,?,?,?,?)`; 
   const PARAMS = [req.body.fine_restriction_fineCode, req.body.fine_restriction_for,
   req.body.fine_restriction_type,req.body.fine_restriction_for_elCode , req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 1);
}
 

const FineRestrictionDelete = async(req, res)=>{
     const {ID} = req.params; 
      const  query = `UPDATE eduall_fines_restrictions SET ed_fine_restriction_deleted = 1
      WHERE ed_fine_restriction_deleted = 0 AND ed_fine_restriction_id = ?`;
       const PARAMS = [ID];
     DATABASERUN(res, query , PARAMS, 1);
} 

const FineRestrictionUpdate = async(req, res)=>{
   const {ID} = req.params;
   const  {fine_restriction_fineCode, fine_restriction_for, fine_restriction_type, fine_restriction_for_elCode} =  req.body;
   const  query = `UPDATE eduall_fines_restrictions SET ed_fine_restriction_fineCode = ? ,ed_fine_restriction_for = ?, 
   ed_fine_restriction_type = ?, ed_fine_restriction_for_elCode = ? WHERE ed_fine_restriction_deleted = 0 AND ed_fine_restriction_id = ?`;

   const PARAMS =  [fine_restriction_fineCode,fine_restriction_for,fine_restriction_type, fine_restriction_for_elCode,ID];
   DATABASERUN(res, query , PARAMS, 1);
}  
 
module.exports = {GetFinesRestrictions, GetSingleFineRestriction, GetAllFinesRestrictionsByCode, RegisterFineRestriction, FineRestrictionDelete, FineRestrictionUpdate};