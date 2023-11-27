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
 

const GetCicles = async(req, res)=>{ 
    const  query = 'SELECT * FROM eduall_cicles WHERE ed_cicle_deleted = 0 AND ed_cicle_institute_code = ?';
    const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
    DATABASERUN(res, query , PARAMS, 0);
} 

const GetSingleCicle = async(req,res)=>{
    const {ID} = req.params; 
    const  query = 'SELECT * FROM eduall_cicles WHERE ed_cicle_deleted = 0 AND ed_cicle_id = ? ';
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 0);
 }
 

const RegisterCicle = async(req, res)=>{ 
    const  query = `INSERT INTO eduall_cicles (ed_cicle_title, ed_cicle_code, ed_cicle_institute_code) VALUES(?,?,?)`;
    const PARAMS = [req.body.cicle_title , req.body.cicle_code ,req.session.user.eduall_user_session_curentinstitute] ;
    DATABASERUN(res, query , PARAMS, 1);
} 


const CicleDelete = async(req, res)=>{
    const {ID} = req.params;
    const  query = `UPDATE eduall_cicles SET ed_cicle_deleted = 1
    WHERE ed_cicle_deleted = 0 AND ed_cicle_id = ?`;
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 1);
} 


const CicleUpdate = async(req, res)=>{
    const {ID} = req.params;
    const {cicle_title ,  cicle_code , institute_code} = req.body
    const  query = `UPDATE eduall_cicles SET ed_cicle_title =  ?, ed_cicle_code = ?
    WHERE ed_cicle_deleted = 0 AND ed_cicle_id = ?`; 
    const PARAMS = [cicle_title,cicle_code,ID];
    DATABASERUN(res, query , PARAMS, 1);
} 


            

            


module.exports = {GetCicles, GetSingleCicle, RegisterCicle, CicleDelete, CicleUpdate};