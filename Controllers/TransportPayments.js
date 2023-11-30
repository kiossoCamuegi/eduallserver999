const CheckInternet = require("../config/CheckInternet");
const { DB_SQLITE, DATABASE } = require("../config/Database"); 
const { GetCurrentUserData } = require("./GetCurrentUserData");
 

const DATABASERUN = (res, query, params, type)=>{
   try { 
      if(CheckInternet()){  
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
 

const GetTransportPayments = async(req, res)=>{ 
     const  query = `SELECT * FROM eduall_transport_payments
     LEFT JOIN  eduall_transport_passengers ON eduall_transport_passengers.ed_transport_passenger_id  =  eduall_transport_payments.ed_transport_payment_student 
     LEFT JOIN eduall_students ON eduall_students.ed_student_id = eduall_transport_passengers.ed_transport_passenger_code  
     LEFT JOIN eduall_services ON eduall_services.ed_service_id = eduall_transport_payments.ed_transport_payment_service
     WHERE  eduall_transport_payments.ed_transport_payment_deleted = 0 AND 
     eduall_transport_payments.ed_transport_payment_institute_code = ?`; 
     const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
     DATABASERUN(res, query , PARAMS, 0);
}

const GetSingleTransportPayment = async(req,res)=>{
   const {ID} = req.params; 
   const  query = `SELECT * FROM eduall_transport_payments
   LEFT JOIN  eduall_transport_passengers ON eduall_transport_passengers.ed_transport_passenger_id  =  eduall_transport_payments.ed_transport_payment_student 
   LEFT JOIN eduall_students ON eduall_students.ed_student_id = eduall_transport_passengers.ed_transport_passenger_code  
   LEFT JOIN eduall_services ON eduall_transport_payments.ed_transport_payment_service  =  eduall_services.ed_service_id
   WHERE ed_transport_payment_deleted = 0 AND ed_transport_payment_id = ? AND ed_transport_payment_institute_code = ?`; 
   const PARAMS = [ID, req.session.user.eduall_user_session_curentinstitute];
    DATABASERUN(res, query , PARAMS, 0);
} 

const GetSingleTransportPaidMonth = async(req,res)=>{
    const {MONTH, STUDENTCODE, YEAR} = req.params; 
    const  query = `SELECT * FROM eduall_transport_payments WHERE ed_transport_payment_deleted = 0
    AND ed_transport_payment_month = ?  AND ed_transport_payment_student = ? AND ed_transport_payment_academic_year	= ?`; 
    const PARAMS = [MONTH, STUDENTCODE, YEAR];
     DATABASERUN(res, query , PARAMS, 0);
 }
 
 const GetSingleStudentTransportPayment = async(req,res)=>{ 
   const {ID} = req.params; 
    const  query = `SELECT * FROM eduall_transport_payments
    LEFT JOIN  eduall_transport_passengers ON eduall_transport_passengers.ed_transport_passenger_id  =  eduall_transport_payments.ed_transport_payment_student 
    LEFT JOIN eduall_students ON eduall_students.ed_student_id = eduall_transport_passengers.ed_transport_passenger_code  
    LEFT JOIN eduall_services ON eduall_transport_payments.ed_transport_payment_service  =  eduall_services.ed_service_id
    WHERE ed_transport_payment_deleted = 0 AND ed_transport_payment_id = ? AND ed_transport_payment_institute_code = ?`; 
    const PARAMS = [ID, req.session.user.eduall_user_session_curentinstitute];
    DATABASERUN(res, query , PARAMS, 0);
} 

const GetSingleStudentTransportPayments = async(req,res)=>{
   const {ACADEMICYEAR, PASSENGERCODE} = req.params; 
   const  query = `SELECT * FROM eduall_transport_payments
   LEFT JOIN eduall_services ON eduall_transport_payments.ed_transport_payment_service  =  eduall_services.ed_service_id
   WHERE eduall_transport_payments.ed_transport_payment_deleted = 0
   AND eduall_transport_payments.ed_transport_payment_student = ? AND eduall_transport_payments.ed_transport_payment_academic_year = ? AND ed_transport_payment_institute_code = ?`;  
   const PARAMS = [PASSENGERCODE, ACADEMICYEAR ,req.session.user.eduall_user_session_curentinstitute ];
   DATABASERUN(res, query , PARAMS, 0);
}


const GetSingleStudentTransportPaymentsByCode = async(req,res)=>{
   const {ACADEMICYEAR, STUDENTCODE} = req.params; 
   const  query = `SELECT * FROM eduall_transport_payments
   LEFT JOIN eduall_services ON eduall_transport_payments.ed_transport_payment_service  =  eduall_services.ed_service_id
   LEFT JOIN eduall_transport_passengers ON eduall_transport_passengers.ed_transport_passenger_id  = eduall_transport_payments.ed_transport_payment_student
   LEFT JOIN eduall_students ON eduall_students.ed_student_id = eduall_transport_passengers.ed_transport_passenger_code 
   WHERE eduall_transport_payments.ed_transport_payment_deleted = 0
   AND eduall_students.ed_student_id = ? AND eduall_transport_payments.ed_transport_payment_academic_year = ? AND ed_transport_payment_institute_code = ?`;  
   const PARAMS = [STUDENTCODE, ACADEMICYEAR ,req.session.user.eduall_user_session_curentinstitute ];
   DATABASERUN(res, query , PARAMS, 0);
}


const RegisterTransportPayments = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_transport_payments(ed_transport_payment_student,ed_transport_payment_service,ed_transport_payment_price,
    ed_transport_payment_month, ed_transport_payment_discount,ed_transport_payment_type,ed_transport_payment_bank, ed_transport_payment_academic_year,
   ed_transport_payment_place,ed_transport_payment_balance,ed_transport_payment_bordereux,ed_transport_payment_iva,ed_transport_payment_code, 
   ed_transport_payment_fineValue, ed_transport_payment_fineType, ed_transport_payment_institute_code) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`; 
   const PARAMS = [req.body.transportpayment_student_code,req.body.transportpayment_servicecode,req.body.transportpayment_price,
   req.body.transportpayment_months,req.body.transportpayment_discount,req.body.transportpayment_type,
   req.body.transportpayment_bank, req.body.transportpayment_academic_year,req.body.transportpayment_place,req.body.transportpayment_balance,
   req.body.transportpayment_bordereux_number,req.body.transportpayment_iva,  req.body.transportpayment_fineValue, req.body.transportpayment_fineType, 
   req.body.transportpayment_code,req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 1);
}
 

const TransportPaymentsDelete = async(req, res)=>{
     const {ID} = req.params; 
     const  query = `UPDATE eduall_transport_payments SET ed_transport_payment_deleted = 1
     WHERE ed_transport_payment_deleted = 0 AND ed_transport_payment_id = ?`; 
     const PARAMS = [ID];
     DATABASERUN(res, query , PARAMS, 1);
} 


const TransportPaymentsUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {transportpayment_student_code, transportpayment_servicecode, transportpayment_price, transportpayment_months, transportpayment_discount, 
   transportpayment_type, transportpayment_bank , transportpayment_academic_year, transportpayment_place, transportpayment_balance, transportpayment_bordereux_number,
   transportpayment_iva, transportpayment_fineValue, transportpayment_fineType} = req.body;  
   const  query = `UPDATE eduall_transport_payments SET ed_transport_payment_student = ?,ed_transport_payment_service = ?, ed_transport_payment_price = ?,ed_transport_payment_month = ?,
   ed_transport_payment_discount = ?, ed_transport_payment_type = ?,ed_transport_payment_bank = ?,ed_transport_payment_academic_year = ?,
   ed_transport_payment_place =  ? , ed_transport_payment_balance = ?, ed_transport_payment_bordereux = ? ,ed_transport_payment_iva = ?
   ed_transport_payment_fineValue = ?, ed_transport_payment_fineType = ?,  WHERE ed_transport_payment_deleted = 0 AND ed_transport_payment_id = ?`;

   const PARAMS = [transportpayment_student_code,transportpayment_servicecode,transportpayment_price,transportpayment_months,transportpayment_discount,
   transportpayment_type,transportpayment_bank, transportpayment_academic_year,transportpayment_place, transportpayment_balance,
   transportpayment_bordereux_number,transportpayment_iva, transportpayment_fineValue, transportpayment_fineType, ID];
   DATABASERUN(res, query , PARAMS, 1);
} 
 


module.exports = {GetTransportPayments, GetSingleTransportPayment, 
    GetSingleTransportPaidMonth, GetSingleStudentTransportPayment, 
    GetSingleStudentTransportPayments, RegisterTransportPayments,
    TransportPaymentsDelete, TransportPaymentsUpdate, GetSingleStudentTransportPaymentsByCode
};