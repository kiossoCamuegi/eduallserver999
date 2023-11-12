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
 

const GetTitleAndHeaders = async(req, res)=>{ 
   const  query = 'SELECT * FROM eduall_titles WHERE ed_title_deleted = 0 AND  ed_title_institute_code = ?';
   const PARAMS = [GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0);  
}

const GetSingleTitleAndHeader = async(req,res)=>{
   const {ID} = req.params;
   const  query = 'SELECT * FROM eduall_titles WHERE ed_title_deleted = 0 AND ed_title_id = ? ';
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);  
}
 
const RegisterTitleAndHeader = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_titles(ed_title_name, ed_title_for, ed_title_description ,
   ed_title_institute_code) VALUES(?,?,?,?)`;
   const PARAMS = [req.body.title_name, req.body.title_for, req.body.title_description, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);  
 }

const TitleAndHeaderDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_titles SET ed_title_deleted = 1  WHERE ed_title_deleted = 0 AND ed_title_id = ?`; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);  
} 


const TitleAndHeaderUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {title_name, title_for, title_description} = req.body;
   const  query = `UPDATE eduall_titles SET ed_title_name = ?, ed_title_for = ?, ed_title_description = ?
   WHERE ed_title_deleted = 0 AND ed_title_id = ?`; 
   const PARAMS =  [title_name,title_for,title_description, ID];
   DATABASERUN(res, query , PARAMS, '');  
} 



module.exports = {GetTitleAndHeaders, GetSingleTitleAndHeader, RegisterTitleAndHeader, TitleAndHeaderDelete, TitleAndHeaderUpdate};