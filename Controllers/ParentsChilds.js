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
 



const RegisterUserChilds = async(req, res)=>{
   const  query = `SELECT * FROM  eduall_parent_childrens WHERE ed_parent_children_UserCode = ?  AND ed_parent_children_code = ? AND ed_parent_children_deleted =  0`;
   DATABASE.query(query, [req.body.user_child_usercode, req.body.user_child_studentcode], (err, rows)=>{ 
      if(err) return res.status(300).json({msg:"Lamentamos ocorreu um erro ao registrar está informação !", success:false, error:err});
      if(rows.length >= 1) return res.status(300).json({msg:"Este usúario já tem acesso aos dados do estudante selecionado  !", success:false, error:err});
      const  query2 = `INSERT INTO eduall_parent_childrens(ed_parent_children_UserCode,  ed_parent_children_code)VALUES(?,?)`;   
      const PARAMS =  [req.body.user_child_usercode, req.body.user_child_studentcode];
      DATABASERUN(res, query2 , PARAMS, 1);  
   });

    
}


const UserChildDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_parent_childrens SET ed_parent_children_deleted = 1
   WHERE ed_parent_children_deleted = 0 AND ed_parent_children_id = ?`; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
} 
 


const ChewckSingleUserChilds = async(req, res)=>{
   const {USERCODE} = req.params;
   const  query = `SELECT * FROM  eduall_parent_childrens WHERE ed_parent_children_UserCode = ?  AND ed_parent_children_code = ? AND ed_parent_children_deleted =  0`;   
   const PARAMS =  [USERCODE];
   DATABASERUN(res, query , PARAMS, 0);  
}

const GetSingleUserChilds = async(req, res)=>{ 
   const ID = req.session.user.eduall_user_session_ID; 
   const  query = `SELECT * FROM eduall_parent_childrens LEFT JOIN eduall_students ON  
   eduall_parent_childrens.ed_parent_children_code = eduall_students.ed_student_id
   LEFT JOIN eduall_institutes ON eduall_students.ed_student_institute_code = eduall_institutes.ed_institute_code
   WHERE eduall_institutes.ed_institute_deleted = 0 AND  eduall_students.ed_student_deleted = 0 AND
   eduall_parent_childrens.ed_parent_children_deleted = 0 AND  eduall_parent_childrens.ed_parent_children_UserCode = ?`;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);  
}



const GetUserChilds = async(req, res)=>{ 
   const{ ID } = req.params; 
   const  query = `SELECT * FROM eduall_parent_childrens LEFT JOIN eduall_students ON  
   eduall_parent_childrens.ed_parent_children_code = eduall_students.ed_student_id
   LEFT JOIN eduall_institutes ON eduall_students.ed_student_institute_code = eduall_institutes.ed_institute_code
   WHERE eduall_institutes.ed_institute_deleted = 0 AND  eduall_students.ed_student_deleted = 0 AND
   eduall_parent_childrens.ed_parent_children_deleted = 0 AND  eduall_parent_childrens.ed_parent_children_UserCode = ?`;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);  
}

const GetParentsUserChildsByInstitute = async(req, res)=>{  
   const  query = `SELECT * FROM eduall_parent_childrens  LEFT JOIN eduall_students ON  
   eduall_parent_childrens.ed_parent_children_code = eduall_students.ed_student_id
   LEFT JOIN eduall_institutes ON eduall_students.ed_student_institute_code = eduall_institutes.ed_institute_code
   LEFT JOIN eduall_user_accounts ON eduall_parent_childrens.ed_parent_children_UserCode = eduall_user_accounts.ed_user_account_id
   WHERE eduall_institutes.ed_institute_deleted = 0 AND  eduall_students.ed_student_deleted = 0 AND eduall_user_accounts.ed_user_account_deleted = 0
   AND  eduall_parent_childrens.ed_parent_children_deleted = 0 AND eduall_institutes.ed_institute_code = ? `;
   const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 0);  
}



module.exports = {GetSingleUserChilds, UserChildDelete,  RegisterUserChilds, ChewckSingleUserChilds, GetUserChilds, GetParentsUserChildsByInstitute};