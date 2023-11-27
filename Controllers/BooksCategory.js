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
 
const GetBookCategories = async(req, res)=>{ 
      const  query = 'SELECT * FROM eduall_library_categories WHERE ed_library_category_deleted = 0 and ed_library_category_institute_code = ?'; 
      const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
      DATABASERUN(res, query , PARAMS, 0);
}

const GetSingleBookCategory = async(req,res)=>{
   const {ID} = req.params; 
   const  query = 'SELECT * FROM eduall_library_categories WHERE ed_library_category_deleted = 0 AND ed_library_category_id = ? ';
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);
}
 

const RegisterBookCategory = async(req, res)=>{ 
      const  query = `INSERT INTO eduall_library_categories(ed_library_category_title, ed_library_category_code, 
      ed_library_category_institute_code) VALUES(?,?,?)`;
      const PARAMS = [req.body.category_title , req.body.category_code , req.session.user.eduall_user_session_curentinstitute];
      DATABASERUN(res, query , PARAMS, 1); 
}
 

const BookCategoryDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_library_categories SET ed_library_category_deleted = 1
    WHERE ed_library_category_deleted = 0 AND ed_library_category_id = ?`; 
    const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
} 

const BookCategoryUpdate = async(req, res)=>{
   const {ID} = req.params;
   const  {category_title ,  category_code} =  req.body; 
   const  query = `UPDATE eduall_library_categories SET ed_library_category_title  = ?, ed_library_category_code  = ?
   WHERE ed_library_category_deleted = 0 AND ed_library_category_id = ?`; 
   const PARAMS = [category_title ,  category_code,ID];
   DATABASERUN(res, query , PARAMS, 1);
} 


module.exports = {GetBookCategories, GetSingleBookCategory, RegisterBookCategory, BookCategoryDelete, BookCategoryUpdate}