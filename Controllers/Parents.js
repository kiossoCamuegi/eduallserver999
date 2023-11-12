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
               if(err) {
                  console.log(err);
                  return res.status(300).json({status:300, success:false, error:err});}
               return res.json(rows);
            });
         }else{
            DATABASE.query(query, params , (err)=>{ 
               if(err) {return res.status(300).json({status:300, success:false, error:err});}
               return res.json("success");
             }); 
         } 
      }else{  
         if(type === 0){
            DB_SQLITE.all(query, params, (err, rows)=>{ 
               if(err) return res.status(300).json({status:300, success:false, error:err});
               return res.json(rows);
            }); 
         }else{
            DB_SQLITE.run(query, params , (err)=>{ 
               if(err) return res.status(300).json({status:300, success:false, error:err});
               return res.json("success");
           }); 
         } 
      } 
   } catch (error) {
      res.status(400).json(error); 
   }  
}
 
const Getparents = async(req, res)=>{ 
      const  query = 'SELECT * FROM eduall_parents WHERE ed_parent_deleted = 0 AND  ed_parent_institute_code = ? ORDER BY ed_parent_name ASC'; 
     const PARAMS = [GetCurrentUserData(1)];
      DATABASERUN(res, query , PARAMS, 0);
}

const GetSingleparent = async(req,res)=>{
   const {ID} = req.params; 
      const  query = 'SELECT * FROM eduall_parents WHERE ed_parent_deleted = 0 AND ed_parent_id = ? '; 
    const PARAMS = [ID];
      DATABASERUN(res, query , PARAMS, 0);
}
 

const RegisterParent = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_parents(ed_parent_name,  ed_parent_code, ed_parent_email, ed_parent_phone, ed_parent_phone2,
   ed_parent_job, ed_parent_address, ed_parent_nacionality, ed_parent_gender, ed_parent_picture,ed_parent_degree_of_kinship,ed_parent_institute_code)
   VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`;   
   const PARAMS =  [req.body.parent_name, req.body.parent_code , req.body.parent_email, req.body.parent_phone, 
   req.body.parent_phone2,req.body.parent_job,req.body.parent_address, req.body.parent_nacionality ,
   req.body.parent_gender,(req.file ? "images/students/"+req.file.filename : ""),req.body.parent_degree_of_kinship, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);        
}


const ParentDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_parents SET ed_parent_deleted = 1
   WHERE ed_parent_deleted = 0 AND ed_parent_id = ?`; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
} 



const ParentUpdate = async(req, res)=>{
   const {ID} = req.params;
   const  {parent_name , parent_degree_of_kinship, parent_gender, parent_email, parent_address, parent_job, parent_phone, parent_phone2, parent_nacionality} =  req.body;
   const  query = `UPDATE eduall_parents SET ed_parent_name = ?, ed_parent_email = ?, ed_parent_phone = ? , ed_parent_phone2 = ?, ed_parent_job = ?,
   ed_parent_gender = ?,ed_parent_address = ?,ed_parent_nacionality = ?,ed_parent_degree_of_kinship = ?,ed_parent_picture = ?
   WHERE ed_parent_deleted = 0 AND ed_parent_id = ?`; 
   const PARAMS = [ parent_name, parent_email, parent_phone, parent_phone2, parent_job, 
   parent_gender, parent_address, parent_nacionality,parent_degree_of_kinship, (req.file ? "images/students/"+req.file.filename : ""),ID];
   DATABASERUN(res, query , PARAMS, 1);
} 


const storage = multer.diskStorage({
    destination:'images/parents',
    filename:(req, file,  cb)=>{
       return cb(null, `eduall_file_${file.fieldname}_${Date.now()}_${Math.random(1,389398393993100012002)}_${path.extname(file.originalname)}`)
    }
});

const uploadParentPicture = multer({
    storage:storage
}).single('parent_picture');

module.exports = {Getparents, GetSingleparent, RegisterParent, ParentDelete, ParentUpdate, uploadParentPicture};