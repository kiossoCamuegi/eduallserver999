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
 

const GetQuarterlyNotes = async(req, res)=>{ 
    const  query = `SELECT * FROM eduall_quarterly_notes  
    LEFT JOIN eduall_students ON eduall_students.ed_student_id = eduall_quarterly_notes.ed_quarter_note_studentcode
     where ed_quarter_note_deleted = 0 AND ed_quarter_note_institute_code = ?`; 
    const PARAMS = [GetCurrentUserData(1)];
    DATABASERUN(res, query , PARAMS, 0);
}

const GetsingleQuarterlyNote = async(req,res)=>{
    const {STUDENTCODE} = req.params; 
    const  query = `SELECT * FROM eduall_quarterly_notes 
    
    LEFT JOIN eduall_class 
    ON eduall_class.ed_class_id = eduall_quarterly_notes.ed_quarter_note_class
    LEFT JOIN eduall_academic_level ON eduall_academic_level.ed_academic_level_id  = eduall_class.ed_class_academic_level
    LEFT JOIN eduall_students ON eduall_students.ed_student_id = eduall_quarterly_notes.ed_quarter_note_studentcode

    WHERE ed_quarter_note_deleted = 0 AND ed_quarter_note_studentcode = ? `; 
    const PARAMS = [STUDENTCODE];
    DATABASERUN(res, query , PARAMS, 0);
}

const GetsingleQuarterlyNotebYQrtSub = async(req,res)=>{
    const {QUARTER, SUBJECT, CLASS} = req.params; 
    const  query = `SELECT * FROM eduall_quarterly_notes 

    LEFT JOIN eduall_class 
    ON eduall_class.ed_class_id = eduall_quarterly_notes.ed_quarter_note_class
    LEFT JOIN eduall_academic_level ON eduall_academic_level.ed_academic_level_id  = eduall_class.ed_class_academic_level
    LEFT JOIN eduall_students ON eduall_students.ed_student_id = eduall_quarterly_notes.ed_quarter_note_studentcode

    WHERE ed_quarter_note_quarter = ? AND ed_quarter_note_subject = ? AND
    ed_quarter_note_class = ? AND ed_quarter_note_deleted = 0 AND ed_quarter_note_institute_code = ?`; 
    const PARAMS = [QUARTER,SUBJECT,CLASS, GetCurrentUserData(1)];
    DATABASERUN(res, query , PARAMS, 0);
}


const GetsingleQuarterlyNoteByID = async(req,res)=>{
    const {ID} = req.params; 
    const  query = `SELECT * FROM eduall_quarterly_notes 

    LEFT JOIN eduall_class 
    ON eduall_class.ed_class_id = eduall_quarterly_notes.ed_quarter_note_class
    LEFT JOIN eduall_academic_level ON eduall_academic_level.ed_academic_level_id  = eduall_class.ed_class_academic_level
    LEFT JOIN eduall_students ON eduall_students.ed_student_id = eduall_quarterly_notes.ed_quarter_note_studentcode

    WHERE ed_quarter_note_id = ?  AND ed_quarter_note_deleted = 0 AND ed_quarter_note_institute_code = ?`; 
    const PARAMS = [ID,GetCurrentUserData(1)];
    DATABASERUN(res, query , PARAMS, 0);
}


const GetsingleQuarterlyNotebYSubCls = async(req,res)=>{
    const {SUBJECT, CLASS} = req.params; 
    const  query = `SELECT * FROM eduall_quarterly_notes  

    LEFT JOIN eduall_class 
    ON eduall_class.ed_class_id = eduall_quarterly_notes.ed_quarter_note_class
    LEFT JOIN eduall_academic_level ON eduall_academic_level.ed_academic_level_id  = eduall_class.ed_class_academic_level
    LEFT JOIN eduall_students ON eduall_students.ed_student_id = eduall_quarterly_notes.ed_quarter_note_studentcode

    WHERE ed_quarter_note_subject = ? AND ed_quarter_note_deleted = 0
    AND ed_quarter_note_subject = ? AND ed_quarter_note_class = ? AND ed_quarter_note_institute_code = ?`; 
    const PARAMS = [SUBJECT,CLASS, GetCurrentUserData(1)];
    DATABASERUN(res, query , PARAMS, 0);
}



const GetsingleClassScoreByNumber = async(req,res)=>{
   const {SUBJECT, CLASS} = req.params; 
   const  query = ` 
      SELECT  c.objectiveID, JSON_ARRAY(JSON_OBJECT('text', d.description, 'text2', d.description)) AS records, 
      JSON_ARRAY(c.text) AS text FROM completion AS C 
      INNER JOIN record AS r ON c.userID = r.userID  AND c.recordID = r.ID
      INNER JOIN code AS d ON r.codeID = d.ID
      GROUP BY  c.objectiveID

   `; 

   const PARAMS = [];
   DATABASERUN(res, query , PARAMS, 0);
}



const GetsingleQuarterlyNotebYSubStdQrtType = async(req,res)=>{
    const {SUBJECT, QUARTER, STUDENT, CLASS} = req.params; 
      const  query = `SELECT * FROM eduall_quarterly_notes  

      LEFT JOIN eduall_class 
      ON eduall_class.ed_class_id = eduall_quarterly_notes.ed_quarter_note_class
      LEFT JOIN eduall_academic_level ON eduall_academic_level.ed_academic_level_id  = eduall_class.ed_class_academic_level
      LEFT JOIN eduall_students ON eduall_students.ed_student_id = eduall_quarterly_notes.ed_quarter_note_studentcode

      WHERE  ed_quarter_note_deleted = 0  AND ed_quarter_note_subject  = ?
      AND ed_quarter_note_quarter  = ? AND ed_quarter_note_studentcode = ? AND ed_quarter_note_class  = ? AND ed_quarter_note_institute_code = ?`;
      const PARAMS = [SUBJECT,QUARTER,STUDENT, CLASS, GetCurrentUserData(1)];
      DATABASERUN(res, query , PARAMS, 0);
}


const GetsingleQuarterlyNotebYSubStdQrtTypeClass = async(req,res)=>{
    const {SUBJECT, QUARTER, STUDENT, CLASS} = req.params; 
      const  query = `SELECT * FROM eduall_quarterly_notes   

      LEFT JOIN eduall_class 
      ON eduall_class.ed_class_id = eduall_quarterly_notes.ed_quarter_note_class
      LEFT JOIN eduall_academic_level ON eduall_academic_level.ed_academic_level_id  = eduall_class.ed_class_academic_level
      LEFT JOIN eduall_students ON eduall_students.ed_student_id = eduall_quarterly_notes.ed_quarter_note_studentcode

      WHERE  ed_quarter_note_deleted = 0  AND ed_quarter_note_subject  = ?
      AND ed_quarter_note_quarter  = ? AND ed_quarter_note_studentcode = ? AND ed_quarter_note_class  = ? AND ed_quarter_note_institute_code = ?`;
      const PARAMS = [SUBJECT,QUARTER,STUDENT, CLASS, GetCurrentUserData(1)];
      DATABASERUN(res, query , PARAMS, 0);
}


const RegisterQuarterlyNote = async(req, res)=>{ 
   const  query = `INSERT INTO eduall_quarterly_notes(ed_quarter_note_studentcode,  ed_quarter_note_subject, ed_quarter_note_quarter,
   ed_quarter_note_mac, ed_quarter_note_npp,ed_quarter_note_class,ed_quarter_note_npt, ed_quarter_note_institute_code) VALUES(?,?,?,?,?,?,?,?)`;
   const PARAMS = [req.body.quarterly_note_student_code, req.body.quarterly_note_subject,req.body.quarterly_note_quarter, 
   req.body.quarterly_note_mac, req.body.quarterly_note_npp,req.body.quarterly_note_class,req.body.quarterly_note_npt, GetCurrentUserData(1)];
   DATABASERUN(res, query , PARAMS, 1);
} 


const QuarterlyNoteDelete = async(req, res)=>{
    const {ID} = req.params;  
    const  query = `UPDATE eduall_quarterly_notes SET ed_quarter_note_deleted = 1  WHERE ed_quarter_note_deleted = 0 AND ed_quarter_note_id = ?`; 
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 1);
} 


const QuarterlyNoteUpdate = async(req, res)=>{
    const {ID} = req.params;
    const {quarterly_note_studentcode, quarterly_note_npp, quarterly_note_mac, quarterly_note_quarter, quarterly_note_npt, quarterly_note_subject} = req.body; 
    const  query = `UPDATE eduall_quarterly_notes SET  ed_quarter_note_studentcode =  ?,   ed_quarter_note_subject =  ?,   ed_quarter_note_quarter = ?, 
    ed_quarter_note_mac =  ?, ed_quarter_note_npp = ?,   ed_quarter_note_npt =  ? WHERE  ed_quarter_note_deleted = 0 AND ed_quarter_note_id = ?` 
    const PARAMS = [quarterly_note_studentcode, quarterly_note_subject, quarterly_note_quarter, quarterly_note_mac, quarterly_note_npp, quarterly_note_npt, ID] ;
    DATABASERUN(res, query , PARAMS, 1);
} 


module.exports = {GetsingleClassScoreByNumber, GetQuarterlyNotes, GetsingleQuarterlyNote, GetsingleQuarterlyNotebYQrtSub, GetsingleQuarterlyNotebYSubCls, GetsingleQuarterlyNoteByID,
GetsingleQuarterlyNotebYSubStdQrtType, RegisterQuarterlyNote, QuarterlyNoteUpdate, QuarterlyNoteDelete, GetsingleQuarterlyNotebYSubStdQrtTypeClass};