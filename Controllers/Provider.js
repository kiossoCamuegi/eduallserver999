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
 

const GetProviders = async(req,res)=>{ 
      const  query = 'SELECT * FROM eduall_providers WHERE ed_provider_deleted = 0 AND ed_provider_institute_code = ?';
      const PARAMS = [GetCurrentUserData(1)];
      DATABASERUN(res, query , PARAMS, 0);
}

const RegisterProvider = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_providers(ed_provider_title, ed_provider_phone, ed_provider_nif,ed_provider_website, ed_provider_address,ed_provider_city,
   ed_provider_country,ed_provider_email, ed_provider_description, ed_provider_institute_code) VALUES(?,?,?,?,?,?,?,?,?,?)`;
   const PARAMS = [req.body.provider_name, req.body.provider_phone,req.body.provider_nif,req.body.provider_website,req.body.provider_address,
   req.body.provider_city,req.body.provider_country,req.body.provider_email,req.body.provider_description, GetCurrentUserData(1)] ;
   DATABASERUN(res, query , PARAMS, 1);
}

 
const GetSingleProvider = async(req, res)=>{
   const {ID} = req.params; 
   const  query = 'SELECT * FROM eduall_providers WHERE ed_provider_deleted = 0 AND ed_provider_id = ? '; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);
} 

const ProviderDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_providers SET ed_provider_deleted = 1
   WHERE ed_provider_deleted = 0 AND ed_provider_id = ?`; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
}  

const ProviderUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {provider_name, provider_phone, provider_nif, provider_website, provider_address, 
   provider_city, provider_country, provider_email, provider_description } = req.body; 
   const  query = `UPDATE eduall_providers SET ed_provider_title = ?, ed_provider_phone = ?, ed_provider_nif = ?, ed_provider_website = ?,
   ed_provider_address = ?, ed_provider_city = ?, ed_provider_country = ?, ed_provider_email = ?,ed_provider_description = ?
   WHERE ed_provider_deleted = 0 AND ed_provider_id = ?`;
   const PARAMS = [provider_name, provider_phone,provider_nif, provider_website, provider_address, provider_city,
   provider_country,provider_email,provider_description, ID] ;
   DATABASERUN(res, query , PARAMS, 1);
} 

 
module.exports = {GetProviders, RegisterProvider, GetSingleProvider, ProviderDelete, ProviderUpdate};