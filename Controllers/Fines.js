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
 

const GetFines = async(req, res)=>{ 
   const  query = 'SELECT * FROM eduall_fines WHERE ed_fine_deleted = 0 AND ed_fine_institute_code = ?';
   const PARAMS = [GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0);
}

const GetSingleFine = async(req,res)=>{
    const {ID} = req.params; 
   const  query = 'SELECT * FROM eduall_fines WHERE ed_fine_deleted = 0 AND ed_fine_id = ? ';
   const PARAMS = [GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0);
 } 
 
const GetSingleFineByCode = async(req,res)=>{
    const {CODE} = req.params; 
      const  query = 'SELECT * FROM eduall_fines WHERE ed_fine_deleted = 0 AND ed_fine_code = ? ';
      const PARAMS = [CODE];
      DATABASERUN(res, query , PARAMS, 0);
 } 
  
const GetSingleFineByService = async(req,res)=>{
     const {SERVICE} = req.params; 
     const  query = 'SELECT * FROM eduall_fines WHERE ed_fine_deleted = 0 AND ed_fine_service = ? AND ed_fine_institute_code = ? '; 
     const PARAMS = [SERVICE, GetCurrentUserData(1)];
     DATABASERUN(res, query , PARAMS, 0);
} 

const RegisterFine = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_fines(ed_fine_code,ed_fine_service,ed_fine_value_type,ed_fine_value,ed_fine_for_scholarshipholders,
   ed_fine_increment_value,ed_fine_parentsChildrens,ed_fine_daysafterprevmonth, ed_fine_institute_code) VALUES(?,?,?,?,?,?,?,?,?)`; 
   const PARAMS = [req.body.fine_code,req.body.fine_servicecode,req.body.fine_valuetype,req.body.fine_value, 
   req.body.fine_scholarshipholders, req.body.fine_Incdaysafterprevmonth,req.body.fine_forparentswthMrCh,
   req.body.fine_daysafterprevmonth, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);
}  


const FineDelete = async(req, res)=>{
   const {ID} = req.params;  
   const  query = `UPDATE eduall_fines SET ed_fine_deleted = 1
   WHERE ed_fine_deleted = 0 AND ed_fine_id = ?`;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
} 

const FineUpdate = async(req, res)=>{
     const {ID} = req.params;
     const  { fine_code ,fine_servicecode,fine_valuetype,fine_value,fine_scholarshipholders ,fine_Incdaysafterprevmonth 
     ,fine_forparentswthMrCh, fine_daysafterprevmonth} =  req.body;  
      const  query = `UPDATE eduall_fines SET ed_fine_code = ?, ed_fine_service = ?,  ed_fine_value_type = ?,  ed_fine_value = ?, 
      ed_fine_for_scholarshipholders = ?,  ed_fine_increment_value = ?, ed_fine_parentsChildrens = ?,
      ed_fine_daysafterprevmonth =  ?  WHERE ed_fine_deleted = 0 AND ed_fine_id = ?`;
      const PARAMS = [fine_code, fine_servicecode, fine_valuetype,fine_value,fine_scholarshipholders,
      fine_Incdaysafterprevmonth,fine_forparentswthMrCh,fine_daysafterprevmonth , ID];
      DATABASERUN(res, query , PARAMS, 1);
} 


module.exports = {GetFines, GetSingleFine, GetSingleFineByCode, GetSingleFineByService, RegisterFine, FineDelete, FineUpdate};

