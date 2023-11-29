const bcrypt  = require("bcryptjs")
const jwt   = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');  
const RefreshToken  = require("./RefreshToken");
const nodeMailer = require("nodemailer"); 
const CheckInternet = require("../config/CheckInternet");  
const { DB_SQLITE, DATABASE, SESSION_STORE } = require("../config/Database"); 
const { GetCurrentUserData } = require("./GetCurrentUserData");
const SendEmailMessage = require("./SendEmailMessage");
const { passwordStrength } = require('check-password-strength') 
const CalculateRemainingDays = require("../config/CalculateRemainingDays");
 


const DATABASERUN = (res, query, params, type)=>{
   try { 
      if(CheckInternet() === true){  
         if(type === 0){
            DATABASE.query(query, params, (err, rows)=>{ 
               if(err) return res.status(300).json({status:300, success:false, error:err});
               return res.json(rows);
            });
         }else{
            DATABASE.query(query, params , (err)=>{ 
               if(err) {
                console.log(err) 
                return res.status(300).json({status:300, success:false, error:err});
            }
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
  
 

 const UPDATEProfilePicture = async(req, res)=>{ 
    const ID = req.session.user.eduall_user_session_ID;
    const  query = `UPDATE eduall_user_accounts SET ed_user_account_picture = ?
    WHERE ed_user_account_deleted = 0 AND ed_user_account_id = ?`;
    const PARAMS = [(req.file ? "images/users/"+req.file.filename : ""), ID];
    DATABASERUN(res, query , PARAMS, 1);  
 }


 const UPDATEProfileCoverImage = async(req, res)=>{ 
    const ID = req.session.user.eduall_user_session_ID;
    const  query = `UPDATE  eduall_user_account_details SET	ed_user_account_detProfileCover = ? WHERE ed_user_account_detUSERID = ?`;
    const PARAMS = [(req.file ? "images/users/covers/"+req.file.filename : ""), ID];
     DATABASERUN(res, query , PARAMS, 1);   
 }

 


const getUsers = async(req, res)=>{  
    const  query = 'SELECT * FROM eduall_user_accounts WHERE ed_user_account_deleted = 0';
    const PARAMS = [];
    DATABASERUN(res, query , PARAMS, 0);
}

const SearchUsers = async(req, res)=>{  
    const  query = `SELECT * FROM eduall_user_accounts
    WHERE ed_user_account_deleted = 0 AND 
    ed_user_account_name LIKE '${req.params.TEXT.toLowerCase()}%'  
    OR  ed_user_account_charge LIKE '${req.params.TEXT.toLowerCase()}%'
    OR ed_user_account_email LIKE '${req.params.TEXT.toLowerCase()}%'`;
    const PARAMS = [];
    DATABASERUN(res, query , PARAMS, 0);
}


 

const getSingleUserData = async(req, res)=>{
    const {ID} = req.params;   
    const  query = `SELECT * FROM eduall_user_accounts INNER JOIN 
    eduall_user_account_details ON 
    eduall_user_accounts.ed_user_account_id = eduall_user_account_details.ed_user_account_detUSERID
    WHERE eduall_user_accounts.ed_user_account_deleted = 0 AND eduall_user_accounts.ed_user_account_id = ?  `;
    DATABASE.query(query, [ID], (err, userData)=>{ 
        if(err) return res.json(err); 
        if(!userData[0]) return  res.sendStatus(401); 
        res.json(userData[0]);
   });  
}



const getCurrentUserInformation = async(req, res)=>{ 
    const  query = `SELECT * FROM eduall_user_accounts  WHERE ed_user_account_id = ?`;
    const ID = req.session.user.eduall_user_session_ID;

    DATABASE.query(query, [ID], (err, userData)=>{ 
        if(err) return res.json(err); 
        console.log(userData)
        res.json(userData)
   }); 
}



const getSingleUserImageData = async(req, res)=>{
    const {EMAIL} = req.params; 
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if(emailRegexp.test(EMAIL)){
        const  query = `SELECT ed_user_account_picture FROM eduall_user_accounts WHERE ed_user_account_deleted = 0 AND ed_user_account_email = ?  `;
        const PARAMS = [EMAIL];
        DATABASERUN(res, query , PARAMS, 0);  
    }else{
        const  query = `SELECT * FROM  eduall_employees LEFT JOIN  eduall_user_accounts ON
        eduall_employees.ed_employee_email = eduall_user_accounts.ed_user_account_email  LEFT JOIN  eduall_system_accounts ON
        eduall_system_accounts.ed_system_account_employee = eduall_employees.ed_employee_id
        WHERE  eduall_user_accounts.ed_user_account_deleted = 0 AND 
        eduall_employees.ed_employee_deleted = 0 AND  eduall_system_accounts.ed_system_account_name = ?`;  
        DATABASE.query(query, [EMAIL.toLowerCase()], (err, rows)=>{ 
            if(err) return [];   
            if(rows.length <= 0) return []; 
            const  query1 = `SELECT ed_user_account_picture FROM eduall_user_accounts WHERE ed_user_account_deleted = 0 AND ed_user_account_email = ?`;
            DATABASERUN(res, query1 , [rows[0].ed_user_account_email], 0);  
         }); 
    }
}


const CheckExistentEmail = async(req, res)=>{
    const {EMAIL} = req.params; 
    const  query = `SELECT * FROM eduall_user_accounts WHERE ed_user_account_deleted = 0 AND ed_user_account_email = ?  `;
    const PARAMS = [EMAIL];
    DATABASERUN(res, query , PARAMS, 0);  
}


const UserAccountDelete = async(req, res)=>{
   const {ID} = req.params;  
   const  query = `UPDATE eduall_user_accounts SET ed_user_account_deleted = 1
   WHERE ed_user_account_deleted = 0 AND ed_user_account_id = ?`;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);   
}

const RegisterUserAccount = async(req, res)=>{   
    const {ed_user_name,  ed_user_email, ed_user_password, ed_user_country} = req.body;  
    const  query = `INSERT INTO eduall_user_accounts(ed_user_account_name ,  ed_user_account_email, ed_user_account_password, ed_user_account_country) VALUES(?,?,?,?)`; 
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(ed_user_password, salt);
    const PARAMS = [ed_user_name, ed_user_email  ,  hashPassword,  ed_user_country];   
    const RandomAvatarColor = ()=>{
          let colors =  ["#A2D2FF", "#CDB4DB", "#FB5607", "#FF006E", "#8D99AE", "#57CC99",
           "#22577A", "#80ED99", "#E29578", "#E56B6F", "#A663CC", "#FF9E00", "#F9C74F"];
          let x = (Math.floor(Math.random() * colors.length) + 0);
        return colors[x];
    }  
    if(CheckInternet() === true){  
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if(emailRegexp.test(ed_user_email)){ 
              if(passwordStrength(ed_user_password).value.toLowerCase() !== "weak"){
                    if(ed_user_name.split("").length >= 7){
                       if(ed_user_country.split("").length >= 2){
                        const  query2 = `SELECT * FROM eduall_user_accounts WHERE ed_user_account_deleted = 0 AND ed_user_account_email = ?  `;
                        DATABASE.query(query2, [ed_user_email], (err, rows)=>{ 
                            if(err) return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
                             if(rows.length >= 1) return res.status(300).json({msg:"Este email já esta a ser utilizado !"});
                            RegisterData();
                         });
                       }else{
                        return res.status(300).json({msg:"O País de origem selecionado não foi validado !"});
                       }
                    }else{
                        return res.status(300).json({msg:"O nome inserido não foi validado !"});
                    }
              }else{
                return res.status(300).json({msg:"Password demasiado fraca !"});
              }
        }else{
            return res.status(300).json({msg:"O email inserido não foi validado !"});
        }
    const RegisterData = ()=>{
     DATABASE.query(query, PARAMS, (err)=>{ 
        if(err) return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
         try {
             const  query2 = `SELECT * FROM eduall_user_accounts WHERE ed_user_account_deleted = 0 AND ed_user_account_email = ?  `;
             DATABASE.query(query2, [ed_user_email], (err, rows)=>{ 
                 if(err) return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
                  if(rows.length >= 1){ 
                    const  query3 = `INSERT INTO eduall_user_account_details(ed_user_account_detUSERID, ed_user_account_detAvatarColor) VALUES(?,?)`; 
                    DATABASE.query(query3, [rows[0].ed_user_account_id, RandomAvatarColor()] , (err)=>{ 
                        if(err) {
                            const  query3 = `DELETE FROM eduall_user_accounts WHERE ed_user_account_id = ?`; 
                            DATABASE.query(query3, [rows[0].ed_user_account_id] , (err)=>{ 
                                if(err) return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
                                return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
                             });
                        }  
                        
                        const sendOtpMessage = async()=>{
                           try {
                            SendVerificationCode(ed_user_email, rows[0].ed_user_account_id, res, null, null, null);
                        } catch (error) {
                            const  query3 = `DELETE FROM eduall_user_accounts WHERE ed_user_account_id = ?`; 
                            DATABASE.query(query3, [rows[0].ed_user_account_id] , (err)=>{ 
                                if(err) return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
                                return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
                             });
                        }
                    }
                    sendOtpMessage(); 

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
} 







const SendVerificationCode = async(ed_user_email, id, res, message, title, codeH)=>{
    const transporter = nodeMailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        auth:{ 
            user:"kiossocamuegi@gmail.com",
            pass:"nynjaktnmywqslfh" 
        },
        tls:{
           rejectUnauthorized:false
        }
    });  
    var Code = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    if(codeH !== null){Code = codeH;
    }else{for (var i = 0; i < 50; i++){Code += characters.charAt(Math.floor(Math.random() * charactersLength));}}

    try {
        const salt = await bcrypt.genSalt(12);
        const hashCode = await bcrypt.hash(Code, salt);
        const PARAMS = [id , hashCode,  Date.now(), Date.now()+3600000];

        const sendOtpMessage = async()=>{
            const info = await transporter.sendMail({
                from:"Eduall <kiossocamuegi@gmail.com>",
                to:[ed_user_email],
                subject:title !== null ? title : "eduallsys - Confirmar registro de conta",
                html:message !== null ? message :   ` 
                <!DOCTYPE html>
                 <html lang="pt">
                 <head>  
                 <style> 
 
 
                 .asignature {
                   width:100%;
                   border-top:1px solid rgb(177, 177, 177);
                   padding:10px 0px;
                   margin:10px 0px;
                   max-width:550px;
                   font-family:"poppins", sans-serif;
                   padding-top:20px;
             }
     
             .asignature .flex-box{
                  width:100%;
                  display: flex;
                  justify-content: space-between;
             }
     
     
             .asignature .logo{ 
                 display: flex;
                 align-items: center;
                 justify-content: center;  
                 width:70px;
                 height:70px;
             }
     
             .asignature .logo img{
                 width:70px;
                 margin:0px;
             }
     
             .asignature .block-flex{
                  display: flex; 
                  margin-top:6px;
             }
     
             .asignature .block-flex h4{
                 font-size:13px;
                 margin:0px;
             }
     
             .asignature .block-flex a{
                 font-size:12px;
             }
             .asignature .block-flex .text{
               padding-left:10px;
         }
 
         .asignature .social-icons{
             display: flex;
             align-items: center;  
         }
 
         .asignature .social-icons .icon{
             width:25px;
             height:25px;
             border-radius:100%;
              margin-right:10px;
              margin-top:10px;
             background: #6051ff; 
         } 
 
         .asignature .social-icons .icon img{
             width:14px;
             height:14px;
             margin:0px;
             margin-left:6px;
             margin-top:6px;
         }
 
         .asignature .text-block{ 
               font-size:11px;
               width:100%;
               font-weight:500;
               max-width: 340px;
               text-align: right;
               margin-left:20px;
         }
 
         .asignature .text-block .bar{
               width:100%;
               height:2px;
               width:100%;
               margin:4px 0px;
               background: #6051ff;
         }
 
         .asignature .text-block p{
             margin:6px 0px !important;
             font-size:11px !important;
         }  
 
                   a{color:#6051ff !important;}
 
                 </style>
                   
                 </head>
                 <body>
                 <div style="display:flex;
                       align-items:center;
                       justify-content:space-between;
                       width:100%;
                       max-width:550px;
                       padding:10px 20px; 
                       background:#6051ff;
                       color:#ffff;
                       font-size:12px;
                       margin-bottom:20px;
                       max-height:50px;
                       height:70px;
                       overflow:hidden;
                       font-family:'Poppins', sans-serif;">
                       <div>  
                          <a href="https://eduallsys.vercel.app" target="_blank" style="max-width:300px;">
                             <img src="https://eduallsys.vercel.app/static/media/logo.2a5d83c764fe68ab60ed.png" style="margin-top:5px;max-height:45px;max-width:300px;"  />
                          <a/> 
                       </div>
                       <div style="margin-top:30px;margin-left:25px;" >Plataforma de gestão escolar e aprendizado</div>
                    </div> 
                   <div style="width:100%;max-width:550px; margin-bottom:30px;font-family:'Poppins', sans-serif !important;line-height:20px;">
                     <div style="font-size:15px !important;"><b>Confirmação de registro de conta </b></div><br/>
                     <a class="btn bg-danger" style="color:#6051ff;font-size:16px;margin-bottom:10px;font-family:'Poppins', sans-serif;" href="http://localhost:3000/eduall_user_account_verification/${id+","+Code}" target="_blank">Clique aqui para finalizar o cadastro da sua conta eduallsys<a/> 
                   </div>  
                 </body>
                </html>  
                ` 
           }); 
           return res.status(200).json({msg:"Conta criada com sucesso !"});  
        }
      
    
        const  query = `INSERT INTO eduall_accounts_verification(ed_account_verification_user , ed_account_verification_code ,ed_account_verification_createDate, ed_account_verification_expireDate) VALUES(?,?,?,?)`; 
        DATABASE.query(query, PARAMS, (err)=>{  
            if(err)  return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
            sendOtpMessage(); 
        }); 
      
    } catch (error) {
        console.log(error)
        const  query3 = `DELETE FROM eduall_user_accounts WHERE ed_user_account_id = ?`; 
        DATABASE.query(query3, [id] , (err)=>{ 
            if(err) return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
            return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
        });
        return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});

    }
}

const ResendVerificationCode = (req, res)=>{
   try { 
     ///get user by params 
    const  query3 = `DELETE FROM eduall_accounts_verification WHERE ed_account_verification_user = ?`; 
    DATABASE.query(query3, [req.body.ed_verification_user] , (err)=>{ 
        if(err) return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
        SendVerificationCode();
    });  
   } catch (error) {
    
   }

}


const CheckUserAccountVerificationCode = (req, res)=>{
  const  query = `SELECT * FROM eduall_accounts_verification WHERE  ed_account_verification_user = ?  `;
   try {
     DATABASE.query(query, [req.body.ed_verification_user], (err, user)=>{ 
         if(err)  return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
         if(!user[0])  return res.status(300).json({msg:"O código de verificação já não existe ou é invalido !"});
          
            const ExpireDate = user[0].ed_account_verification_expireDate;
            const hashedCode = user[0].ed_account_verification_code;

            if(ExpireDate*1 < Date.now()){
                const  query3 = `DELETE FROM eduall_accounts_verification WHERE ed_account_verification_user = ?`; 
                DATABASE.query(query3, [req.body.ed_verification_user] , (err)=>{ 
                    if(err) return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
                    return res.status(300).json({msg:"Código espirou, Por-favor volte  a fazer uma solicitação !"});
                }); 
            }else{
                if(bcrypt.compareSync(req.body.ed_verification_code , hashedCode)){
                    const  query = `UPDATE eduall_user_accounts SET ed_user_account_status = 1   WHERE ed_user_account_deleted = 0 AND ed_user_account_id = ?`; 
                    DATABASE.query(query, [req.body.ed_verification_user] , (err)=>{ 
                        if(err) return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
                        const  query3 = `DELETE FROM eduall_accounts_verification WHERE ed_account_verification_user = ?`; 
                        DATABASE.query(query3, [req.body.ed_verification_user] , (err)=>{ 
                            if(err) return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
                            return res.status(200).json({msg:"success !"});
                        });  
                    }); 
                }else{
                    res.status(400).json({msg:"Código de verificação está errado , verifique o seu email !"});  
                } 
            } 
    }); 
   } catch (error) {
       return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
   }
}

const UpdateUserPassword = async(req, res)=>{
    const {ed_user_password,ed_verification_code,  ed_verification_user} = req.body;  
    const  query = `SELECT * FROM eduall_accounts_verification WHERE  ed_account_verification_user = ?  `;
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(ed_user_password, salt);
    try {
      DATABASE.query(query, [ed_verification_user], (err, user)=>{ 
          if(err)  return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
          if(!user[0])  return res.status(300).json({msg:"O código de verificação não existe ou é invalido !"});
           
             const ExpireDate = user[0].ed_account_verification_expireDate;
             const hashedCode = user[0].ed_account_verification_code;
 
             if(ExpireDate*1 < Date.now()){
                 const  query3 = `DELETE FROM eduall_accounts_verification WHERE ed_account_verification_user = ?`; 
                 DATABASE.query(query3, [ed_verification_user] , (err)=>{ 
                     if(err) return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
                     return res.status(300).json({msg:"Código espirou, Por-favor volte  a fazer uma solicitação !"});
                 }); 
             }else{
                if(passwordStrength(ed_user_password).value.toLowerCase() !== "weak"){
                    if(bcrypt.compareSync(ed_verification_code , hashedCode)){
                        const  query = `UPDATE eduall_user_accounts SET ed_user_account_password = ? WHERE ed_user_account_deleted = 0 AND ed_user_account_id = ?`; 
                        DATABASE.query(query, [hashPassword, ed_verification_user] , (err)=>{ 
                            if(err) return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});   
                            const  query3 = `DELETE FROM eduall_accounts_verification WHERE ed_account_verification_user = ?`; 
                            DATABASE.query(query3, [ed_verification_user] , (err)=>{ 
                                if(err) return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});  
                                return res.status(200).json({msg:"success !"});
                            });    
                        }); 
                    }else{
                        res.status(400).json({msg:"Código de verificação está errado , verifique o seu email !"});  
                    } 
                }else{
                    return res.status(300).json({msg:"Password demasiado fraca !"});
                }
             } 
     }); 
    } catch (error) {
       res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
    }
}



const ChangeCurrentUserPassword = async(req, res)=>{ //123sivikiosso#
    const {ed_user_newpassword, ed_user_oldpassword} = req.body;   
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(ed_user_newpassword, salt);
    try {
        const  query = `SELECT * FROM eduall_user_accounts WHERE ed_user_account_deleted = 0 AND  ed_user_account_id = ?  `;
        DATABASE.query(query, [req.session.user.eduall_user_session_ID], (err, user)=>{ 
            if(err) return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
            if(!user[0]) return res.status(400).json({msg:"Erro de sessão !"});  
             if(bcrypt.compareSync(ed_user_oldpassword , user[0].ed_user_account_password)){
                if(passwordStrength(ed_user_newpassword).value.toLowerCase() !== "weak"){
                        const  query = `UPDATE eduall_user_accounts SET ed_user_account_password = ? WHERE ed_user_account_deleted = 0 AND ed_user_account_id = ?`; 
                        DATABASE.query(query, [hashPassword, req.session.user.eduall_user_session_ID] , (err)=>{ 
                            if(err) return res.status(500).json({msg:"Erro ao estabelecer ligação com o servidor !"});   
                            return res.status(200).json({msg:"success !"});   
                        });
                 
                }else{
                   res.status(300).json({msg:"A nova Palavra-passe é demasiado fraca !"});
                }
             }else{
                res.status(400).json({msg:"A sua palavra-passe está incorreta !"});  
             }  
         });  
    } catch (error) {
       res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
    }
}





const  UserPasswordReset = (req, res)=>{
    const {ed_user_email} = req.body;  
    if(CheckInternet() === true){  
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if(emailRegexp.test(ed_user_email)){ 
        const  query2 = `SELECT * FROM eduall_user_accounts WHERE ed_user_account_deleted = 0 AND ed_user_account_email = ?  `;
        DATABASE.query(query2, [ed_user_email], (err, rows)=>{ 
            if(err) return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor 1!"});
                if(rows.length <= 0) return res.status(300).json({msg:"Não existe nenhuma conta associada a este email !"});
                var Code = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for (var i = 0; i < 50; i++){Code += characters.charAt(Math.floor(Math.random() * charactersLength));}  
            
                const message = ` 
                <!DOCTYPE html>
                 <html lang="pt">
                 <head>  
                 <style> 
 
 
                 .asignature {
                   width:100%;
                   border-top:1px solid rgb(177, 177, 177);
                   padding:10px 0px;
                   margin:10px 0px;
                   max-width:550px;
                   font-family:"poppins", sans-serif;
                   padding-top:20px;
             }
     
             .asignature .flex-box{
                  width:100%;
                  display: flex;
                  justify-content: space-between;
             }
     
     
             .asignature .logo{ 
                 display: flex;
                 align-items: center;
                 justify-content: center;  
                 width:70px;
                 height:70px;
             }
     
             .asignature .logo img{
                 width:70px;
                 margin:0px;
             }
     
             .asignature .block-flex{
                  display: flex; 
                  margin-top:6px;
             }
     
             .asignature .block-flex h4{
                 font-size:13px;
                 margin:0px;
             }
     
             .asignature .block-flex a{
                 font-size:12px;
             }
             .asignature .block-flex .text{
               padding-left:10px;
         }
 
         .asignature .social-icons{
             display: flex;
             align-items: center;  
         }
 
         .asignature .social-icons .icon{
             width:25px;
             height:25px;
             border-radius:100%;
              margin-right:10px;
              margin-top:10px;
             background: #6051ff; 
         } 
 
         .asignature .social-icons .icon img{
             width:14px;
             height:14px;
             margin:0px;
             margin-left:6px;
             margin-top:6px;
         }
 
         .asignature .text-block{ 
               font-size:11px;
               width:100%;
               font-weight:500;
               max-width: 340px;
               text-align: right;
               margin-left:20px;
         }
 
         .asignature .text-block .bar{
               width:100%;
               height:2px;
               width:100%;
               margin:4px 0px;
               background: #6051ff;
         }
 
         .asignature .text-block p{
             margin:6px 0px !important;
             font-size:11px !important;
         }  
 
                   a{color:#6051ff !important;}
 
                 </style>
                   
                 </head>
                 <body>
                 <div style="display:flex;
                       align-items:center;
                       justify-content:space-between;
                       width:100%;
                       max-width:550px;
                       padding:10px 20px; 
                       background:#6051ff;
                       color:#ffff;
                       font-size:12px;
                       margin-bottom:20px;
                       max-height:50px;
                       height:70px;
                       overflow:hidden;
                       font-family:'Poppins', sans-serif;">
                       <div>  
                          <a href="https://eduallsys.vercel.app" target="_blank" style="max-width:300px;">
                             <img src="https://eduallsys.vercel.app/static/media/logo.2a5d83c764fe68ab60ed.png" style="margin-top:5px;max-height:45px;max-width:300px;"  />
                          <a/> 
                       </div>
                       <div style="margin-top:30px;margin-left:25px;" >Plataforma de gestão escolar e aprendizado</div>
                    </div> 
                   <div style="width:100%;max-width:550px; margin-bottom:30px;font-family:'Poppins', sans-serif !important;line-height:20px;">
                     <div style="font-size:15px !important;"><b>Recuperar senha</b></div><br/>
                     <a class="btn bg-danger" style="color:#6051ff;font-size:16px;margin-bottom:10px;font-family:'Poppins', sans-serif;"
                      href="http://localhost:3000/eduall_passwordreset/${rows[0].ed_user_account_id+","+Code}" target="_blank">Clique aqui para criar uma nova senha !<a/> 
                   </div>  
                 </body>
                </html>  
                `;
                SendVerificationCode(ed_user_email, rows[0].ed_user_account_id, res, message, "Recuperar password", Code);
         });           
        }else{
            return res.status(300).json({msg:"O email inserido não foi validado !"});
        }
   }else{
    res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor 2 !"});
   }
}


const GetUserAccounAccess = async(req, res)=>{
    const {CODE} = req.params;  
    const  query = 'SELECT * FROM eduall_user_access WHERE ed_user_access_usercode = ? ';
    const PARAMS = [CODE];    
    DATABASERUN(res, query , PARAMS, 0);   
}


const UpdateUserAccount = async(req, res) =>{
    const {ID} = req.params;
    const {user_account_name, user_account_phone, user_account_email}  = req.body; 
    const  query = `UPDATE eduall_user_accounts SET ed_user_account_name = ?, ed_user_account_email = ?, ed_userphone = ?,
    ed_user_account_charge = ? WHERE ed_user_account_deleted = 0 AND ed_user_account_id = ?`;
    const PARAMS =  [user_account_name,user_account_email, user_account_phone,user_account_charge  , ID];
    DATABASERUN(res, query , PARAMS, 1);   
} 



const UPDATETOKEN  = async(refreshToken , cr_usercode)=>{
    const  query = `UPDATE eduall_user_accounts SET ed_usertoken = ?  WHERE ed_user_account_deleted = 0 AND ed_user_account_id = ?`;
    const PARAMS =  [refreshToken  , cr_usercode];
    if(CheckInternet() === true){   
           DATABASE.query(query, PARAMS, (err)=>{ 
              if(err)  return false;
              return true;
           });
        }else{
        DB_SQLITE.run(query, PARAMS , (err)=>{ 
            if(err) return false;
            return true;
        }); 
    }  
}
 

const Login = async(req, res)=>{
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if((req.body.ed_user_account_email !== null && req.body.ed_user_account_email !== undefined) && (req.body.ed_user_account_password !== null && req.body.ed_user_account_password !== undefined )){
        if(emailRegexp.test(req.body.ed_user_account_email)){  
            const  query = `SELECT * FROM eduall_user_accounts WHERE ed_user_account_deleted = 0 AND  ed_user_account_email = ?  `;
            DATABASE.query(query, [req.body.ed_user_account_email], (err, user)=>{ 
                if(err) return res.json(err);  
              if(!user[0]) return res.status(400).json({msg:"Conta não encomtrada !"});  
                  if(bcrypt.compareSync(req.body.ed_user_account_password , user[0].ed_user_account_password)){
                    const cr_usercode = user[0].ed_user_account_id;
                    const cr_code = user[0].ed_user_account_code;
                    const cr_username = user[0].ed_user_account_name;
                    const cr_useremail = user[0].ed_user_account_email; 
                    const cr_user_largecode = user[0].ed_user_account_code;
                    const cr_usertype = 1;
    
                    const accessToken = jwt.sign({cr_usercode, cr_user_largecode, cr_username, cr_useremail, cr_usertype},
                     process.env.ACCESS_TOKEN_SECRET,{
                        expiresIn:'15s'
                     });
    
                    const refreshToken = jwt.sign({cr_usercode, cr_code, cr_username, cr_useremail},
                    process.env.REFRESH_TOKEN_SECRET,{
                        expiresIn:'1d'
                    }); 
     
                   if(refreshToken !== undefined){
                    if(UPDATETOKEN(refreshToken , cr_usercode)){  
                        const  query5 = `INSERT INTO eduall_login_registers(ed_log_user, ed_log_zone, ed_log_type) VALUES(?,?,?)`;
                        const PARAMS5 = [cr_usercode, 2, "email"];
                        DATABASE.query(query5, PARAMS5 , (err, user)=>{ 
                            if(err) return  res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor 3 !"});
                            console.log("You are about to login with email and password my Nigga 😁😘🤷‍♂️🤷‍♂️😜");
                            req.session.user = {
                                eduall_user_session_refreshToken:refreshToken, 
                                eduall_user_session_ID:cr_usercode
                            };   
                            setTimeout(() => {
                               res.status(200).json({accessToken});
                            }, 500);
                        });
                        
                   }else{
                       console.log("error - 02")
                       res.status(400).json({msg:"Credenciais invalidas !"});   
                   } 
                   }else{
                    res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor  !"});
                   }
                 }else{
                    console.log("error - 03")
                    res.status(400).json({msg:"Credenciais invalidas !"});  
                 }  
              });  
            }else{
                // login with username 
                const  query2 = `SELECT * FROM  eduall_employees LEFT JOIN  eduall_user_accounts ON
                eduall_employees.ed_employee_email = eduall_user_accounts.ed_user_account_email  
                LEFT JOIN  eduall_system_accounts ON  eduall_system_accounts.ed_system_account_employee = eduall_employees.ed_employee_id 
    
                LEFT JOIN eduall_institutes ON eduall_institutes.ed_institute_code = eduall_system_accounts.ed_system_account_institute_code  
                LEFT JOIN eduall_institutes_licences ON eduall_institutes_licences.ed_institute_licence_instituteCode = eduall_system_accounts.ed_system_account_institute_code
    
                WHERE  eduall_user_accounts.ed_user_account_deleted = 0 AND 
                eduall_employees.ed_employee_deleted = 0 AND  eduall_system_accounts.ed_system_account_name = ?`; 
                DATABASE.query(query2, [req.body.ed_user_account_email], (err, rows)=>{ 
                    if(err){
                      console.log(err)
                      console.log("error - 1")
                       res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor 3 !", error:err});
                    }
    
    
                   if(rows || rows !== null || rows !== undefined){  
                   if((typeof rows) === "object"){
                    if(rows.length >= 1){ 
                        const {ed_user_account_email, ed_user_account_password} = rows[0];  
                        if(ed_user_account_password !==  null){
                            if(bcrypt.compareSync(req.body.ed_user_account_password , ed_user_account_password)){
                                const cr_usercode = rows[0].ed_user_account_id;
                                const cr_code = rows[0].ed_user_account_code;
                                const cr_username = rows[0].ed_user_account_name;
                                const cr_useremail = rows[0].ed_user_account_email;   
                                 const cr_user_largecode = rows[0].ed_user_account_code;
                                const cr_usertype = 0;
                                
                                const accessToken = jwt.sign({cr_usercode, cr_user_largecode, cr_username, cr_useremail, cr_usertype},
                                process.env.ACCESS_TOKEN_SECRET,{
                                    expiresIn:'15s'
                                });
    
                        
                                const refreshToken = jwt.sign({cr_usercode, cr_code, cr_username, cr_useremail},
                                process.env.REFRESH_TOKEN_SECRET,{
                                    expiresIn:'1d'
                                }); 
                 
                               if(refreshToken !== undefined){
                                if(UPDATETOKEN(refreshToken , cr_usercode)){ 
                                
         
                                    if(CalculateRemainingDays(rows[0].ed_institute_licence_startDate, rows[0].ed_institute_licence_endDate) <= 0){ 
                                    console.log("*********** error making login ")
                                      res.status(300).json({msg:"Acesso bloqueiado, renove a sua licença ****!"});
                                    
                                    }else{ 
                                    const  query5 = `INSERT INTO eduall_login_registers(ed_log_user, ed_log_zone, ed_log_type) VALUES(?,?,?)`;
                                    const PARAMS5 = [cr_usercode, 2, "username"];
                                    DATABASE.query(query5, PARAMS5 , (err, user)=>{ 
                                        if(err) return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor 3 !"});
                                        console.log("You are about to login with username my dear friend 😒😁🌹🤷‍♀️💖")
                                       req.session.user = {
                                           eduall_user_session_refreshToken:refreshToken,
                                           eduall_user_session_username:rows[0].ed_system_account_name,
                                           eduall_user_session_curentinstitute:rows[0].ed_system_account_institute_code,
                                           eduall_user_session_ID:cr_usercode
                                       };   
                                       console.log(req.session)
                                       res.status(200).json({accessToken, sessions:req.session}); 
                                    });  
        
                                 }
                               }else{
                                console.log("error - 2")
                                   res.status(400).json({msg:"Credenciais invalidas !"});   
                               } 
                               }else{
                                res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor 3 !"});
                               } 
         
                             }else{
                                res.status(400).json({msg:"Credenciais invalidas !"});  
                                console.log("error - 3#####################")
                             }  
                        }else{
                            res.status(400).json({msg:"Esta conta não tem uma password associada !"});     
                        }
                      }else{
                        console.log("Not founded")
                        res.status(400).json({msg:"Credenciais invalidas !"});     
                    } 
                   }else{
                   // res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor 2 !"});
                   }
                   }else{
                    res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor 8 !"});
                   }
    
    
                })
            } 
      }else{
         return res.status(400).json({msg:"Preencha corretamente os campos !"});  
      }
}



const storage_user_picture = multer.diskStorage({
    destination:'images/users',
    filename:(req, file,  cb)=>{
       return cb(null, `eduall_file_${file.fieldname}_${Date.now()}_${Math.random(1,389398393997666666666667676767676767676767676663100012002)}_${path.extname(file.originalname)}`)
    }
});

const uploadUserAccountPicture = multer({
    storage:storage_user_picture
}).single('user_account_picture');


const storage_user_background_picture = multer.diskStorage({
    destination:`images/users/covers`,
    filename:(req, file,  cb)=>{
       return cb(null, `eduall_file_${file.fieldname}_${Date.now()}_${Math.random(1,38939839376666766666666666666666666993178888878700012002)}_${path.extname(file.originalname)}`)
    }
});

 const uploadUserAccountBackgroundPicture = multer({
    storage:storage_user_background_picture
}).single(`user_account_profile_cover`);



module.exports = {getUsers, UserPasswordReset, uploadUserAccountBackgroundPicture, CheckUserAccountVerificationCode, UpdateUserPassword, 
 getSingleUserImageData, UserAccountDelete, getSingleUserData,  CheckExistentEmail, GetUserAccounAccess, UPDATEProfilePicture,UPDATEProfileCoverImage,
 RegisterUserAccount, UpdateUserAccount, Login, uploadUserAccountPicture, getCurrentUserInformation, ChangeCurrentUserPassword, SearchUsers};
