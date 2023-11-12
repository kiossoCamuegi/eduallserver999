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
 

const GetSingleStudentOldClasses = async(req, res)=>{
   const  {CODE} = req.params; 
   const  query = 'SELECT * FROM eduall_student_old_classes WHERE  ed_student_old_class_student = ? ';
   const PARAMS = [CODE];
   DATABASERUN(res, query , PARAMS, 0); 
}


const RegisterOldClass = async(req, res)=>{
   const  query = `INSERT INTO eduall_student_old_classes(ed_student_old_class_student, ed_student_old_class) VALUES(?,?)`;
   const PARAMS = [req.body.old_class_student, req.body.old_class_code];
   DATABASERUN(res, query , PARAMS, 1); 
}




module.exports = {GetSingleStudentOldClasses, RegisterOldClass};