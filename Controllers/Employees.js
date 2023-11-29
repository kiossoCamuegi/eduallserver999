const multer=  require(`multer`);
const path = require(`path`);
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
 

 const Getemployees = async(req, res)=>{  
    const  query = `SELECT * FROM eduall_employees WHERE ed_employee_deleted = 0 AND ed_employee_institute_code = ?`; 
    const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
    DATABASERUN(res, query , PARAMS, 0);
}

const GetSingleEmployee = async(req, res)=>{
    const {ID} = req.params; 
    const  query = `SELECT * FROM eduall_employees  
    LEFT JOIN eduall_user_accounts ON eduall_user_accounts.ed_user_account_email = eduall_employees.ed_employee_email  

    LEFT JOIN eduall_institutes ON eduall_institutes.ed_institute_code = eduall_employees.ed_employee_institute_code
     
    LEFT JOIN eduall_user_institutes ON   eduall_user_institutes.ed_user_institute_code  =  eduall_institutes.ed_institute_id
    
    AND eduall_user_institutes.ed_user_institute_userCode = eduall_user_accounts.ed_user_account_id 

    LEFT JOIN eduall_user_account_details ON eduall_user_account_details.ed_user_account_detUSERID = eduall_user_accounts.ed_user_account_id

    WHERE eduall_employees.ed_employee_deleted = 0 AND eduall_employees.ed_employee_id = ? AND eduall_employees.ed_employee_institute_code = ?`; 
    const PARAMS = [ID, req.session.user.eduall_user_session_curentinstitute];
    DATABASERUN(res, query , PARAMS, 0);
}





const GetEmployeeDataByUser = async(req, res)=>{ 
       const ID = req.session.user.eduall_user_session_ID;
       const  query = `SELECT * FROM eduall_user_institutes  
       LEFT JOIN eduall_institutes ON  eduall_user_institutes.ed_user_institute_code = eduall_institutes.ed_institute_code
       LEFT JOIN eduall_employees ON  eduall_user_institutes.ed_user_institute_employeeCode = eduall_employees.ed_employee_id
      WHERE eduall_user_institutes.ed_user_institute_deleted = 0 AND  eduall_user_institutes.ed_user_institute_userCode = ? 
      AND eduall_user_institutes.ed_user_institute_code = ?  AND eduall_employees.ed_employee_institute_code  = ?`;
      DATABASERUN(res, query, [ID, req.session.user.eduall_user_session_curentinstitute, req.session.user.eduall_user_session_curentinstitute], 0);
}





const GetEmployeeByJobTitle = async(req, res)=>{
    const {CODE} = req.params; 
    const  query = `SELECT * FROM eduall_employees WHERE ed_employee_deleted = 0 AND ed_employee_charge = ? `; 
    const PARAMS = [CODE];
    DATABASERUN(res, query , PARAMS, 0);
}
 

const RegisterEmployee = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_employees(ed_employee_name, ed_employee_address, ed_employee_nacionality, ed_employee_naturalness, 
   ed_employee_gender, ed_employee_religion, ed_employee_birthday,ed_employee_phone,  ed_employee_phone2, ed_employee_nif, ed_employee_email,
   ed_employee_civil_state,  ed_employee_code,ed_employee_picture, ed_employee_identityCard,ed_employee_charge, 
   ed_employee_subjects,ed_employee_status, ed_employee_institute_code) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

   const PARAMS = [req.body.employee_name,  req.body.employee_address, req.body.employee_nacionality, req.body.employee_naturalness, 
   req.body.employee_gender, req.body.employee_religion, req.body.employee_birthday, req.body.employee_phone,
   req.body.employee_landline,req.body.employee_nif, req.body.employee_email,req.body.employee_civil_state,req.body.employee_code,
   (req.file ? "images/employees/"+req.file.filename : ""), req.body.employee_identityCard,  
   req.body.employee_charge, req.body.employee_subjects, req.body.employee_status , req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 1);
}
 


const EmployeeDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_employees SET ed_employee_deleted = 1
   WHERE ed_employee_deleted = 0 AND ed_employee_id = ?`;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
} 



const EmployeeUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {employee_name, employee_nacionality, employee_nif, employee_gender, employee_charge, ed_employee_religion, employee_naturalness , employee_birthday, employee_subjects
   ,employee_status, employee_address, employee_religion, employee_email, employee_civil_state, employee_identityCard,employee_landline, employee_phone,
   employee_code} = req.body

   const  query = `UPDATE eduall_employees SET ed_employee_name =?, ed_employee_address=?, ed_employee_nacionality=?, ed_employee_naturalness=?, 
   ed_employee_gender=?, ed_employee_religion=?, ed_employee_birthday=?,ed_employee_phone=?, ed_employee_phone2=?, 
   ed_employee_nif=?, ed_employee_email=?, ed_employee_civil_state=?,  ed_employee_code=?,ed_employee_picture=?, 
   ed_employee_identityCard =?,ed_employee_charge=?,  ed_employee_subjects=?,ed_employee_status = ?  
   WHERE ed_employee_deleted = 0 AND ed_employee_id = ?`; 

   const PARAMS =  [employee_name,  employee_address, employee_nacionality, employee_naturalness, 
   employee_gender, employee_religion, employee_birthday, employee_phone,
   employee_landline,employee_nif, employee_email,employee_civil_state,employee_code,
   (req.file ? "images/employees/"+req.file.filename : ""), employee_identityCard,  
   employee_charge, employee_subjects, employee_status, ID];
   DATABASERUN(res, query , PARAMS, 1);
} 

const storage = multer.diskStorage({
    destination:`images/employees`,
    filename:(req, file,  cb)=>{
       return cb(null, `eduall_file_${file.fieldname}_${Date.now()}_${Math.random(1,389398393993100012002)}_${path.extname(file.originalname)}`)
    }
});

const uploadEmployeePicture = multer({
    storage:storage
}).single(`employee_picture`);

module.exports = {Getemployees, GetSingleEmployee, GetEmployeeByJobTitle, RegisterEmployee, EmployeeDelete, 
EmployeeUpdate, uploadEmployeePicture, GetEmployeeDataByUser};