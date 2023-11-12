
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
 

 const GetTransportDrivers = async(req, res)=>{ 
   const  query = 'SELECT * FROM eduall_transport_drivers WHERE ed_transport_driver_deleted = 0 AND  ed_transport_driver_institute_code = ?';
   const PARAMS = [GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0);  
}

const GetSingleTransportDriver = async(req, res)=>{
    const {ID} = req.params; 
   const  query = 'SELECT * FROM eduall_transport_drivers WHERE ed_transport_driver_deleted = 0 AND ed_transport_driver_id = ? ';
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);      
}

const RegisterTransportDriver = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_transport_drivers(ed_transport_driver_name, ed_transport_driver_neighborhood, ed_transport_driver_status, 
   ed_transport_driver_city,ed_transport_driver_email,ed_transport_driver_nif, ed_transport_driver_phone,
   ed_transport_driver_identification_number,ed_transport_driver_address,  
   ed_transport_driver_picture, ed_transport_driver_institute_code) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
   const PARAMS = [req.body.driver_name,  req.body.driver_neighborhood,req.body.driver_status,req.body.driver_city, 
   req.body.driver_email,req.body.driver_nif, req.body.driver_phone, req.body.driver_identification_number, 
   req.body.driver_address, req.file.path, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);  
}

const TransportDriverDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_transport_drivers SET ed_transport_driver_deleted = 1
   WHERE ed_transport_driver_deleted = 0 AND ed_transport_driver_id = ?`;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);  
} 


const TransportDriverUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {driver_name, driver_neighborhood, driver_status, driver_city, driver_email,
   driver_nif, driver_phone, driver_identification_number, driver_address }  = req.body; 
   const  query = `UPDATE eduall_transport_drivers SET ed_transport_driver_name = ?, ed_transport_driver_neighborhood = ?, ed_transport_driver_status = ?,
   ed_transport_driver_city = ?, ed_transport_driver_email = ?, ed_transport_driver_nif = ?, 
   ed_transport_driver_phone = ?, ed_transport_driver_identification_number = ?, ed_transport_driver_address = ?,  
   ed_transport_driver_picture = ?   WHERE ed_transport_driver_deleted = 0 AND ed_transport_driver_id = ?`;
   const PARAMS = [driver_name, driver_neighborhood,driver_status, driver_city, driver_email, 
   driver_nif, driver_phone,driver_identification_number,driver_address, req.file.path,ID] ;
   DATABASERUN(res, query , PARAMS, 1); 
} 


const storage = multer.diskStorage({
    destination:'images/drivers',
    filename:(req, file,  cb)=>{
       return cb(null, `eduall_file_${file.fieldname}_${Date.now()}_${Math.random(1,389398393993100012002)}_${path.extname(file.originalname)}`)
    }
});

const uploadTransportDriverPicture = multer({
    storage:storage
}).single('driver_picture');

module.exports = {GetTransportDrivers, uploadTransportDriverPicture, GetSingleTransportDriver, RegisterTransportDriver, TransportDriverDelete, TransportDriverUpdate};