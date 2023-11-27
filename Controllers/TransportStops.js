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
 



const GetTransportStops = async(req, res)=>{  
   const  query = 'SELECT * FROM eduall_transport_stops WHERE ed_transport_stop_deleted = 0 AND  ed_transport_stop_institute_code = ?';
   const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 0); 
}

const GetsingleTransportStop = async(req,res)=>{
   const {ID} = req.params;  
   const  query = 'SELECT * FROM eduall_transport_stops WHERE ed_transport_stop_deleted = 0 AND ed_transport_stop_id = ? '; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0); 
}

const RegisterTransportStop = async(req, res)=>{  
   const  query = `INSERT INTO eduall_transport_stops(ed_transport_stop_name,ed_transport_stop_route,ed_transport_stop_map,
   ed_transport_stop_estimate_of_arrival, ed_transport_stop_institute_code) VALUES(?,?,?,?,?)`;
   const PARAMS = [req.body.stop_name, req.body.stop_route, req.body.stop_map, req.body.stop_estimate_of_arrival, req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 1); 
}

const TransportStopDelete = async(req, res)=>{
   const {ID} = req.params;  
   const  query = `UPDATE eduall_transport_stops SET ed_transport_stop_deleted = 1
   WHERE ed_transport_stop_deleted = 0 AND ed_transport_stop_id = ?`;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1); 
}  

const TransportStopUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {stop_name, stop_route, stop_map, stop_estimate_of_arrival} = req.body; 
   const  query = `UPDATE eduall_transport_stops SET ed_transport_stop_name = ?, ed_transport_stop_route = ?, ed_transport_stop_map = ?,  
   ed_transport_stop_estimate_of_arrival = ? WHERE ed_transport_stop_deleted = 0 AND ed_transport_stop_id = ?`;
   const PARAMS = [stop_name,stop_route,stop_map, stop_estimate_of_arrival,ID];
   DATABASERUN(res, query , PARAMS, 1); 
} 

            


            
 


module.exports = {GetTransportStops, GetsingleTransportStop, RegisterTransportStop, TransportStopDelete, TransportStopUpdate};