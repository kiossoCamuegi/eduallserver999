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
 

const GetTransportPassengers = async(req, res)=>{  
   const  query = `SELECT * FROM eduall_transport_passengers 
   LEFT JOIN eduall_services ON  eduall_transport_passengers.ed_transport_passenger_service = eduall_services.ed_service_id
   
   LEFT JOIN eduall_students ON eduall_transport_passengers.ed_transport_passenger_code = eduall_students.ed_student_id
   
   LEFT JOIN eduall_class ON eduall_students.ed_student_class = eduall_class.ed_class_id
   
   LEFT JOIN eduall_transport_stops ON eduall_transport_passengers.ed_transport_passenger_stop = eduall_transport_stops.ed_transport_stop_id

   LEFT JOIN eduall_academic_year ON  eduall_class.ed_class_year = eduall_academic_year.ed_academic_year_id
   
   WHERE eduall_transport_passengers.ed_transport_passenger_deleted = 0 AND  eduall_transport_passengers.ed_transport_passenger_institute_code = ?`;
   const PARAMS = [GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0);  
}

const GetTransportsinglePassenger = async(req,res)=>{
    const {ID} = req.params; 
    const  query = `SELECT * FROM eduall_transport_passengers 
    LEFT JOIN eduall_students ON eduall_transport_passengers.ed_transport_passenger_code = eduall_students.ed_student_id
    WHERE ed_transport_passenger_deleted = 0 AND ed_transport_passenger_id = ?`;
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 0);  
}


const GetTransportsinglePassengerByStudentId = async(req,res)=>{
   const {ID} = req.params; 
   const  query = `SELECT * FROM eduall_transport_passengers 
   LEFT JOIN eduall_students ON eduall_transport_passengers.ed_transport_passenger_code = eduall_students.ed_student_id
   WHERE ed_transport_passenger_deleted = 0 AND eduall_students.ed_student_deleted = 0 AND eduall_students.ed_student_id = ?`;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);  
}


const RegisterTransportPassenger = async(req, res)=>{
   const  query = `INSERT INTO eduall_transport_passengers(ed_transport_passenger_code,ed_transport_passenger_service,
   ed_transport_passenger_stop,ed_transport_passenger_institute_code) VALUES(?,?,?,?)`;
   const PARAMS = [req.body.passenger_code, req.body.passenger_service, req.body.passenger_stop , GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);  
}


const TransportPassengerDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_transport_passengers SET ed_transport_passenger_deleted = 1
   WHERE ed_transport_passenger_deleted = 0 AND ed_transport_passenger_id = ?`;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);  
} 


const TransportPassengerUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {passenger_code, passenger_service, passenger_stop} = req.body; 
   const  query = `UPDATE eduall_transport_passengers SET ed_transport_passenger_code = ?, ed_transport_passenger_service = ?,
   ed_transport_passenger_stop = ?  WHERE ed_transport_passenger_deleted = 0 AND ed_transport_passenger_id = ?`;
   const PARAMS =  [passenger_code,passenger_service, passenger_stop, ID];
   DATABASERUN(res, query , PARAMS, 1);  
} 



module.exports = {GetTransportPassengers, GetTransportsinglePassenger, RegisterTransportPassenger,
GetTransportsinglePassengerByStudentId, TransportPassengerDelete, TransportPassengerUpdate};