
const bcrypt  = require("bcryptjs")
const jwt   = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');  
const RefreshToken  = require("./RefreshToken");
const nodeMailer = require("nodemailer");
const store  = require("store2");
const CheckInternet = require("../config/CheckInternet");  
const { DB_SQLITE, DATABASE } = require("../config/Database"); 
const { GetCurrentUserData } = require("./GetCurrentUserData");
const SendEmailMessage = require("./SendEmailMessage"); 


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
  


const GetStudentsUserAccounts = async(req, res)=>{  
    const  query = `SELECT * FROM eduall_users_student_accounts LEFT JOIN eduall_students ON 
    eduall_users_student_accounts.ed_user_std_account_studentCode =  eduall_students.ed_student_id
    WHERE  eduall_users_student_accounts.ed_user_std_account_deleted = 0 AND  eduall_students.ed_student_deleted = 0 AND
    eduall_users_student_accounts.ed_user_std_account_instituteCode = ? ORDER BY eduall_students.ed_employee_name ASC`;
    const PARAMS = [GetCurrentUserData(1)];
    DATABASERUN(res, query , PARAMS, 0);
}



const GetSingleUserStudentAccounts = async(req, res)=>{  
   const  query = `SELECT * FROM eduall_users_student_accounts LEFT JOIN eduall_students ON  

    eduall_users_student_accounts.ed_user_std_account_studentCode = eduall_students.ed_student_id

    LEFT JOIN eduall_institutes ON eduall_students.ed_student_institute_code = eduall_institutes.ed_institute_code

   WHERE eduall_institutes.ed_institute_deleted = 0 AND  eduall_users_student_accounts.ed_user_std_account_userCode = ? AND
   
   eduall_students.ed_student_deleted = 0 
   `;
   const PARAMS = [GetCurrentUserData(0)];
   DATABASERUN(res, query , PARAMS, 0);  
}



const RegisterStudentUserAccount = async(req, res)=>{   
    const {student_account_usercode,  student_account_studentcode} = req.body;   
    if(CheckInternet() === true){    
        const  query2 = `SELECT * FROM eduall_users_student_accounts WHERE ed_user_std_account_deleted = 0 
        AND ed_user_std_account_userCode = ?  AND ed_user_std_account_instituteCode   = ?`;
        DATABASE.query(query2, [student_account_usercode, GetCurrentUserData(1)], (err, rows)=>{ 

                if(err) return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
                if(rows.length >= 1) return res.status(300).json({msg:"Já foi atribuido um estudante á esta conta !"}); 

                const  query3 = `SELECT * FROM  eduall_students LEFT JOIN  eduall_user_accounts ON
                eduall_students.ed_student_email = eduall_user_accounts.ed_user_account_email  WHERE
                eduall_user_accounts.ed_user_account_deleted = 0 AND 
                eduall_students.ed_student_deleted = 0 AND eduall_students.ed_student_id = ?  `;

                 //check if student and user accoutn exist 
                DATABASE.query(query3, [student_account_studentcode], (err, rows)=>{ 
                if(err) return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
                    if(rows.length <= 0) return res.status(300).json({msg:"Não existe nenhuma conta associada ao email deste estudante !"});

                    const  query4 = `SELECT * FROM eduall_users_student_accounts 
                    LEFT JOIN eduall_students ON  eduall_users_student_accounts.ed_user_std_account_studentCode =  eduall_students.ed_student_id 
                    WHERE eduall_users_student_accounts.ed_user_std_account_deleted = 0 AND  eduall_students.ed_student_institute_code = ?
                    AND eduall_users_student_accounts.ed_user_std_account_studentCode = ?  AND  eduall_users_student_accounts.ed_user_std_account_instituteCode = ?`; 
                    DATABASE.query(query4, [GetCurrentUserData(1), student_account_studentcode ,  GetCurrentUserData(1)], (err, rows)=>{ 
                        if(err) return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
                            if(rows.length >= 1) return res.status(300).json({msg:"Já foi atribuido um estudante á esta conta !"}); 
                            RegisterData();
                        });  
                }); 
            });
         
    }else{
       res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
    }
              
      
 const RegisterData = ()=>{ 
    const  query = `INSERT INTO eduall_users_student_accounts(ed_user_std_account_userCode,  ed_user_std_account_studentCode, 
    ed_user_std_account_instituteCode) VALUES(?,?,?)`; 
    const PARAMS = [student_account_usercode, student_account_studentcode ,  GetCurrentUserData(1)];  
     DATABASE.query(query, PARAMS, (err)=>{ 
        if(err) return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
        return res.status(200).json({msg:" success !"}); 
     }); 
  } 


 
} 

module.exports = {RegisterStudentUserAccount, GetSingleUserStudentAccounts};