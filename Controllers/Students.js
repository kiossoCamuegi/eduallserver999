const  multer = require(`multer`);
const  path = require(`path`); 
const CheckInternet = require("../config/CheckInternet");
const { DB_SQLITE, DATABASE } = require("../config/Database"); 
const { GetCurrentUserData } = require("./GetCurrentUserData");
 

const DATABASERUN = (res, query, params, type)=>{
   try { 
      if(CheckInternet() === true){  
         if(type === 0){
            DATABASE.query(query, params, (err, rows)=>{ 
               if(err) return res.status(400).json({status:300, success:false, msg:err});
               return res.json(rows);
            });
         }else{
            DATABASE.query(query, params , (err)=>{ 
               console.log(err);
               if(err) return res.status(400).json({status:300, success:false, msg:err});
               return res.json("success");
             }); 
         } 
      }else{  
         if(type === 0){
            DB_SQLITE.all(query, params, (err, rows)=>{ 
               if(err) return res.status(400).json({status:300, success:false, msg:err});
               return res.json(rows);
            }); 
         }else{
            DB_SQLITE.run(query, params , (err)=>{ 
               if(err) return res.status(400).json({status:300, success:false, msg:err});
               return res.json("success");
           }); 
         } 
      } 
   } catch (error) {
      res.status(400).json(error); 
   }  
}
 

  const GetStudents = async(req, res)=>{  
   const  query = `SELECT * FROM eduall_students LEFT JOIN eduall_class  ON eduall_students.ed_student_class =  eduall_class.ed_class_id  
   LEFT JOIN eduall_cicles ON ed_cicle_id = eduall_class.ed_class_cicle  WHERE ed_student_deleted = 0 AND  eduall_students.ed_student_institute_code = ? 
   ORDER BY ed_student_name ASC`;
   const PARAMS = [GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0);  
}



const GetSTDS = async(req, res)=>{  
   const  query = `SELECT * FROM eduall_students LEFT JOIN eduall_class  ON eduall_students.ed_student_class =  eduall_class.ed_class_id  
   LEFT JOIN eduall_cicles ON ed_cicle_id = eduall_class.ed_class_cicle  WHERE ed_student_deleted = 0 ORDER BY ed_student_name ASC`;
   const PARAMS = [];
   DATABASERUN(res, query , PARAMS, 0);  
}


const GetStudentsByInstitute = async(req, res)=>{  
   const {CODE} = req.params;
   const  query = `SELECT * FROM eduall_students LEFT JOIN eduall_class  ON eduall_students.ed_student_class =  eduall_class.ed_class_id  
   LEFT JOIN eduall_cicles ON ed_cicle_id = eduall_class.ed_class_cicle  WHERE ed_student_deleted = 0 AND  eduall_students.ed_student_institute_code = ? 
   ORDER BY ed_student_name ASC`;
   const PARAMS = [CODE];
   DATABASERUN(res, query , PARAMS, 0);  
}


 const GetSingleStudent = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `SELECT * FROM  eduall_students WHERE ed_student_deleted = 0 AND ed_student_id = ? `; 
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);
}


const GetSingleStudentByIdentityCard = async(req, res)=>{
   const {IDENTITITYCARD} = req.params; 
   const  query = `SELECT * FROM eduall_students WHERE ed_student_deleted = 0 AND ed_student_identityCard = ?
   AND ed_student_institute_code = ?`; 
   const PARAMS = [IDENTITITYCARD.toLowerCase() , GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0);
}


 const GetSingleStudentByCode = async(req, res)=>{
   const {CODE} = req.params;
   const  query = `SELECT * FROM eduall_students WHERE ed_student_deleted = 0 AND ed_student_code = ?`;
   const PARAMS = [CODE];
   DATABASERUN(res, query , PARAMS, 0);
} 

 const GetStudentsByClass = async(req, res)=>{
   const {CLASS} = req.params; 
   const  query =  `SELECT * FROM eduall_students  LEFT JOIN eduall_class ON eduall_students.ed_student_class =  eduall_class.ed_class_id  
   LEFT JOIN eduall_transport_passengers ON eduall_transport_passengers.ed_transport_passenger_code = eduall_students.ed_student_id  
   WHERE eduall_students.ed_student_deleted = 0 
   AND eduall_class.ed_class_id = ?  AND  eduall_students.ed_student_class = ?   AND  eduall_students.ed_student_institute_code = ?  
   ORDER BY eduall_students.ed_student_name ASC`;
   const PARAMS = [CLASS, CLASS, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 0);
}
 
 const RegisterStudent = async(req, res)=>{   
   const  query = `SELECT * FROM eduall_students WHERE ed_student_deleted = 0 AND ed_student_identityCard = ?
   AND ed_student_institute_code = ?`; 
   const PARAMS = [req.body.student_identityCard.toLowerCase() , GetCurrentUserData(1)];
   DATABASE.query(query, PARAMS, (err, rows)=>{ 
      if(err) return res.status(500).json(err);
       if(rows.length <= 0){
         const  query = `INSERT INTO eduall_students(ed_student_name, ed_student_address, ed_student_nacionality, ed_student_gender, 
            ed_student_religion, ed_student_birthday,ed_student_phone, ed_student_email, 
            ed_student_class, ed_student_code,ed_student_picture, ed_student_identityCard,  ed_student_health_problems , 
            ed_student_health_problems_description, ed_student_status, ed_student_naturalness, ed_student_institute_code) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            const PARAMS = [req.body.student_name,  req.body.student_address,  req.body.student_nacionality,  req.body.student_gender, 
            req.body.student_religion,  req.body.student_birthday, req.body.student_phone,  req.body.student_email, 
            req.body.student_class, req.body.student_code, (req.file ? "images/students/"+req.file.filename : ""),req.body.student_identityCard,  
            req.body.student_health_problems , req.body.student_health_problems_description ,req.body.student_status,
            req.body.student_naturalness, GetCurrentUserData(1)];
            DATABASERUN(res, query , PARAMS, 1);
       }else{
          res.status(500).json({msg:"Já existe um estudante cadastrado na instituição com este BI"}); 
       }
   }); 
 


 
} 


 const StudentDelete = async(req, res)=>{
   const {ID} = req.params;
   const  query = `UPDATE eduall_students SET ed_student_deleted = 1
   WHERE ed_student_deleted = 0 AND ed_student_id = ?`;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);  
}   

 const StudentUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {student_name, student_age, student_address, student_nacionality, student_gender, student_religion, student_birthday, student_phone, student_phone2,
   student_email, student_class, student_code, student_identityCard, student_health_problems, student_naturalness, student_health_problems_description, student_status} = req.body;

   query = `UPDATE eduall_students SET ed_student_name = ?, ed_student_address = ?, ed_student_nacionality = ?, ed_student_gender = ?, ed_student_religion = ? 
   ,ed_student_birthday = ?, ed_student_phone = ?, ed_student_phone2 = ?, ed_student_email = ?, ed_student_class = ?, ed_student_code = ?, ed_student_picture = ?,
   ed_student_identityCard = ?, ed_student_health_problems = ? , ed_student_health_problems_description = ?, ed_student_status = ?, ed_student_naturalness  = ?
   WHERE ed_student_deleted = 0 AND ed_student_id = ?`; 
   const PARAMS = [student_name,  student_address,student_nacionality, student_gender, student_religion,
   student_birthday,student_phone, student_phone2, student_email, student_class,student_code,
   (req.file ? "images/students/"+req.file.filename : ""), student_identityCard,student_health_problems,
   student_health_problems_description,student_status, student_naturalness,ID];
   DATABASERUN(res, query , PARAMS, 1);  
} 
 

 const StudentUpdateClass = async(req, res)=>{
   const {ID} = req.params;
   const {student_class} = req.body; 
   const  query = `UPDATE eduall_students SET ed_student_class = ?
   WHERE ed_student_deleted = 0 AND ed_student_id = ?`; 
   const PARAMS = [student_class, ID];
   DATABASERUN(res, query , PARAMS, 1);     
} 

 const StudentUpdateEnrollment = async(req,res)=>{
    const {ID} = req.params;
    const {enrollment_service_code} = req.body;
   const  query = `UPDATE eduall_students SET ed_student_enrolled_service = ?, ed_student_enrolled = 1
   WHERE ed_student_deleted = 0 AND ed_student_id = ?`;
   const PARAMS = [enrollment_service_code, ID];
   DATABASERUN(res, query , PARAMS, 1);    
}

 const StudentEnrollmentConfirmationUpdate = async(req,res)=>{
   const {ID} = req.params;
   const {enrollment_service_code,enrollment_class} = req.body; 
   const  query = `UPDATE eduall_students SET ed_student_enrolled = 2, ed_student_enrolledConfirmation_service = ?,
   ed_student_class = ?,  WHERE ed_student_deleted = 0 AND ed_student_id = ?`; 
   const PARAMS = [enrollment_service_code, enrollment_class ,ID] ;
   DATABASERUN(res, query , PARAMS, 1);   
} 

const storage = multer.diskStorage({
    destination:path.join(__dirname, `./../images/students/`),
    filename:(req, file,  cb)=>{
       return cb(null, `eduall_file_${file.fieldname}_${Date.now()}_${Math.random(1,389398393993100012002)}_${path.extname(file.originalname)}`)
    }
});

 const uploadStudentPicture = multer({
    storage:storage
}).single(`student_picture`);




const GetEmails = async(req, res)=>{ 
   const  query = `SELECT * FROM eduall_schools`; 
   DATABASERUN(res, query , [], 0);
} 
 
module.exports = {
    GetStudents, GetSingleStudent, 
    GetSingleStudentByCode, GetStudentsByClass, 
    RegisterStudent, StudentDelete,
    StudentUpdate, StudentUpdateClass,
    StudentUpdateEnrollment, StudentEnrollmentConfirmationUpdate,
    uploadStudentPicture , GetSingleStudentByIdentityCard,GetEmails,
    GetStudentsByInstitute, GetSTDS
}
