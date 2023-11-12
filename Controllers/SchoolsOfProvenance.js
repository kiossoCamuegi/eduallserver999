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
 
const GetSchoolsOfProvenance = async(req, res)=>{ 
      const  query = `SELECT * FROM eduall_schools_of_provenance WHERE ed_schools_of_provenance_deleted = 0 
      AND ed_schools_of_provenance_institute_code = ?`;
      const PARAMS = [GetCurrentUserData(1)];
      DATABASERUN(res, query , PARAMS, 0);
}


const GetSingleSchoolsOfProvenance = async(req,res)=>{
    const {ID} = req.params;  
   const  query = `SELECT * FROM eduall_schools_of_provenance WHERE ed_schools_of_provenance_deleted = 0 AND ed_academic_level_id = ? `;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);
 }
 


const RegisterSchoolsOfProvenance = async(req, res)=>{  
   const  query = `INSERT INTO eduall_schools_of_provenance(ed_schools_of_provenance_name, ed_schools_of_provenance_email,ed_schools_of_provenance_address, 
   ed_schools_of_provenance_country, ed_schools_of_provenance_description, ed_schools_of_provenance_institute_code) VALUES(?,?,?,?,?,?)`;
  const PARAMS = [req.body.schools_of_provenance_name,req.body.schools_of_provenance_email,req.body.schools_of_provenance_address, 
  req.body.schools_of_provenance_country,req.body.schools_of_provenance_description , GetCurrentUserData(1)];
  DATABASERUN(res, query , PARAMS, 1);
}


const SchoolsOfProvenanceDelete = async(req, res)=>{
    const {ID} = req.params; 
   const  query = `UPDATE eduall_schools_of_provenance SET ed_schools_of_provenance_deleted = 1
   WHERE ed_schools_of_provenance_deleted = 0 AND ed_academic_level_id = ?`;
   const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 1);
} 


const SchoolsOfProvenanceUpdate = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_schools_of_provenance SET ed_schools_of_provenance_name = ?, ed_schools_of_provenance_email = ?, ed_schools_of_provenance_address = ?,
   ed_schools_of_provenance_country = ?, ed_schools_of_provenance_description = ?  WHERE ed_schools_of_provenance_deleted = 0 
   AND ed_academic_level_id = ?`;
   const PARAMS = [req.body.schools_of_provenance_name, req.body.schools_of_provenance_email, req.body.schools_of_provenance_address, 
   req.body.schools_of_provenance_country, req.body.schools_of_provenance_description ,ID];
   DATABASERUN(res, query , PARAMS, 1);
} 


module.exports = {GetSchoolsOfProvenance, GetSingleSchoolsOfProvenance, RegisterSchoolsOfProvenance, SchoolsOfProvenanceDelete, SchoolsOfProvenanceUpdate};