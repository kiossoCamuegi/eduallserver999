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


const GetTransportMaintenances = async(req, res)=>{ 
      const  query = 'SELECT * FROM eduall_transport_maintenance WHERE ed_transport_maintenance_deleted = 0 AND  ed_transport_maintenance_institute_code = ?';
      const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
      DATABASERUN(res, query , PARAMS, 0);  
}

const GetsingleTransportMaintenance = async(req,res)=>{
   const {ID} = req.params; 
   const  query = 'SELECT * FROM eduall_transport_maintenance WHERE ed_transport_maintenance_deleted = 0 AND ed_transport_maintenance_id = ? ';
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);  
}

const RegisterTransportMaintenance = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_transport_maintenance(ed_transport_maintenance_vehicle,ed_transport_maintenance_description,
    ed_transport_maintenance_institute_code) VALUES(?,?,?)`;
    const PARAMS = [req.body.maintenance_vehicle, req.body.maintenance_description, req.session.user.eduall_user_session_curentinstitute];
    DATABASERUN(res, query , PARAMS, 1);  
}


const TransportMaintenanceDelete = async(req, res)=>{
   const {ID} = req.params;  
   const  query = `UPDATE eduall_transport_maintenance SET ed_transport_maintenance_deleted = 1
   WHERE ed_transport_maintenance_deleted = 0 AND ed_transport_maintenance_id = ?`; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);  
} 


const TransportMaintenanceUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {maintenance_vehicle, maintenance_description} = req.body; 
   const  query = `UPDATE eduall_transport_maintenance SET ed_transport_maintenance_vehicle =?, ed_transport_maintenance_description = ?
   WHERE ed_transport_maintenance_deleted = 0 AND ed_transport_maintenance_id = ?`; 
   const PARAMS = [maintenance_vehicle, maintenance_description , ID];
   DATABASERUN(res, query , PARAMS, 1);  
} 


module.exports = {GetTransportMaintenances, GetsingleTransportMaintenance, RegisterTransportMaintenance, TransportMaintenanceDelete, TransportMaintenanceUpdate};
