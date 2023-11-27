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
 

const GetCoins = async(req, res)=>{
      const  query = 'SELECT * FROM eduall_coins WHERE ed_coin_deleted = 0 AND ed_coin_institute_code = ?';
      const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
      DATABASERUN(res, query , PARAMS, 0);
}

const GetSingleCoin = async(req,res)=>{
   const {ID} = req.params;
   const  query = 'SELECT * FROM eduall_coins WHERE ed_coin_deleted = 0 AND ed_coin_id = ?';
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 0);
}
 

const RegisterCoin = async(req, res)=>{  
   const  query = `INSERT INTO eduall_coins(ed_coin_title = ? ,  ed_coin_value_in_euro = ?, ed_coin_value_in_dollar = ?, 
   ed_coin_exchange_value = ?, ed_coin_tax = ? ,  ed_coin_tax_value = ?, ed_coin_iva  = ?, ed_coin_institute_code = ?
   ) VALUES(?,?,?,?,?,?,?,?)`;
   const PARAMS =  [req.body.coin_title ,req.body.coin_value_in_euro,req.body.coin_value_in_dollar,
   req.body.coin_exchange_value,req.body.coin_tax,req.body.coin_tax_value, req.body.coin_iva , req.session.user.eduall_user_session_curentinstitute]
   DATABASERUN(res, query , PARAMS, 1);
}


const CoinDelete = async(req, res)=>{
   const {ID} = req.params; 
   const  query = `UPDATE eduall_coins SET ed_coin_deleted = 1
   WHERE ed_coin_deleted = 0 AND ed_coin_id = ?`;
   const PARAMS = [ID];
   DATABASERUN(res, query , PARAMS, 1);
} 



const CoinUpdate = async(req, res)=>{
   const {ID} = req.params;
   const {coin_title, coin_iva, coin_tax, coin_tax_value, coin_value_in_dollar, coin_value_in_euro, coin_exchange_value} = req.body; 
   const  query = `UPDATE eduall_coins SET ed_coin_title = ?, ed_coin_value_in_euro = ?, ed_coin_value_in_dollar = ?, 
   ed_coin_exchange_value = ?, ed_coin_tax = ?, ed_coin_tax_value  = ? , ed_coin_iva = ?  WHERE ed_coin_deleted = 0
   AND ed_coin_id = ?`;
   const PARAMS = [coin_title , coin_value_in_euro, coin_value_in_dollar, coin_exchange_value, coin_tax,  
   coin_tax_value, coin_iva,ID];
   DATABASERUN(res, query , PARAMS, 1);
} 

module.exports = {GetCoins, GetSingleCoin, CoinUpdate, RegisterCoin, CoinDelete};