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
 

const GetBorrowedBooks = async(req, res)=>{ 
      const  query = 'SELECT * FROM eduall_library_borrowed_books WHERE ed_library_borrowed_book_deleted = 0 AND  ed_library_borrowed_book_institute_code = ?';
      const PARAMS = [GetCurrentUserData(1)];
      DATABASERUN(res, query , PARAMS, 0);
}

const GetSingleBorrowedBook = async(req,res)=>{
   const {ID} = req.params; 
   const  query = 'SELECT * FROM eduall_library_borrowed_books WHERE ed_library_borrowed_book_deleted = 0 AND ed_library_borrowed_book_id = ? ';
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);   
}
 

const RegisterBorrowedbook = async(req, res)=>{  
      const  query = `INSERT INTO eduall_library_borrowed_books(ed_library_borrowed_book_usercode , ed_library_borrowed_book_code, ed_library_borrowed_book_devolutionDate,
      ed_library_borrowed_book_institute_code) VALUES(?,?,?,?)`;
      const PARAMS = [req.body.borrow_book_student,req.body.borrow_book_data,req.body.borrow_book_devolution_date,GetCurrentUserData(1)];
      DATABASERUN(res, query , PARAMS, 1);
}
 

const BorrowedBookDelete = async(req, res)=>{
     const {ID} = req.params; 
      const  query = `UPDATE eduall_library_borrowed_books SET ed_library_borrowed_book_deleted = 1
      WHERE ed_library_borrowed_book_deleted = 0 AND ed_library_borrowed_book_id = ?`;
      const PARAMS = [ID];
      DATABASERUN(res, query , PARAMS, 1);  
} 



const BorrowedBookUpdate = async(req, res)=>{
   const {ID} = req.params;
   const  {typeofbook_title ,  typeofbook_code} =  req.body; 
   const  query = `UPDATE eduall_library_borrowed_books SET ed_library_borrowed_book_title  = ? , ed_library_borrowed_book_code  =  ?
   WHERE ed_library_borrowed_book_deleted = 0 AND ed_library_borrowed_book_id = ?`;
   const PARAMS = [typeofbook_title ,  typeofbook_code, ID];
   DATABASERUN(res, query , PARAMS, 1);  
} 


module.exports = {GetBorrowedBooks, GetSingleBorrowedBook,  RegisterBorrowedbook, BorrowedBookDelete, BorrowedBookUpdate};
