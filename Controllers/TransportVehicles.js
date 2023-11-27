const multer = require('multer');
const path = require('path');
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
 


 const GetTransportVehicles = async(req, res)=>{ 
   const  query = 'SELECT * FROM eduall_transport_vehicles WHERE ed_transport_vehicle_deleted = 0 AND  ed_transport_vehicle_institute_code = ?';
   const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 0);  
}

const GetSingleTransportVehicle = async(req, res)=>{
   const {ID} = req.params;  
   const  query = 'SELECT * FROM eduall_transport_vehicles WHERE ed_transport_vehicle_deleted = 0 AND ed_transport_vehicle_id = ? ';
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0); 
}

const RegisterTransportVehicle = async(req, res)=>{  
   const  query = `INSERT INTO eduall_transport_vehicles(ed_transport_vehicle_model,ed_transport_vehicle_plate, ed_transport_vehicle_driver,ed_transport_vehicle_typology, 
   ed_transport_vehicle_capacity,ed_transport_vehicle_value,ed_transport_vehicle_acquisition_date,ed_transport_vehicle_montlyCosts, 
   ed_transport_vehicle_liters,ed_transport_vehicle_owner,ed_transport_vehicle_picture,ed_transport_vehicle_description,  
   ed_transport_vehicle_institute_code) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
   const PARAMS = [req.body.vehicle_model,  req.body.vehicle_plate, req.body.vehicle_driver, req.body.vehicle_typology, 
   req.body.vehicle_capacity,  req.body.vehicle_value, req.body.vehicle_acquisition_date,req.body.vehicle_monthly_costs, 
   req.body.vehicle_liters,req.body.vehicle_owner, req.file.path,req.body.vehicle_description, req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 1);
}

const TransportVehicleDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_transport_vehicles SET ed_transport_vehicle_deleted = 1
   WHERE ed_transport_vehicle_deleted = 0 AND ed_transport_vehicle_id = ?`; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
} 

const TransportVehicleUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {vehicle_model, vehicle_plate,vehicle_driver, vehicle_typology, vehicle_capacity, vehicle_value, vehicle_acquisition_date, 
   vehicle_monthly_costs, vehicle_liters, vehicle_owner, vehicle_description } = req.body;
   const  query = `UPDATE eduall_transport_vehicles SET ed_transport_vehicle_model = ?, ed_transport_vehicle_plate = ?, ed_transport_vehicle_driver = ?, 
   ed_transport_vehicle_typology = ?, ed_transport_vehicle_capacity = ?,ed_transport_vehicle_value = ?, 
   ed_transport_vehicle_acquisition_date = ?, ed_transport_vehicle_montlyCosts = ?, ed_transport_vehicle_liters = ?,
   ed_transport_vehicle_owner = ?, ed_transport_vehicle_picture = ?, ed_transport_vehicle_description = ?
   WHERE ed_transport_vehicle_deleted = 0 AND ed_transport_vehicle_id = ?`;
   const PARAMS = [vehicle_model,vehicle_plate, vehicle_driver,vehicle_typology,vehicle_capacity,vehicle_value,
   vehicle_acquisition_date, vehicle_monthly_costs,vehicle_liters,vehicle_owner,req.file.path, 
   vehicle_description, ID];
   DATABASERUN(res, query , PARAMS, 1);
} 

const storage = multer.diskStorage({
    destination:'images/vehicles',
    filename:(req, file,  cb)=>{
       return cb(null, `eduall_file_${file.fieldname}_${Date.now()}_${Math.random(1,389398393993100012002)}_${path.extname(file.originalname)}`)
    }
});

const uploadTransportVehiclePicture = multer({
    storage:storage
}).single('vehicle_picture');


module.exports = {GetTransportVehicles, GetSingleTransportVehicle, RegisterTransportVehicle, TransportVehicleDelete, TransportVehicleUpdate, uploadTransportVehiclePicture};