const multer = require('multer');
const path = require('path');
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
 

const GetBooks = async(req, res)=>{ 
    const  query = 'SELECT * FROM eduall_library_books WHERE ed_library_book_deleted = 0 AND ed_library_book_institute_code = ?'; 
    const PARAMS = [GetCurrentUserData(1)];
    DATABASERUN(res, query , PARAMS, 0);
}

 
const GetSingleBook = async(req,res)=>{
  const {ID} = req.params; 
  const  query = 'SELECT * FROM eduall_library_books WHERE ed_library_book_deleted = 0 AND ed_library_book_id = ? '; 
  const PARAMS = [ID];
  DATABASERUN(res, query , PARAMS, 0);
}
 

const Registerbook = async(req, res)=>{   
    const  query = `INSERT INTO eduall_library_books(ed_library_book_title, ed_library_book_type, ed_library_book_publisher, ed_library_book_colection, 
    ed_library_book_place_of_publication, ed_library_book_classification, ed_library_book_copy, 
    ed_library_book_subtitle, ed_library_book_author, ed_library_book_subject,
    ed_library_book_price , ed_library_book_year , ed_library_book_acquisition_date, ed_library_book_acquisition_type,ed_library_book_provider, 
    ed_library_book_pages, ed_library_book_rack, ed_library_book_notes, ed_library_book_picture,ed_library_book_institute_code) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const PARAMS = [req.body.book_title, req.body.book_type,  req.body.book_publisher,   req.body.book_colection,  req.body.book_place_of_publication, 
    req.body.book_classification,  req.body.book_copy,  req.body.book_subtitle,  req.body.book_author,  req.body.book_subject, req.body.book_price, 
    req.body.book_year,  req.body.book_acquisition_date,  req.body.book_acquisition_type, req.body.book_provider,  req.body.book_pages,  
    req.body.book_rack,  req.body.book_notes, req.file.path,GetCurrentUserData(1)];  
    DATABASERUN(res, query , PARAMS, 1);
}
 

const BookDelete = async(req, res)=>{
     const {ID} = req.params; 
     const  query = `UPDATE eduall_library_books SET ed_library_book_deleted = 1
     WHERE ed_library_book_deleted = 0 AND ed_library_book_id = ?`;
     const PARAMS = [ID];
     DATABASERUN(res, query , PARAMS, 1);
} 



const BookUpdate = async(req, res)=>{
  const {ID} = req.params;
  const {typeofbook_title ,  typeofbook_code} =  req.body; 
  const query = `UPDATE eduall_library_books SET ed_library_book_title = ?, ed_library_book_code = ? 
  WHERE ed_library_book_deleted = 0 AND ed_library_book_id = ?`; 
  const PARAMS = [typeofbook_title ,  typeofbook_code, ID];
  DATABASERUN(res, query , PARAMS, 1);
} 


const storage = multer.diskStorage({
    destination:'images/books',
    filename:(req, file,  cb)=>{
       return cb(null, `eduall_file_${file.fieldname}_${Date.now()}_${Math.random(1,389398393993100012002)}_${path.extname(file.originalname)}`)
    }
});

const uploadBookCover = multer({
    storage:storage
}).single('book_cover');

module.exports = {GetBooks,   GetSingleBook, Registerbook, BookDelete, BookUpdate, uploadBookCover}