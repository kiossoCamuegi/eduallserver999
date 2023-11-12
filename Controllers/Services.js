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
 

const GetServices = async(req, res)=>{ 
      const  query = 'SELECT * FROM eduall_services WHERE ed_service_deleted = 0 AND ed_service_institute_code = ?';
      const PARAMS = [GetCurrentUserData(1)];
      DATABASERUN(res, query , PARAMS, 0);
}

const GetSingleService = async(req, res)=>{
   const  {ID} = req.params; 
   const  query = 'SELECT * FROM eduall_services WHERE ed_service_deleted = 0 AND ed_service_id = ? ';
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);
}


const RegisterService = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_services(ed_service_title, ed_service_type,ed_service_provider, ed_service_price, ed_service_iva, 
   ed_service_description,ed_service_institute_code) VALUES(?,?,?,?,?,?,?)`;
   const PARAMS = [req.body.service_title,req.body.service_type,req.body.service_provider,req.body.service_price,
   req.body.service_iva,req.body.service_description, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);
}

const ServiceDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_services SET ed_service_deleted = 1
   WHERE ed_service_deleted = 0 AND ed_service_id = ?`; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
} 

const ServiceUpdate = async(req, res)=>{
    const {ID} = req.params;
    const {service_title, service_type, service_iva, service_provider, service_price, service_description} = req.body; 
   const  query = `UPDATE eduall_services SET ed_service_title = ?,ed_service_type = ?,ed_service_provider = ?,ed_service_price = ?,
   ed_service_iva = ?,ed_service_description  = ? WHERE ed_service_deleted = 0 AND ed_service_id = ?`;
   const PARAMS = [service_title, service_type, service_provider, service_price,service_iva, service_description,ID];
   DATABASERUN(res, query , PARAMS, 1);
} 

const ServiceUpdateDiscountData = async(req, res)=>{
    const {ID} = req.params;
    const {discount_parents_childrens, discount_years_of_study, discount_for_scholarship_holders, discount_value} = req.body; 
   const  query = `UPDATE eduall_services SET ed_service_scholarshipHolder = ?, ed_service_guardionChildrens = ?,
   ed_service_studentInstitutePresence = ?, ed_service_discount = ?   WHERE ed_service_deleted = 0 AND ed_service_id = ?`;
   const PARAMS = [discount_for_scholarship_holders, discount_parents_childrens, discount_years_of_study,discount_value,ID];
   DATABASERUN(res, query , PARAMS, 1);
} 


   

module.exports = {GetServices, GetSingleService, RegisterService, ServiceDelete, ServiceUpdate, ServiceUpdateDiscountData};