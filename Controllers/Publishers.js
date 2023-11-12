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
 

const GetPublishers = async(req, res)=>{ 
      const  query = 'SELECT * FROM eduall_library_publishers WHERE ed_library_publisher_deleted = 0 AND ed_library_publisher_institute_code = ?';
      const PARAMS = [GetCurrentUserData(1)];
      DATABASERUN(res, query , PARAMS, 0);
}

const GetSinglePublisher = async(req,res)=>{
   const {ID} = req.params; 
      const  query = 'SELECT * FROM eduall_library_publishers WHERE ed_library_publisher_deleted = 0 AND ed_library_publisher_id = ? ';
      const PARAMS = [ID];
      DATABASERUN(res, query , PARAMS, 0);
}
 

const RegisterPublisher = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_library_publishers(ed_library_publisher_name, ed_library_publisher_status,
   ed_library_publisher_institute_code) VALUES(?,?,?)`;
   const PARAMS = [req.body.publisher_name, req.body.publisher_status , GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);
}

const PublisherDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_library_publishers SET ed_library_publisher_deleted = 1
   WHERE ed_library_publisher_deleted = 0 AND ed_library_publisher_id = ?`; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
} 
 
const PublisherUpdate = async(req, res)=>{
   const {ID} = req.params;
   const  {publisher_name, publisher_status} =  req.body; 
   const  query = `UPDATE eduall_library_publishers SET ed_library_publisher_name  = ?, ed_library_publisher_status  = ? 
   WHERE ed_library_publisher_deleted = 0 AND ed_library_publisher_id = ?`;
   const PARAMS = [publisher_name , publisher_status ,ID] ;
   DATABASERUN(res, query , PARAMS, 1);
} 


module.exports = {GetPublishers, GetSinglePublisher, RegisterPublisher, PublisherDelete, PublisherUpdate};