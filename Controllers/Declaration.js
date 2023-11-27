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
 


const GetDeclarations = async(req, res)=>{ 
   const  query = `SELECT * FROM eduall_declarations LEFT JOIN eduall_students ON
   eduall_students.ed_student_id  =  eduall_declarations.ed_declaration_student_code
   WHERE eduall_declarations.ed_declaration_deleted = 0 AND eduall_declarations.ed_declaration_institute_code = ?`;
   const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 0);
}



const GetSingleDeclaration = async(req,res)=>{
   const {ID} = req.params;  
   const  query = `SELECT * FROM eduall_declarations LEFT JOIN eduall_students ON
   eduall_students.ed_student_id  =  eduall_declarations.ed_declaration_student_code
   LEFT JOIN eduall_class ON eduall_class.ed_class_id  =  eduall_students.ed_student_class
   WHERE   ed_declaration_deleted = 0 AND ed_declaration_id = ?  AND eduall_declarations.ed_declaration_institute_code = ?`;
   const PARAMS = [ID, req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 0);
 }
 

const RegisterDeclaration = async(req, res)=>{
    if(CheckInternet() === true){
        const Data = { 
            ed_declaration_student_code:req.body.declaration_student ,  
            ed_declaration_effect:req.body.declaration_effect ,
            ed_declaration_with_marks:req.body.declaration_with_marks ,
            ed_declaration_institute_code:req.session.user.eduall_user_session_curentinstitute
       }
       try {
            await DeclarationModel.create(Data);
            res.json('success');
       } catch (error) {
            res.json(error);
       } 
    }else{        
//########################
   const  query = `INSERT INTO eduall_declarations(ed_declaration_student_code, ed_declaration_effect,ed_declaration_with_marks
    , ed_declaration_institute_code) VALUES(?,?,?,?)`;
   try {
      DB_SQLITE.run(query, [req.body.declaration_student ,req.body.declaration_effect ,
      req.body.declaration_with_marks, req.session.user.eduall_user_session_curentinstitute], (err)=>{ 
            if(err) return res.status(300).json({status:300, success:false, error:err});;
            return res.json("success");
      }); 
   } catch (error) {
      res.status(400).json(error); 
   } 
   //########################
    }
}


 




const DeclarationDelete = async(req, res)=>{
     const {ID} = req.params;
      if(CheckInternet() === true){
        try {
            const CurrentDeclaration = await DeclarationModel.findOne({where:{ed_declaration_id:ID}})
            if(!CurrentDeclaration){
              return res.status(400).json("Declaração não encomtrada");
            }     
            CurrentDeclaration.ed_declaration_deleted = 1;
            await CurrentDeclaration.save();
            res.status(201).json("Declaração deletada");
        } catch (error) {
            res.json(error);
        }
      }else{
              
      //########################
      const  query = `UPDATE eduall_declarations SET ed_declaration_deleted = 1
      WHERE ed_declaration_deleted = 0 AND ed_declaration_id = ?`;

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


const DeclarationUpdate = async(req, res)=>{
    const {ID} = req.params;
    const {declaration_student ,  declaration_effect, declaration_with_marks} = req.body
      if(CheckInternet() === true){
        try {
            const CurrentDeclaration = await DeclarationModel.findOne({where:{ed_declaration_id:ID}})
            if(!CurrentDeclaration){
              return res.status(400).json("Declaração não encomtrada");
            }     
            
            CurrentDeclaration.ed_declaration_student = declaration_student;
            CurrentDeclaration.ed_declaration_effect = declaration_effect;
            CurrentDeclaration.ed_declaration_with_marks = declaration_with_marks;
  
            await CurrentDeclaration.save();
            res.status(201).json("Declaração atualizada com sucesso");
        } catch (error) {
            res.json(error);
        }
      }else{
            
      //########################
      const  query = `UPDATE eduall_declarations SET ed_declaration_student = ?, ed_declaration_effect = ?, declaration_with_marks = ?
      WHERE ed_declaration_deleted = 0 AND ed_declaration_id = ?`;

      try { 
          DB_SQLITE.run(query, [ declaration_student, declaration_effect, declaration_with_marks, ID], (err)=>{ 
            if(err) return res.status(300).json({status:300, success:false, error:err});;
            return res.json("success");
         }); 
      } catch (error) {
         res.status(400).json(error); 
      }   
      //########################  
      }
} 


module.exports = {GetDeclarations, GetSingleDeclaration, RegisterDeclaration, DeclarationDelete, DeclarationUpdate};