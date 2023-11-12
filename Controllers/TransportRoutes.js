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
 


const GetTransportRoutes = async(req, res)=>{  
   const  query = 'SELECT * FROM eduall_transport_routes WHERE ed_transport_route_deleted = 0 AND  ed_transport_route_institute_code = ?';
   const PARAMS = [GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0); 
}

const GetsingleTransportRoute = async(req,res)=>{
    const {ID} = req.params; 
   const  query = 'SELECT * FROM eduall_transport_routes WHERE ed_transport_route_deleted = 0 AND ed_transport_route_id = ? ';
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0); 
}

const RegisterTransportRoute = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_transport_routes(ed_transport_route_name, ed_transport_route_vehicle, ed_transport_route_map, ed_transport_route_description,  
   ed_transport_route_institute_code) VALUES(?,?,?,?,?)`;
   const PARAMS = [req.body.route_name, req.body.route_vehicle, req.body.route_map, req.body.route_description, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0); 
}


const TransportRouteDelete = async(req, res)=>{ 
   const {ID} = req.params; 
   const  query = `UPDATE eduall_transport_routes SET ed_transport_route_deleted = 1
   WHERE ed_transport_route_deleted = 0 AND ed_transport_route_id = ?`; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1); 
} 

const TransportRouteUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {route_name, route_description, route_map, route_vehicle } = req.body;  
   const  query = `UPDATE eduall_transport_routes SET ed_transport_route_name = ?, ed_transport_route_vehicle = ?, ed_transport_route_map = ?,
   ed_transport_route_description = ? WHERE ed_transport_route_deleted = 0 AND ed_transport_route_id = ?`;
   const PARAMS = [route_name,route_vehicle, route_map,route_description , ID];
   DATABASERUN(res, query , PARAMS, 1); 
} 


module.exports = {GetTransportRoutes, GetsingleTransportRoute, RegisterTransportRoute, TransportRouteDelete, TransportRouteUpdate};