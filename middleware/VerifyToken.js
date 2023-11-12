const jwt = require("jsonwebtoken"); 
const {LocalStorage} =  require('node-localstorage'); 
var localStorage = new LocalStorage('./scratch'); 

 const VerifyToken = (req, res, next)=>{  
    const token =   req.cookies.refreshToken ? req.cookies.refreshToken :   (localStorage.getItem("eduall_user_token") ? localStorage.getItem("eduall_user_token") : false);
    if(token ===  null) return res.sendStatus(401);  
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded)=>{
        if(err) return res.sendStatus(401); 
         next(); 
    }); 
}

module.exports = VerifyToken