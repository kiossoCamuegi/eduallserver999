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
 
const GetAuthors = async(req, res)=>{ 
     const  query = 'SELECT * FROM eduall_library_authors WHERE ed_library_author_deleted = 0 AND ed_library_author_institute_code = ?';
     const PARAMS = [GetCurrentUserData(1)];
     DATABASERUN(res, query , PARAMS, 0);
}

const GetSingleAuthor = async(req,res)=>{
     const {ID} = req.params; 
    const  query = 'SELECT * FROM eduall_library_authors WHERE ed_library_author_deleted = 0 AND ed_library_author_id = ? ';
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 0);
}
 

const RegisterAuthor = async(req, res)=>{ 
    const  query = `INSERT INTO eduall_library_authors(ed_library_author_name, ed_library_author_status ,ed_library_author_institute_code) VALUES(?,?,?)`;
    const PARAMS = [req.body.author_name,req.body.author_status, GetCurrentUserData(1)];
    DATABASERUN(res, query , PARAMS, 1); 
}
 

const AuthorDelete = async(req, res)=>{
   const {ID} = req.params;
   const  query = `UPDATE eduall_library_authors SET ed_library_author_deleted = 1
   WHERE ed_library_author_deleted = 0 AND ed_library_author_id = ?`;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
} 



const AuthorUpdate = async(req, res)=>{
   const {ID} = req.params;
   const  {author_name, author_status} =  req.body;
   const  query = `UPDATE eduall_library_authors SET ed_library_author_name  = ?, ed_library_author_status = ?
   WHERE ed_library_author_deleted = 0 AND ed_library_author_id = ?`;
   const PARAMS = [author_name, author_status, ID];
   DATABASERUN(res, query , PARAMS, 1);
} 

module.exports = {GetAuthors, GetSingleAuthor, RegisterAuthor, AuthorDelete, AuthorUpdate}