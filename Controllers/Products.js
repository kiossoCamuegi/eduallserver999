const multer  = require("multer");
const path  = require("path");
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
 

const GetProducts= async(req, res)=>{ 
      const  query = `SELECT * FROM eduall_products LEFT JOIN   eduall_providers  ON 
      eduall_products.ed_product_provider =  eduall_providers.ed_provider_id
      LEFT JOIN eduall_coins ON eduall_products.ed_product_coin  = eduall_coins.ed_coin_id
      WHERE ed_product_deleted = 0 AND ed_product_institute_code = ?`;
      const PARAMS = [req.session.user.eduall_user_session_curentinstitute];
      DATABASERUN(res, query , PARAMS, 0);
}

const GetSingleProduct = async(req,res)=>{
   const {ID} = req.params; 
      const  query = `SELECT * FROM eduall_products WHERE ed_product_deleted = 0 AND ed_product_id = ? `; 
    const PARAMS = [ID];
    DATABASERUN(res, query , PARAMS, 0);
}
 

const RegisterProducts= async(req, res)=>{ 
   const  query = `INSERT INTO eduall_products(ed_product_name, ed_product_purchase_price , ed_product_sale_price, ed_product_provider, ed_product_coin,
   ed_product_stock_amount, ed_product_picture,ed_product_description, ed_product_institute_code) VALUES(?,?,?,?,?,?,?,?,?)`; 
   const PARAMS = [req.body.product_title , req.body.product_purchase_price ,req.body.product_sales_price , 
   req.body.product_provider ,req.body.product_type_of_coin ,  req.body.product_stock_amount,
   req.file.path,req.body.product_description , req.session.user.eduall_user_session_curentinstitute];
   DATABASERUN(res, query , PARAMS, 1);
}


const ProductDelete = async(req, res)=>{
     const {ID} = req.params; 
      const  query = `UPDATE eduall_products SET ed_product_deleted = 1
      WHERE ed_product_deleted = 0 AND ed_product_id = ?`;
      const PARAMS = [ID];
      DATABASERUN(res, query , PARAMS, 1);
} 

const ProductUpdate = async(req, res)=>{
     const {ID} = req.params;
     const {product_title, product_purchase_price, product_sales_price, product_provider, product_type_of_coin, product_stock_amount, product_description} = req.body;
      const  query = `UPDATE eduall_products SET ed_product_name = ?, ed_product_purchase_price = ?, ed_product_sale_price = ?, 
      ed_product_provider = ? , ed_product_coin = ?, ed_product_stock_amount = ?, ed_product_picture = ?, ed_product_description = ? 
      WHERE ed_product_deleted = 0 AND ed_product_id = ?`; 
      const PARAMS = [product_title , product_purchase_price, product_sales_price, product_provider ,product_type_of_coin,        
      product_stock_amount, req.file.path, product_description, ID];
      DATABASERUN(res, query , PARAMS, 1);
} 

  


const storage = multer.diskStorage({
     destination:`images/products`,
     filename:(req, file,  cb)=>{
        return cb(null, `eduall_file_${file.fieldname}_${Date.now()}_${Math.random(1,389399399399393993939939398393993100012002)}${path.extname(file.originalname)}`)
     }
 });
 

 const uploadProductPicture = multer({
     storage:storage
 }).single(`product_image`);

 module.exports = {GetProducts, GetSingleProduct, RegisterProducts, ProductDelete, ProductUpdate, uploadProductPicture};