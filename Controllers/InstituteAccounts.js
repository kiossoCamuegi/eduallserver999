
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
  


const GetInstituteUserAccounts = async(req, res)=>{  
    const  query = `SELECT * FROM eduall_system_accounts LEFT JOIN eduall_employees ON 
    eduall_system_accounts.ed_system_account_employee =  eduall_employees.ed_employee_id
    WHERE  eduall_system_accounts.ed_system_account_deleted = 0 AND  eduall_employees.ed_employee_deleted = 0 AND
    eduall_system_accounts.ed_system_account_institute_code = ? ORDER BY eduall_employees.ed_employee_name ASC`;
    const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
    DATABASERUN(res, query , PARAMS, 0);
}




const RegisterInstituteUserAccount = async(req, res)=>{   
    const {user_account_name,  user_account_employee} = req.body;  
    const  query = `INSERT INTO eduall_system_accounts(ed_system_account_name,  ed_system_account_employee, ed_system_account_institute_code) VALUES(?,?,?)`; 
    const PARAMS = [user_account_name.toLowerCase(), user_account_employee ,  req.session.user.eduall_user_session_curentinstitute]; 

    if(CheckInternet() === true){   
    if(user_account_name.split("").length >= 5){ 
        const  query2 = `SELECT * FROM eduall_system_accounts WHERE ed_system_account_deleted = 0 AND ed_system_account_name = ?`;
        DATABASE.query(query2, [user_account_name.toLowerCase()], (err, rows)=>{ 
            if(err) return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
                if(rows.length >= 1) return res.status(300).json({msg:"Este nome dé usúario já esta a ser utilizado !"}); 
                const  query3 = `SELECT * FROM  eduall_employees LEFT JOIN  eduall_user_accounts ON
                eduall_employees.ed_employee_email = eduall_user_accounts.ed_user_account_email  WHERE
                eduall_user_accounts.ed_user_account_deleted = 0 AND 
                eduall_employees.ed_employee_deleted = 0 AND eduall_employees.ed_employee_id = ?  `;
                DATABASE.query(query3, [user_account_employee], (err, rows)=>{ 
                if(err) return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
                    if(rows.length <= 0) return res.status(300).json({msg:"Não existe nenhuma conta associada ao email deste funcionario !"});

                    const  query4 = `SELECT * FROM eduall_system_accounts 
                    LEFT JOIN eduall_employees ON  eduall_system_accounts.ed_system_account_employee =  eduall_employees.ed_employee_id 
                    WHERE ed_system_account_deleted = 0 AND  eduall_employees.ed_employee_institute_code = ?
                    AND ed_system_account_employee = ?  AND  ed_system_account_institute_code = ?`; 
                    DATABASE.query(query4, [req.session.user.eduall_user_session_curentinstitute, user_account_employee ,  req.session.user.eduall_user_session_curentinstitute], (err, rows)=>{ 
                        if(err) return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
                            if(rows.length >= 1) return res.status(300).json({msg:"Este funcionario já tem uma conta associada  a esta instituição!"}); 
                            RegisterData();
                        });  
                }); 
            });
        }else{
            return res.status(300).json({msg:"O nome inserido não foi validado !"});
        } 
    } 
              
      
    const RegisterData = ()=>{ 
     DATABASE.query(query, PARAMS, (err)=>{ 
        if(err) return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
         try {   
            //add useraccess 
            const  query4 = `SELECT * FROM eduall_system_accounts WHERE ed_system_account_deleted = 0 
            AND ed_system_account_employee = ?  AND  ed_system_account_institute_code = ?`; 
            DATABASE.query(query4, [user_account_employee ,  req.session.user.eduall_user_session_curentinstitute], (err, rows)=>{ 
                if(err) return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
                    if(rows.length >= 1){ 
                        const {
                            access_myschool, access_secretary, access_admnistration,access_finance, access_pedagogy,
                            access_transportation,access_library,  access_system, access_configuration
                        } = req.body;  
                        const  query2 = `INSERT INTO eduall_user_access(ed_user_access_usercode, ed_user_access_myinstitute, ed_user_access_secretary,ed_user_access_administration, 
                            ed_user_access_finances, ed_user_access_pedagogicalarea, ed_user_access_transportation, ed_user_access_library, ed_user_access_system, 
                            ed_user_access_configuration,ed_user_access_institute_code) VALUES(?,?,?,?,?,?,?,?,?,?,?)`; 
                        const PARAMS = [rows[0].ed_system_account_id, access_myschool, access_secretary, access_admnistration,access_finance, access_pedagogy,
                        access_transportation,access_library,  access_system, access_configuration,  req.session.user.eduall_user_session_curentinstitute]; 
            
                        DATABASE.query(query2, PARAMS, (err)=>{ 
                            if(err){
                                //delete the account 
                                const  query3 = `DELETE FROM eduall_system_accounts WHERE ed_system_account_name = ?`; 
                                DATABASE.query(query3, [user_account_name.toLowerCase()] , (err)=>{ 
                                    if(err) return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
                                    return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
                                });
                                return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});
                            } 
                            // send notification request if not delete the account and all access
            
                            return res.status(200).json({msg:" success !"}); 
                        }); 
                    }else{
                        return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});
                    }
               });   
         } catch (error) {
            return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
         }
     }); 
    } 


 
} 

module.exports = {RegisterInstituteUserAccount, GetInstituteUserAccounts};