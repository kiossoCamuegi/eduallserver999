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
 
const GetCourse = async(req, res)=>{ 
   const  query = 'SELECT * FROM eduall_courses WHERE ed_course_deleted = 0 AND  ed_course_institute_code = ?';
   const PARAMS = [GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0);
}

const GetsingleCourse = async(req,res)=>{
   const {ID} = req.params; 
   const  query = 'SELECT * FROM eduall_courses WHERE ed_course_deleted = 0 AND ed_course_id = ? ';
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);
}

const RegisterCourse = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_courses(ed_course_title  , ed_course_category,  ed_course_institute_code) VALUES(?,?,?)`;
    const PARAMS = [req.body.course_title, req.body.course_category,  GetCurrentUserData(1)];
    DATABASERUN(res, query , PARAMS, 1); 
}

const CourseDelete = async(req, res)=>{
    const {ID} = req.params; 
   const  query = `UPDATE eduall_courses SET ed_course_deleted = 1
   WHERE ed_course_deleted = 0 AND ed_course_id = ?`;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
} 



const CourseUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {course_title,   course_category} = req.body; 
   const  query = `UPDATE eduall_courses SET ed_course_title = ?,  ed_course_category = ?  WHERE ed_course_deleted = 0 AND ed_course_id = ?`;
   const PARAMS = [course_title, course_category, ID];
   DATABASERUN(res, query , PARAMS, 1); 
} 

module.exports = {GetCourse, GetsingleCourse, RegisterCourse, CourseDelete, CourseUpdate};