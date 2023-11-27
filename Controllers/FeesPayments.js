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
 

const GetFeepayments = async(req, res)=>{ 
     const  query = `SELECT * FROM eduall_fees_payments 
     LEFT JOIN eduall_students ON eduall_fees_payments.ed_fee_payment_student = eduall_students.ed_student_id
     LEFT JOIN eduall_services ON eduall_fees_payments.ed_fee_payment_service = eduall_services.ed_service_id
     WHERE eduall_fees_payments.ed_fee_payment_deleted = 0 AND eduall_students.ed_student_deleted = 0 AND eduall_services.ed_service_deleted = 0
     AND eduall_fees_payments.ed_fee_payment_institute_code = ?`; 
     const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
     DATABASERUN(res, query , PARAMS, 0);
}

const GetSingleFeepayment = async(req,res)=>{
   const {ID} = req.params; 
    const  query = `SELECT * FROM eduall_fees_payments WHERE ed_fee_payment_deleted = 0 AND ed_fee_payment_id = ? `; 
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 0);
} 

const GetSinglePaidMonth = async(req,res)=>{
    const {MONTH, STUDENTCODE} = req.params; 
    const  query = `SELECT * FROM eduall_fees_payments WHERE ed_fee_payment_deleted = 0
    AND ed_fee_payment_month = ?  AND ed_fee_payment_student = ?`; 
    const PARAMS = [MONTH, STUDENTCODE];
     DATABASERUN(res, query , PARAMS, 0);
 }
 
 const GetSinglePayment = async(req,res)=>{ 
   const {ID} = req.params; 
    const  query = `SELECT * FROM eduall_fees_payments 
    LEFT JOIN eduall_students ON eduall_fees_payments.ed_fee_payment_student = eduall_students.ed_student_id
    LEFT JOIN eduall_services ON eduall_fees_payments.ed_fee_payment_service  =  eduall_services.ed_service_id
    WHERE ed_fee_payment_deleted = 0 AND ed_fee_payment_id = ? AND ed_fee_payment_institute_code = ?`; 
    const PARAMS = [ID, req.session.user.eduall_user_session_curentinstitute];
    DATABASERUN(res, query , PARAMS, 0);
} 

const GetSingleStudentFees = async(req,res)=>{
   const {ACADEMICYEAR, STUDENTCODE} = req.params; 
   const  query = `SELECT * FROM eduall_fees_payments 
   LEFT JOIN eduall_services ON eduall_fees_payments.ed_fee_payment_service  =  eduall_services.ed_service_id
   LEFT JOIN eduall_students ON eduall_students.ed_student_id =  eduall_fees_payments.ed_fee_payment_student
   WHERE eduall_fees_payments.ed_fee_payment_deleted = 0
   AND eduall_fees_payments.ed_fee_payment_student = ? AND eduall_fees_payments.ed_fee_payment_academic_year = ? AND ed_fee_payment_institute_code = ?`;  
   const PARAMS = [STUDENTCODE, ACADEMICYEAR ,req.session.user.eduall_user_session_curentinstitute];
   console.log(req.session.user.eduall_user_session_curentinstitute)
   DATABASERUN(res, query , PARAMS, 0);
}


const RegisterFeepayment = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_fees_payments(ed_fee_payment_student,ed_fee_payment_service,ed_fee_payment_price,ed_fee_payment_month,
   ed_fee_payment_discount,ed_fee_payment_type,ed_fee_payment_bank, ed_fee_payment_academic_year,
   ed_fee_payment_place,ed_fee_payment_balance,ed_fee_payment_bordereux,ed_fee_payment_iva,ed_fee_payment_code, 
   ed_fee_payment_fineType , ed_fee_payment_fineValue , ed_fee_payment_institute_code) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`; 
   const PARAMS = [req.body.feepayment_student_code,req.body.feepayment_servicecode,req.body.feepayment_price,
   req.body.feepayment_months,req.body.feepayment_discount,req.body.feepayment_type,
   req.body.feepayment_bank, req.body.feepayment_academic_year,req.body.feepayment_place,req.body.feepayment_balance,
   req.body.feepayment_bordereux_number,req.body.feepayment_iva,req.body.feepayment_code,
   req.body.feepayment_fineType, req.body.feepayment_fineValue, req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 1);
}
 

const FeePaymentDelete = async(req, res)=>{
     const {ID} = req.params; 
     const  query = `UPDATE eduall_fees_payments SET ed_fee_payment_deleted = 1
     WHERE ed_fee_payment_deleted = 0 AND ed_fee_payment_id = ?`; 
     const PARAMS = [ID];
     DATABASERUN(res, query , PARAMS, 1);
} 


const FeePaymentUpadate = async(req, res)=>{
   const {ID} = req.params;
   const {feepayment_student_code, feepayment_servicecode, feepayment_price, feepayment_months, feepayment_discount, 
   feepayment_type, feepayment_bank , feepayment_academic_year, feepayment_place, feepayment_balance, feepayment_bordereux_number,
   feepayment_iva ,feepayment_fineType, feepayment_fineValue} = req.body;  
   const  query = `UPDATE eduall_fees_payments SET ed_fee_payment_student = ?,ed_fee_payment_service = ?, ed_fee_payment_price = ?,ed_fee_payment_month = ?,
   ed_fee_payment_discount = ?, ed_fee_payment_type = ?,ed_fee_payment_bank = ?,ed_fee_payment_academic_year = ?,
   ed_fee_payment_place =  ? , ed_fee_payment_balance = ?, ed_fee_payment_bordereux = ? ,ed_fee_payment_iva = ?,
   ed_fee_payment_fineType = ?, ed_fee_payment_fineValue = ?   WHERE ed_fee_payment_deleted = 0 AND ed_fee_payment_id = ?`;

   const PARAMS = [feepayment_student_code,feepayment_servicecode,feepayment_price,feepayment_months,feepayment_discount,
   feepayment_type,feepayment_bank, feepayment_academic_year,feepayment_place, feepayment_balance,
   feepayment_bordereux_number,feepayment_iva, feepayment_fineType,feepayment_fineValue, ID];
   DATABASERUN(res, query , PARAMS, 1);
} 
 


module.exports = {GetFeepayments, GetSinglePayment, GetSingleFeepayment, GetSinglePaidMonth, GetSingleFeepayment, GetSingleStudentFees, RegisterFeepayment, FeePaymentDelete, FeePaymentUpadate};