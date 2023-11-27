const multer  = require("multer"); 
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
 


const GetServicePayments = async(req, res)=>{ 
      const  query = 'SELECT * FROM eduall_service_payments WHERE ed_service_payment_deleted = 0 AND ed_service_payment_institute_code = ?';
      const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
      DATABASERUN(res, query , PARAMS, 0);
}


const GetSingleServicePayment = async(req, res)=>{
   const {ID}=  req.params; 
   const  query = 'SELECT * FROM eduall_service_payments WHERE ed_service_payment_deleted = 0 AND ed_service_payment_id = ? ';
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);   
}

const RegisterServicePayment = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_service_payments(ed_service_payment_amount,ed_service_payment_month,ed_service_payment_place, ed_service_payment_type,
   ed_service_payment_student_code,ed_service_payment_service,ed_service_payment_obs,ed_service_payment_balance,
   ed_service_payment_discount,ed_service_payment_exchange,ed_service_payment_price,ed_service_payment_change,
   ed_service_payment_value_delivered,ed_service_payment_bordeaux_number,ed_service_payment_bank_name,   
   ed_service_payment_file,ed_service_payment_institute_code) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
   const PARAMS = [req.body.service_payment_amount,req.body.service_payment_month ,req.body.service_payment_place ,
   req.body.service_payment_type  ,req.body.service_payment_student_code ,req.body.service_payment_service ,
   req.body.service_payment_obs,req.body.service_payment_balance ,req.body.service_payment_discount ,
   req.body.service_payment_exchange ,req.body.service_payment_price ,req.body.service_payment_change ,
   req.body.service_payment_value_delivered,req.body.service_payment_bordeaux,req.body.service_payment_bank_name,
   req.file.filename, req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 1);
}

 
const Service_paymentDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_service_payments SET ed_service_payment_deleted = 1
   WHERE ed_service_payment_deleted = 0 AND ed_service_payment_id = ?`;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);   
} 


const Service_paymentUpdate = async(req, res)=>{
    const {ID} = req.params;
    const {service_payment_month, service_payment_amount, service_payment_balance, service_payment_bank_name, service_payment_place,service_payment_type,
    service_payment_service, service_payment_student_code, service_payment_discount, service_payment_exchange, service_payment_price, service_payment_bordeaux,
    service_payment_change, service_payment_value_delivered, service_payment_obs } = req.body;

   const  query = `UPDATE eduall_service_payments SET ed_service_payment_amount = ?,ed_service_payment_month = ?,ed_service_payment_place = ?,
   ed_service_payment_type = ?,ed_service_payment_file = ?,ed_service_payment_student_code = ?,
   ed_service_payment_service = ?,ed_service_payment_obs = ?,ed_service_payment_balance = ?,
   ed_service_payment_discount = ?,ed_service_payment_exchange = ?,ed_service_payment_price = ?,ed_service_payment_change = ?,
   ed_service_payment_value_delivered = ?,ed_service_payment_bordeaux_number = ?,ed_service_payment_bank_name = ?
   WHERE ed_service_payment_deleted = 0 AND ed_service_payment_id = ?`;
    
   const PARAMS = [service_payment_amount,service_payment_month ,service_payment_place ,service_payment_type  ,req.file.filename, service_payment_student_code ,
   service_payment_service ,service_payment_obs,service_payment_balance ,service_payment_discount ,service_payment_exchange ,
   service_payment_price ,service_payment_change ,service_payment_value_delivered,service_payment_bordeaux,service_payment_bank_name, ID];
   DATABASERUN(res, query , PARAMS, 1);        
} 


const GetSinglePaidService = async(req,res)=>{
   const {MONTH, STUDENTCODE, SERVICE} = req.params; 
   const  query = `SELECT * FROM eduall_service_payments WHERE ed_service_payment_month =? AND ed_service_payment_student_code =? AND
   ed_service_payment_service = ? AND ed_service_payment_institute_code = ? AND ed_service_payment_deleted = 0`;
   const PARAMS = [MONTH,STUDENTCODE,SERVICE, req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 0);  
} 


const storage = multer.diskStorage({
    destination:'documents',
    filename:(req, file,  cb)=>{
       return cb(null, `eduall_file_${file.fieldname}_${Date.now()}_${Math.random(1,389398393993100012002)}_${path.extname(file.originalname)}`)
    }
});

const uploadServicepaymentDoc = multer({
    storage:storage
}).single('service_payment_file');

module.exports = {GetServicePayments, GetSinglePaidService, GetSingleServicePayment, RegisterServicePayment, Service_paymentDelete, Service_paymentUpdate, uploadServicepaymentDoc};