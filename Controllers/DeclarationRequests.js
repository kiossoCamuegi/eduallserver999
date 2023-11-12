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
 

const GetDeclarationRequests = async(req, res)=>{ 
   const  query = `SELECT * FROM eduall_declaration_requests 
   LEFT JOIN eduall_students ON eduall_students.ed_student_id =  eduall_declaration_requests.ed_declaration_request_student_code
   WHERE eduall_declaration_requests.ed_declaration_request_deleted = 0 AND eduall_declaration_requests.ed_declaration_request_institute_code = ?`;
   const PARAMS = [GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0);
} 

const GetSingleDeclarationRequest = async(req,res)=>{
   const {ID} = req.params; 
   const  query = `SELECT * FROM eduall_declaration_requests WHERE ed_declaration_request_deleted = 0 AND ed_declaration_request_id = ? `;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);
 }
 

const RegisterDeclarationRequest = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_declaration_requests(ed_declaration_request_student_code, ed_declaration_request_by,
   ed_declaration_request_with_marks,ed_declaration_request_description, ed_declaration_request_institute_code) VALUES(?,?,?,?,?)`;
   const PARAMS = [req.body.declaration_request_student_code, req.body.declaration_request_by,
   req.body.declaration_request_with_marks,req.body.declaration_request_description, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);
}
 

const DeclarationRequestDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_declaration_requests SET ed_declaration_request_deleted = 1
   WHERE ed_declaration_request_deleted = 0 AND ed_declaration_request_id = ?`; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
} 


const DeclarationRequestUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {declaration_request_student_code, declaration_request_by, declaration_request_with_marks, declaration_request_status, declaration_request_description} = req.body; 
   const  query = `UPDATE eduall_declaration_requests SET ed_declaration_request_student_code = ? , ed_declaration_request_by = ?,
   ed_declaration_request_with_marks = ?, ed_declaration_request_status = ?, ed_declaration_request_description = ? WHERE ed_declaration_request_deleted = 0 AND ed_declaration_request_id = ?`;
    const PARAMS = [declaration_request_student_code, declaration_request_by, declaration_request_with_marks, declaration_request_status, declaration_request_description,ID] ;
    DATABASERUN(res, query , PARAMS, 1);
} 



module.exports = {GetDeclarationRequests, GetSingleDeclarationRequest, RegisterDeclarationRequest, DeclarationRequestDelete, DeclarationRequestUpdate};