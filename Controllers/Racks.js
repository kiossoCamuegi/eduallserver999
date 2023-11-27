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
 
const GetRacks = async(req, res)=>{
   const  query = 'SELECT * FROM eduall_library_racks WHERE ed_library_rack_deleted = 0 AND ed_library_rack_institute_code = ?';
   const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
    DATABASERUN(res, query , PARAMS, 0);
}

const GetSingleRack = async(req,res)=>{
   const {ID} = req.params; 
   const  query = 'SELECT * FROM eduall_library_racks WHERE ed_library_rack_deleted = 0 AND ed_library_rack_id = ? ';
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);
}
 

const RegisterRack = async(req, res)=>{
   const  query = `INSERT INTO eduall_library_racks(ed_library_rack_name, ed_library_rack_status, ed_library_rack_institute_code) VALUES(?,?,?)`;
   const PARAMS = [req.body.rack_name, req.body.rack_status, req.session.user.eduall_user_session_curentinstitute];
    DATABASERUN(res, query , PARAMS, 1);
}
 


const RackDelete = async(req, res)=>{
    const {ID} = req.params;  
    const  query = `UPDATE eduall_library_racks SET ed_library_rack_deleted = 1
    WHERE ed_library_rack_deleted = 0 AND ed_library_rack_id = ?`; 
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 1);
} 



const RackUpdate = async(req, res)=>{
   const {ID} = req.params;
   const  {rack_name, rack_status} =  req.body;   
   const  query = `UPDATE eduall_library_racks SET ed_library_rack_name  = ?, ed_library_rack_status = ? 
   WHERE ed_library_rack_deleted = 0 AND ed_library_rack_id = ?`;  
   const PARAMS =   [rack_name ,rack_status ,ID];
   DATABASERUN(res, query , PARAMS, 1);
} 

      

module.exports = {GetRacks, GetSingleRack, RegisterRack, RackDelete, RackUpdate};