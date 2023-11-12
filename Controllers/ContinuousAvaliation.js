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
 
const GetPoints = async(req, res)=>{ 
      const  query = 'SELECT * FROM eduall_continuous_avaliations WHERE ed_cn_avl_deleted = 0 AND  ed_cn_avl_instituteCode = ?';
      const PARAMS = [GetCurrentUserData(1)];
      DATABASERUN(res, query , PARAMS, 0);
} 

const GetPointsBySubClass = async(req, res)=>{
   const {ID} = req.params; 
   const  query = 'SELECT * FROM eduall_continuous_avaliations WHERE ed_cn_avl_deleted = 0 AND ed_cn_avl_subClass = ? ';
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);
}


const GetSinglePoint = async(req,res)=>{
   const {ID} = req.params; 
   const  query = 'SELECT * FROM eduall_continuous_avaliations WHERE ed_cn_avl_deleted = 0 AND ed_cn_avl_id = ? ';
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);   
} 

const RegisterPoint = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_continuous_avaliations(
   ed_cn_avl_studentCode = ?,  ed_cn_avl_subClass = ?,  ed_cn_avl_score = ?, 
   ed_cn_avl_description = ?, ed_cn_avl_date = ?, ed_cn_avl_instituteCode = ?) VALUES(?,?,?,?,?,?)`;
   const PARAMS =   [req.body.cn_avaliation_studentCode, req.body.cn_avaliation_subClass,  
   req.body.cn_avaliation_score, req.body.cn_avaliation_description, 
   req.body.cn_avaliation_date , GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);
}

const PointDelete = async(req, res)=>{
   const {ID} = req.params;  
   const  query = `UPDATE eduall_continuous_avaliations SET ed_cn_avl_deleted = 1
   WHERE ed_cn_avl_deleted = 0 AND ed_cn_avl_id = ?`; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
}  

const PointUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {cn_avaliation_studentCode, cn_avaliation_classSubject, cn_avaliation_score, cn_avaliation_date,  cn_avaliation_description } = req.body;
   const  query = `UPDATE eduall_continuous_avaliations SET ed_cn_avl_studentCode = ?, ed_cn_avl_subClass = ?, ed_cn_avl_score =  ?, 
   ed_cn_avl_description = ?, ed_cn_avl_date = ?, WHERE ed_cn_avl_deleted = 0 AND ed_cn_avl_id = ?`; 
   const PARAMS =  [cn_avaliation_studentCode, cn_avaliation_classSubject, cn_avaliation_score, 
   cn_avaliation_description, cn_avaliation_date, ID];
   DATABASERUN(res, query , PARAMS, 1);
} 

module.exports = {GetPoints, GetPointsBySubClass, GetSinglePoint, RegisterPoint, PointDelete, PointUpdate};