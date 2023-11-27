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
 

const GetClass = async(req, res)=>{ 
      const  query = 'SELECT * FROM eduall_class WHERE ed_class_deleted = 0 AND ed_class_institute_code = ?';
      const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
      DATABASERUN(res, query , PARAMS, 0);
}

const GetSingleClass = async(req,res)=>{
   const {ID} = req.params; 
   const  query = 'SELECT * FROM eduall_class WHERE ed_class_deleted = 0 AND ed_class_id = ? ';
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);
}
 

const RegisterClass = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_class(ed_class_title ,  ed_class_code, ed_class_course, ed_class_period, ed_class_year,ed_class_room, ed_class_cicle, 
   ed_class_academic_level,ed_class_description,ed_class_subjects, ed_class_institute_code) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
   const PARAMS =  [req.body.class_title ,  req.body.class_code , req.body.class_course, req.body.class_period, 
   req.body.class_year,  req.body.class_room, req.body.class_cicle, req.body.class_academic_level,req.body.class_description ,
   req.body.class_subjects,  req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 1);
}
 

const ClassDelete = async(req, res)=>{
     const {ID} = req.params; 
    const  query = `UPDATE eduall_class SET ed_class_deleted = 1
    WHERE ed_class_deleted = 0 AND ed_class_id = ?`;
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 1);
} 

const ClassUpdate = async(req, res)=>{
   const {ID} = req.params;
   const  {class_title ,  class_code , class_subjects, class_course, class_period, class_year, 
   class_room, class_cicle, class_academic_level, class_description} =  req.body; 
   const  query = `UPDATE eduall_class SET ed_class_title  = ? , ed_class_code  = ?,ed_class_course  = ?,ed_class_period  =  ?,
   ed_class_year  = ?, ed_class_room  = ? ,ed_class_cicle  = ,ed_class_academic_level  = ,
   ed_class_description  = ?, ed_class_subjects  = ?  WHERE ed_class_deleted = 0 AND ed_class_id = ?`;
   const PARAMS =  [class_title , class_code, class_course, class_period,  class_year,class_room,
   class_cicle,class_academic_level,  class_description, class_subjects ,ID];
   DATABASERUN(res, query , PARAMS, 1);
} 


module.exports = {GetClass, GetSingleClass, RegisterClass, ClassDelete, ClassUpdate};