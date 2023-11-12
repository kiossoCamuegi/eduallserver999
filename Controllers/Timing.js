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
 


const GetTimings = async(req, res)=>{ 
    const  query = 'SELECT * FROM eduall_timing WHERE ed_timing_deleted = 0 AND  ed_timing_institute_code = ?'; 
    const PARAMS = [GetCurrentUserData(1)];
    DATABASERUN(res, query , PARAMS, 0);  
} 

const GetSingleTiming = async(req,res)=>{
    const {ID} = req.params; 
   const  query = 'SELECT * FROM eduall_timing WHERE ed_timing_deleted = 0 AND ed_timing_id = ? ';
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);  
 } 

const RegisterTiming = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_timing(ed_timing_hour_start,ed_timing_minute_start,ed_timing_hour_end,
   ed_timing_minute_end,ed_timing_institute_code) VALUES(?,?,?,?,?)`;
   const PARAMS = [req.body.timing_hour_start,req.body.timing_minute_start,
   req.body.timing_hour_end,req.body.timing_minute_end, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);  
}  


const TimingDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_timing SET ed_timing_deleted = 1
   WHERE ed_timing_deleted = 0 AND ed_timing_id = ?`; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);  
}  


const TimingUpdate = async(req, res)=>{
   const {ID} = req.params;  
   const  query = `UPDATE eduall_timing SET ed_timing_hour_start = ? , ed_timing_minute_start = ?, ed_timing_hour_end = ?, 
   ed_timing_minute_end = ? WHERE ed_timing_deleted = 0 AND ed_timing_id = ?`; 
   const PARAMS =  [req.body.timing_hour_start, req.body.timing_minute_start,
   req.body.timing_hour_end,req.body.timing_minute_end, ID];
   DATABASERUN(res, query , PARAMS, 1);  
} 

 


module.exports = {GetTimings, GetSingleTiming, RegisterTiming, TimingDelete, TimingUpdate};