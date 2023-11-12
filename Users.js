const Users  = require("../models/UserModel");
const bcrypt  = require("bcryptjs")
const jwt   = require("jsonwebtoken");
const multer = require('multer');
const path = require('path'); 
const UserAccounAccessModel  = require("../models/UserAccounAccessModel");
const InstituteModel  = require("../models/InstituteModel");
const RefreshToken  = require("./RefreshToken");
const store  = require("store2");
const CheckInternet = require("../config/CheckInternet");
const { DB_SQLITE } = require("../config/Database");
const { GetCurrentUserData } = require("./GetCurrentUserData");



const getUsers = async(req, res)=>{ 
    if(CheckInternet() === true){
        try {
            const users = await Users.findAll({where:{ed_user_account_deleted:0,ed_user_account_institute_code:GetCurrentUserData(1)}});
            res.json(users);
        } catch (error) {
            res.status(400).json(error);
        }
    }else{
    //########################
      const  query = 'SELECT * FROM eduall_user_accounts WHERE ed_user_account_deleted = 0 AND ed_user_account_institute_code = ?';
      try {
         DB_SQLITE.all(query, [GetCurrentUserData(1)], (error, rows)=>{ 
            console.log(error);
             if(error) return res.json({status:300, success:false, error:error});
             return res.json({status:200, data:rows, success:true});
         }); 
      } catch (error) {
         console.log(error);
         res.status(400).json(error); 
      } 
   //########################
    }
}


const getSingleUserData = async(req, res)=>{
    const {ID} = req.params; 
    if(CheckInternet() === true){
        try { 
            const userData = await Users.findAll({ 
                where:{ed_user_account_deleted:0, ed_user_account_id:ID}
            });
            if (userData.length >= 1){
    
                const accessData = await UserAccounAccessModel.findAll({where:{ed_user_access_usercode:ID, ed_user_access_institute_code:userData[0].ed_user_account_institute_code}}); 
                const instituteData = await InstituteModel.findAll({where:{ed_institute_deleted:0, 	ed_institute_code:userData[0].ed_user_account_institute_code}}); 
                
                res.json({
                    USER_INFORMATION:userData[0],
                    USER_ACCESS:accessData[0],
                    USER_INSTITUTE:instituteData[0],
                });
            }else{
                res.json("error");
            }
    
        } catch (error) {
            res.status(400).json(error);
        }
    }else{
     //########################
      const  query = 'SELECT * FROM eduall_user_accounts WHERE ed_user_account_deleted = 0 AND ed_user_account_id = ? ';
      try {
         DB_SQLITE.run(query, [ID], (err, rows)=>{ 
               if(err) return res.status(300).json({status:300, success:false, error:err});;
               return res.json({status:200, data:rows, success:true});
         }); 
      } catch (error) {
         res.status(400).json(error); 
      } 
      //########################
    }
}



const getSingleUserImageData = async(req, res)=>{
    const {EMAIL} = req.params; 
    if(CheckInternet() === true){
        try { 
            const userData = await Users.findAll({ 
                where:{ed_user_account_deleted:0, ed_user_account_email:EMAIL}
            });
            if (userData.length >= 1){
    
                const accessData = await UserAccounAccessModel.findAll({where:{ed_user_access_usercode:EMAIL, ed_user_access_institute_code:userData[0].ed_user_account_institute_code}}); 
                const instituteData = await InstituteModel.findAll({where:{ed_institute_deleted:0, 	ed_institute_code:userData[0].ed_user_account_institute_code}}); 
                
                res.json({
                    USER_INFORMATION:userData[0],
                    USER_ACCESS:accessData[0],
                    USER_INSTITUTE:instituteData[0],
                });
            }else{
                res.json("error");
            }
    
        } catch (error) {
            res.status(400).json(error);
        }
    }else{
     //########################
      const  query = 'SELECT ed_user_account_picture FROM eduall_user_accounts WHERE ed_user_account_deleted = 0 AND ed_user_account_email = ? ';
      try {
         DB_SQLITE.run(query, [EMAIL], (err, rows)=>{ 
               if(err) return res.status(300).json({status:300, success:false, error:err});;
               return res.json({status:200, data:rows, success:true});
         }); 
      } catch (error) {
         res.status(400).json(error); 
      } 
      //########################
    }
}


const CheckExistentEmail = async(req, res)=>{
    const {EMAIL} = req.params;  
    if(CheckInternet() === true){
        try {
            const Data = await Users.findAll({where:{ed_user_account_deleted:0, ed_user_account_email:EMAIL}});
            res.json(Data);
        } catch (error) {
            res.status(400).json(error); 
        }
    }else{
       //########################
      const  query = 'SELECT * FROM eduall_user_accounts WHERE ed_user_account_deleted = 0 AND ed_user_account_email = ? ';
      try {
         DB_SQLITE.run(query, [EMAIL], (err, rows)=>{ 
               if(err) return res.status(300).json({status:300, success:false, error:err});;
               return res.json({status:200, data:rows, success:true});
         }); 
      } catch (error) {
         res.status(400).json(error); 
      } 
      //########################
    }
}


const UserAccountDelete = async(req, res)=>{
    const {ID} = req.params; 

    if(CheckInternet() === true){
        try {
            const userData = await Users.findOne({where:{ed_user_account_id:ID, ed_user_account_deleted:0}})
            if(!userData){
              return res.status(400).json("usúario não encomtrado");
            }      
            userData.ed_user_account_deleted = 1;  
            await userData.save();
            res.status(201).json("usúario atualizado com sucesso");
        } catch (error) {
            res.json(error);
        }
    }else{ 
      //########################
      const  query = `UPDATE eduall_user_accounts SET ed_user_account_deleted = 1
      WHERE ed_user_account_deleted = 0 AND ed_user_account_id = ?`; 
      try { 
          DB_SQLITE.run(query, [ID], (err)=>{ 
            if(err) return res.status(300).json({status:300, success:false, error:err});;
            return res.json("success");
         }); 
      } catch (error) {
         res.status(400).json(error); 
      }   
      //########################
    }
}

const RegisterUserAccount = async(req, res)=>{   
    const {institute_code, user_account_name, user_account_charge, user_account_access,user_account_phone,
    user_account_code, user_account_email} = req.body;
         
      const Data = { 
         ed_user_access_usercode:user_account_code,
         ed_user_access_pedagógicalarea:req.body.access_pedagogy,
         ed_user_access_myinstitute:req.body.access_myschool,
         ed_user_access_secretary:req.body.access_secretary,
         ed_user_access_finances:req.body.access_finance,
         ed_user_access_administration:req.body.access_admnistration ,
         ed_user_access_library:req.body.access_library ,
         ed_user_access_transportation:req.body.access_transportation ,
         ed_user_access_system:req.body.access_system , 
         ed_user_access_configuration:req.body.access_configuration, 
         ed_user_access_portal:req.body.access_portal, 
      } 

 
        const ed_user_account_password = "123eduall#"; //#eduall909* 
        const salt = await bcrypt.genSalt(12)
        const hashPassword = await bcrypt.hash(ed_user_account_password, salt);
  
        if(CheckInternet() === true){
            try {
                await Users.create({
                    ed_user_account_name: user_account_name,
                    ed_user_account_code: user_account_code  ,
                    ed_user_account_email:user_account_email,  
                    ed_userphone:user_account_phone, 
                    ed_user_account_charge:user_account_charge,
                    ed_user_account_picture:req.file.path,
                    ed_user_account_password:hashPassword,
                    ed_user_account_institute_code:GetCurrentUserData(1),
                })
                await UserAccounAccessModel.create(Data);
                res.json(Data);
    
            } catch (error) {
                res.status(400).json(error); 
            } 
        }else{
        //########################
        const  query = `INSERT INTO eduall_user_accounts(ed_user_account_name , ed_user_account_code , ed_user_account_email, ed_userphone, 
            ed_user_account_charge, ed_user_account_picture, ed_user_account_password, ed_user_account_institute_code) VALUES(?,?,?,?,?,?,?,?)`;
        try {
            DB_SQLITE.run(query, [user_account_name,user_account_code  ,user_account_email,user_account_phone, 
            user_account_charge, req.file.path, hashPassword, GetCurrentUserData(1)], (err)=>{ 
                if(err) return res.status(300).json({status:300, success:false, error:err});;
                return res.json("success");
            }); 
        } catch (error) {
            res.status(400).json(error); 
        } 
        //######################## 
   }
  } 



  const GetUserAccounAccess = async(req, res)=>{
    const {CODE} = req.params;
    if(CheckInternet() === true){
        try {
            const Data = await UserAccounAccessModel.findAll({
                where:{ed_user_access_usercode:CODE}  
            })
            res.json(Data);
        } catch (error) {
            res.status(400).json(error); 
        }    
    }else{
        //########################
        const  query = 'SELECT * FROM eduall_user_access WHERE ed_user_access_usercode = ? ';
        try {
            DB_SQLITE.run(query, [CODE], (err, rows)=>{ 
                if(err) return res.status(300).json({status:300, success:false, error:err});;
                return res.json({status:200, data:rows, success:true});
            }); 
        } catch (error) {
            res.status(400).json(error); 
        } 
        //########################
    }
}


const UpdateUserAccount = async(req, res) =>{
    const {ID} = req.params;
    const {user_account_name, user_account_charge,  user_account_phone, user_account_email}  = req.body;
       
      if(CheckInternet() === true){
        try {   
            const userData = await Users.findOne({where:{ed_user_account_id:ID, ed_user_account_deleted:0}})
            if(!userData){
              return res.status(400).json("usúario não encomtrado");
            }  
            
            userData.ed_user_account_name = user_account_name;
            userData.ed_user_account_email = user_account_email;  
            userData.ed_userphone = user_account_phone;  
            userData.ed_user_account_charge = user_account_charge;  
            
            await userData.save();
            res.status(201).json("usúario atualizado com sucesso");
        } catch (error) {
            res.json(error);
        }  
      }else{ 
      //########################
      const  query = `UPDATE eduall_user_accounts SET ed_user_account_name = ?, ed_user_account_email = ?, ed_userphone = ?,
       ed_user_account_charge = ? WHERE ed_user_account_deleted = 0 AND ed_user_account_id = ?`;

      try { 
          DB_SQLITE.run(query, [user_account_name,user_account_email, user_account_phone,user_account_charge  , ID], (err)=>{ 
            if(err) return res.status(300).json({status:300, success:false, error:err});;
            return res.json("success");
         }); 
      } catch (error) {
         res.status(400).json(error); 
      }   
      //########################
      }
 
} 





const Login = async(req, res)=>{ 
    if(CheckInternet() === true){
        try { 
            const user = await Users.findAll({
                where:{ed_user_account_email: req.body.ed_user_account_email, ed_user_account_deleted:0}   
            }); 
            
            const match = await bcrypt.compare(req.body.ed_user_account_password, user[0].ed_user_account_password);
            if(!match) return  res.status(400).json({msg:"Credenciais invalidas"});  
        
            const cr_usercode = user[0].ed_user_account_id;
            const cr_code = user[0].ed_user_account_code;
            const cr_username = user[0].ed_user_account_name;
            const cr_useremail = user[0].ed_user_account_email; 
            
            const accessToken = jwt.sign({cr_usercode, cr_username, cr_useremail},
            process.env.ACCESS_TOKEN_SECRET,{
                expiresIn:'20s'
            }); 
    
            const refreshToken = jwt.sign({cr_usercode, cr_code, cr_username, cr_useremail},
            process.env.REFRESH_TOKEN_SECRET,{
                expiresIn:'1d'
            }); 
           
            await Users.update({ed_usertoken:refreshToken},{
                where:{ed_user_account_id:cr_usercode}
            }); 
            
            res.cookie('refreshToken', refreshToken,{
                httpOnly:true,
                maxAge:24 * 60 * 60 * 1000
            });  
    
            store.set('eduall_user_token', refreshToken); 
            res.json({accessToken}); 
    
        } catch (error) {
            res.status(404).json({msg:"Credenciais invalidas"}); 
        }
    }else{
        try {   
            let user  = [];
            const  query = 'SELECT * FROM eduall_user_accounts';
            DB_SQLITE.run(query, [req.body.ed_user_account_email], (err, rows)=>{ 
                console.log(rows) 
            }); 
           
                
               return  res.status(400).json({msg:'*****'});  
  
               /*
            const match = await bcrypt.compare(req.body.ed_user_account_password, user[0].ed_user_account_password);
            if(!match) return  res.status(400).json({msg:"Credenciais invalidas"});  
        
            const cr_usercode = user[0].ed_user_account_id;
            const cr_code = user[0].ed_user_account_code;
            const cr_username = user[0].ed_user_account_name;
            const cr_useremail = user[0].ed_user_account_email; 
            
            const accessToken = jwt.sign({cr_usercode, cr_username, cr_useremail},
            process.env.ACCESS_TOKEN_SECRET,{
                expiresIn:'20s'
            }); 
    
            const refreshToken = jwt.sign({cr_usercode, cr_code, cr_username, cr_useremail},
            process.env.REFRESH_TOKEN_SECRET,{
                expiresIn:'1d'
            }); 
 
            const  query2 = `UPDATE eduall_user_accounts SET ed_usertoken = ? 
            WHERE ed_user_account_deleted = 0 AND ed_user_account_id = ?`; 
            
             DB_SQLITE.run(query2, [refreshToken , cr_usercode], (err)=>{ 
                    if(err) console.log(err);
              }); 
                
            res.cookie('refreshToken', refreshToken,{
                httpOnly:true,
                maxAge:24 * 60 * 60 * 1000
            });  
    
            store.set('eduall_user_token', refreshToken); 
            res.json({accessToken});  
    
            */
        } catch (error) {
            console.log(error)
            res.status(404).json({msg:"Credenciais invalidas 2"}); 
        }
    }
}


const Logout = async(req, res)=>{
    const refreshToken = req.cookies.refreshToken ? req.cookies.refreshToken : (store.get("eduall_user_token") ? store.get("eduall_user_token") : false) ;
    if(CheckInternet() === true){
        if(!refreshToken) return res.sendStatus(204);
        const user = await Users.findAll({
            where:{ed_usertoken:refreshToken}
        });
        if(!user[0]) return res.sendStatus(204);
        const cr_usercode = user[0].ed_user_account_id;
        await Users.update({ed_usertoken:null},{
            where:{ed_user_account_id:cr_usercode,ed_user_account_deleted:0}
        });
        res.clearCookie('refreshToken');
        store.remove("eduall_user_token");  
        store.clearAll();   
        return res.sendStatus(200);    
    }else{
        if(!refreshToken) return res.sendStatus(204); 
         const  query = `SELECT * FROM eduall_user_accounts WHERE ed_user_account_deleted = 0 AND ed_usertoken = ?`; 
         const user =  DB_SQLITE.run(query, [refreshToken], (err, rows)=>{ 
            if(err) return [];
            return rows;
         }); 

        if(!user[0]) return res.sendStatus(204);
        const cr_usercode = user[0].ed_user_account_id;
        
        const  query2 = `UPDATE eduall_user_accounts SET ed_usertoken = ? 
        WHERE ed_user_account_deleted = 0 AND ed_user_account_id = ?`;  
        DB_SQLITE.run(query2, ['', cr_usercode], (err)=>{ 
            if(err) console.log(err);
        });

        res.clearCookie('refreshToken');
        store.remove("eduall_user_token");  
        store.clearAll();   
        return res.sendStatus(200); 
    }
}
 

const storage = multer.diskStorage({
    destination:'images/users',
    filename:(req, file,  cb)=>{
       return cb(null, `eduall_file_${file.fieldname}_${Date.now()}_${Math.random(1,389398393993100012002)}_${path.extname(file.originalname)}`)
    }
});

const uploadUserAccountPicture = multer({
    storage:storage
}).single('user_account_picture');

module.exports = {getUsers, getSingleUserImageData, UserAccountDelete, getSingleUserData,  CheckExistentEmail, GetUserAccounAccess, RegisterUserAccount, UpdateUserAccount, Login, Logout, uploadUserAccountPicture};