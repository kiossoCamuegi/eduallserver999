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
 

const GetLessonsContentBySection = async(req, res)=>{
    const {CODE} = req.params; 
      const  query = 'SELECT * FROM eduall_lessons_content WHERE ed_lesson_content_deleted = 0 AND ed_lesson_content_sectionCode = ?';
      const PARAMS = [CODE];
      DATABASERUN(res, query , PARAMS, 0);
}

const GetSingleLessonContent = async(req, res)=>{
    const  {ID} = req.params; 
    const  query = 'SELECT * FROM eduall_lessons_content WHERE ed_lesson_content_deleted = 0 AND ed_lesson_content_id = ? ';
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 0);
} 



const GetSingleLessonContentBySection = async(req, res)=>{
   const  {ID} = req.params; 
   const  query = 'SELECT * FROM eduall_lessons_content WHERE ed_lesson_content_deleted = 0 AND ed_lesson_content_sectionCode = ? ';
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);
} 

const RegisterLessonContent = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_lessons_content(ed_lesson_content_code ,ed_lesson_content_title, ed_lesson_content_subtitle,  ed_lesson_content_sectionCode,  
   ed_lesson_content_description, ed_lesson_content_level, ed_lesson_content_instituteCode) VALUES(?,?,?,?,?,?,?)`;
   const PARAMS =  [req.body.lesson_code, req.body.lesson_title, req.body.lesson_subtitle, req.body.lesson_section, req.body.lesson_description, 
   req.body.lesson_level, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);
} 
 

const LessonContentSectionDelete = async(req, res)=>{
   const {ID} = req.params;
   const  query = `UPDATE eduall_lessons_content SET ed_lesson_content_deleted = 1
   WHERE ed_lesson_content_deleted = 0 AND ed_lesson_content_id = ?`;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
}  

const LessonContentSectionUpdate = async(req, res)=>{
    const {ID} = req.params;
    const {lesson_content_title, lesson_content_section, lesson_content_description, lesson_content_position} = req.body; 
      const  query = `UPDATE eduall_lessons_content SET ed_lesson_content_title = ?, ed_lesson_content_sectionCode = ?,
      ed_lesson_content_description = ?, ed_lesson_content_position = ? WHERE ed_lesson_content_deleted = 0 AND ed_lesson_content_id = ?`;
      const PARAMS = [lesson_content_title,  lesson_content_section, lesson_content_description, lesson_content_position, ID];
      DATABASERUN(res, query , PARAMS, 1);
}  

 

const LessonContentSectionUpdatePosition = async(req, res)=>{
   const {ID} = req.params;
   const { lesson_content_position} = req.body; 
   const  query = `UPDATE eduall_lessons_content SET ed_lesson_content_position = ?
   WHERE ed_lesson_content_deleted = 0 AND ed_lesson_content_id = ?`;
   const PARAMS =    [lesson_content_position, ID];
   DATABASERUN(res, query , PARAMS, 1);
}  
 

module.exports = {GetLessonsContentBySection, GetSingleLessonContent,GetSingleLessonContentBySection,
LessonContentSectionDelete, RegisterLessonContent, LessonContentSectionUpdate, LessonContentSectionUpdatePosition };