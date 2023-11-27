const jwt   = require("jsonwebtoken");     
 const { DB_SQLITE, DATABASE } = require("../config/Database"); 
const CalculateRemainingDays = require("../config/CalculateRemainingDays"); 


const RefreshToken = async(req, res)=>{   
  console.log(req.session); 
    if(req.session.user !== undefined && req.session.user !== null){
        const refreshToken =  req.session.user.eduall_user_session_refreshToken;
        const AdminUsername = req.session.user.eduall_user_session_username;
          
      res.json({a1:refreshToken, a2:AdminUsername, a3:req.session});

      }else{
          res.status(300).json("**************");
      } 
}

module.exports = RefreshToken;