const jwt   = require("jsonwebtoken");  
const {LocalStorage} =  require('node-localstorage');
const CheckInternet = require("../config/CheckInternet");
 const { DB_SQLITE, DATABASE } = require("../config/Database");
const { GetCurrentUserData } = require("./GetCurrentUserData");
const CalculateRemainingDays = require("../config/CalculateRemainingDays");
var localStorage = new LocalStorage('./scratch'); 



const RefreshToken = async(req, res)=>{  
    if(CheckInternet()){
        try {
           const refreshToken =   req.cookies.refreshToken ? req.cookies.refreshToken :   (localStorage.getItem("eduall_user_token") ? localStorage.getItem("eduall_user_token") : false);
           const AdminUsername =   req.cookies.AdminUsername ? req.cookies.AdminUsername :   (localStorage.getItem("AdminUsername") ? localStorage.getItem("AdminUsername") : false);
  
           if(!refreshToken){if(!localStorage.getItem("eduall_user_token"))  return res.status(400).json("something went wrong")}; 
  
 
           //CHECK FOR USERNAME
           if(AdminUsername && localStorage.getItem("AdminUsername") ){ 
           const  query = `SELECT * FROM  eduall_employees LEFT JOIN  eduall_user_accounts ON
           eduall_employees.ed_employee_email = eduall_user_accounts.ed_user_account_email  LEFT JOIN  eduall_system_accounts ON
           eduall_system_accounts.ed_system_account_employee = eduall_employees.ed_employee_id

           
           LEFT JOIN eduall_institutes ON eduall_institutes.ed_institute_code = eduall_system_accounts.ed_system_account_institute_code  
           LEFT JOIN eduall_institutes_licences ON eduall_institutes_licences.ed_institute_licence_instituteCode = eduall_system_accounts.ed_system_account_institute_code


           WHERE  eduall_user_accounts.ed_user_account_deleted = 0 AND 
           eduall_employees.ed_employee_deleted = 0 AND  eduall_system_accounts.ed_system_account_name = ?  AND eduall_user_accounts.ed_usertoken = ?`;



           DATABASE.query(query, [AdminUsername, refreshToken], (err, row)=>{ 
              if(err) return res.json(err); 
              if(!row[0]) return  res.sendStatus(401);
              jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded)=>{

                if(CalculateRemainingDays(row[0].ed_institute_licence_startDate, row[0].ed_institute_licence_endDate) <= 0) {

                   return res.status(300).json({msg:"Acesso bloqueiado, renove a sua licença *!", data1:AdminUsername , data2:localStorage.getItem("AdminUsername") })
               }
                

                  if(err) {
                     console.log(err);
                     return res.sendStatus(401);
                  }
                  const cr_usercode = row[0].ed_user_account_id;
                  const cr_username = row[0].ed_user_account_name;
                  const cr_useremail = row[0].ed_user_account_email;
                  const cr_usertype = 0;
                  const cr_username_id =  row[0].ed_system_account_id;
                  const cr_user_largecode = row[0].ed_user_account_code;
                  const accessToken = jwt.sign({cr_usercode, cr_user_largecode, cr_username_id, cr_username, cr_useremail, cr_usertype}, process.env.ACCESS_TOKEN_SECRET,{
                     expiresIn:'15s'
                  });
  
                  const  query2 = `SELECT * FROM eduall_user_institutes
                  LEFT JOIN eduall_institutes ON   eduall_user_institutes.ed_user_institute_code = eduall_institutes.ed_institute_code 
                  LEFT JOIN eduall_institutes_licences ON eduall_institutes_licences.ed_institute_licence_instituteCode =  eduall_user_institutes.ed_user_institute_code  
                  WHERE eduall_user_institutes.ed_user_institute_deleted = 0 AND  eduall_user_institutes.ed_user_institute_userCode = ? AND eduall_institutes.ed_institute_code = ?`;
                  DATABASE.query(query2, [cr_usercode, row[0].ed_system_account_institute_code], (err, rows)=>{ 
                      if(err) {
                        console.log(err) 
                        return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
                     }
                      if(rows.length >= 1){

                     

                        if(CalculateRemainingDays(rows[0].ed_institute_licence_startDate, rows[0].ed_institute_licence_endDate) <= 0){ 
                            localStorage.setItem('eduall_user_curentinstitute', null); 
                            localStorage.setItem('eduall_user_curent', cr_usercode);  
                        }else{ 
                          localStorage.setItem('eduall_user_curentinstitute', rows[0].ed_institute_code); 
                          localStorage.setItem('eduall_user_curent', cr_usercode); 
                        }
                   
                      }else{
                          localStorage.setItem('eduall_user_curentinstitute', null); 
                          localStorage.setItem('eduall_user_curent', cr_usercode); 
                      } 
                  }) 
                  
                  res.json({accessToken});
              });
           }); 
           }else{ 


              const  query = 'SELECT * FROM eduall_user_accounts WHERE ed_user_account_deleted = 0 AND ed_usertoken = ?';
              DATABASE.query(query, [refreshToken], (err, row)=>{ 
                 if(err){
                  console.log(err) 
                  return res.json(err); 
                 } 
                 if(row.length <= 0) return  res.sendStatus(401);
                 jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded)=>{
                     if(err) return res.sendStatus(401);
                     const cr_usercode = row[0].ed_user_account_id;
                     const cr_username = row[0].ed_user_account_name;
                     const cr_useremail = row[0].ed_user_account_email;
                     const cr_usertype = 1;
                     const cr_user_largecode = row[0].ed_user_account_code;
                     const accessToken = jwt.sign({cr_usercode, cr_user_largecode, cr_username, cr_useremail, cr_usertype}, process.env.ACCESS_TOKEN_SECRET,{
                        expiresIn:'15s'
                     });
  
                     localStorage.setItem('eduall_user_curentinstitute', null); 
                     localStorage.setItem('eduall_user_curent', cr_usercode); 
                     res.json({accessToken});
                 });
              }); 
           } 
        } catch (error) {
         console.log(error);
              res.json(error)
        }
      } else{
        return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
      }
}

module.exports = RefreshToken;