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
 

const GetClassroom = async(req, res)=>{ 
    const  query = 'SELECT * FROM eduall_classrooms WHERE ed_classroom_deleted = 0 AND ed_classroom_institute_code = ?'; 
    const PARAMS = [GetCurrentUserData(1)];
    DATABASERUN(res, query , PARAMS, 0);
}


const GetSingleClassroom = async(req, res)=>{
    const {ID} = req.params;
    const  query = 'SELECT * FROM eduall_classrooms WHERE ed_classroom_deleted = 0 AND ed_classroom_id = ? ';
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 0);
}


const RegisterClassRoom = async(req, res)=>{ 
    const  query = `INSERT INTO eduall_classrooms(ed_classroom_title,ed_classroom_code,ed_classroom_description,
    ed_classroom_institute_code) VALUES(?,?,?,?)`;
    const PARAMS = [req.body.title,  req.body.code, req.body.description, GetCurrentUserData(1)];
    DATABASERUN(res, query , PARAMS, 1);
}
 

const ClassRoomDelete = async(req, res)=>{
    const {ID} = req.params;
    const  query = `UPDATE eduall_classrooms SET ed_classroom_deleted = 1
    WHERE ed_classroom_deleted = 0 AND ed_classroom_id = ?`;
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 1);
} 

const ClassRoomUpdate = async(req, res)=>{
    const {ID} = req.params;
    const {title, code, description} = req.body; 
    const  query = `UPDATE eduall_classrooms SET ed_classroom_title = ?, ed_classroom_code = ?, ed_classroom_description = ?
    WHERE ed_classroom_deleted = 0 AND ed_classroom_id = ?`;
    const PARAMS = [title, code, description, ID];
    DATABASERUN(res, query , PARAMS, 0);
} 


module.exports = {GetClassroom, GetSingleClassroom, RegisterClassRoom, ClassRoomUpdate, ClassRoomDelete};