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
 

const GetSpecificFiles = async(req, res)=>{
    const {CODE } = req.params; 
    const  query = 'SELECT * FROM eduall_files WHERE ed_file_deleted = 0 AND ed_file_code = ?';
    const PARAMS = [CODE];
    DATABASERUN(res, query , PARAMS, 0);
}

const RegisterFile = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_files(ed_file_name, ed_file_code, ed_file_size, ed_file_type, 
   ed_file_extension, ed_file_type_of_use, ed_file_institute_code) VALUES(?,?,?,?,?,?,?)`;
   const PARAMS = [req.file.path,req.body.file_code,req.body.file_size, req.body.file_type,
   req.body.file_extension, req.body.file_use,GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);
}

const storage = multer.diskStorage({
    destination:'assets',
    filename:(req, file,  cb)=>{
       return cb(null, `eduall_file_${file.fieldname}_${Date.now()}_${Math.random(1,38939839398888002)+Math.random(100,389398393993102)}_${path.extname(file.originalname)}`)
    }
});

const uploadFiles = multer({
    storage:storage
}).single('file_name');

module.exports = {GetSpecificFiles, RegisterFile, uploadFiles};