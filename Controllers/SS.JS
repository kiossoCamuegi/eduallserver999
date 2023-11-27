const express= require('express');
require("dotenv").config();
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const db = require('./db');
const mysqlStore = require('express-mysql-session')(session);
const PORT= process.env.APP_PORT;
const IN_PROD = process.env.NODE_ENV === 'production'
const TWO_HOURS = 1000 * 60 * 60 * 2
const options ={
    connectionLimit: 10,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    createDatabaseTable: true
    
}
const pool = mysql.createPool(options);
 
const  sessionStore = new mysqlStore(options, pool);
const app=express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())


app.use(session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: TWO_HOURS,
        sameSite: true,
        secure: IN_PROD
    }
}))




app.get('/', (req, res)=>{
    const { userId } = req.session
    console.log(userId);
    res.send(`
    <h1> Welcome!</h1>
    ${userId ?`<a href = '/home'> Home </a>
    <form method='post' action='/logout'>
    <button>Logout</button>
    </form>` : `<a href = '/login'> Login </a>
    <a href = '/register'> Register </a>
`}
    `)
})
app.get('/home',  async(req,res)=>{
    const {userId} =req.session
     if(userId){
    try{
        const user = await db.getUser(userId);
        console.log(user)
        req.user = user;
        res.send(`
        <h1>Home</h1>
        <a href='/'>Main</a>
        <ul>
        <li> Name: ${user[0].first_name} </li>
        <li> Email:${user[0].email} </li>
        </ul>
    
        `)
        
    } catch(e) {
        console.log(e);
        res.sendStatus(404);
    }
}
   
})
app.get('/login', (req,res)=>{
    res.send(`
    <h1>Login</h1>
    <form method='post' action='/login'>
    <input type='email' name='email' placeholder='Email' required />
    <input type='password' name='password' placeholder='password' required/>
    <input type='submit' />
    </form>
    <a href='/register'>Register</a>
    `)
})
app.get('/register', (req,res)=>{
    res.send(`
    <h1>Register</h1>
    <form method='post' action='/Register'>
    <input type='text' name='firstName' placeholder='First Name' required />
    <input type='text' name='lastName' placeholder='Last Name' required />
    <input type='email' name='email' placeholder='Email' required />
    <input type='password' name='password' placeholder='password' required/>
    <input type='submit' />
    </form>
    <a href='/login'>Login</a>
    `)
})
app.post('/login', async(req, res, next)=>{
    try{ 
    const email = req.body.email;
    let password = req.body.password;
    user = await db.getUserByEmail(email);
    
    if(!user){
        return res.send({
            message: "Invalid email"
        })
    }
    if(user.password !== password){
        return res.send({
            message: "Invalid  password"
        })
    
    }
        
        req.session.userId = user.id
        return res.redirect('/home');
    
    } catch(e){
        console.log(e);
    }
});
app.post('/register',  async (req, res, next)=>{
    try{
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        let password = req.body.password;
              if (!firstName || !lastName || !email || !password) {
                return res.sendStatus(400);
             }
        const user =  await db.insertUser(firstName, lastName, email, password).then(insertId=>{return db.getUser(insertId);});
        req.session.userId = user.id
            return res.redirect('/register') 
    } catch(e){    
        console.log(e);
        res.sendStatus(400);
    }
});
app.post('/logout', (req, res)=>{
    req.session.destroy(err => {
        if(err){
            return res.redirect('/home')
        }
        sessionStore.close()
        res.clearCookie(process.env.SESS_NAME)
        res.redirect('/login')
    })
})
app.listen(PORT, ()=>{console.log(`server is listening on ${PORT}`)});













 







/*
   if(req.session.user !== undefined && req.session.user !== null){
      const refreshToken =  req.session.user.eduall_user_session_refreshToken;
      const AdminUsername = req.session.user.eduall_user_session_username;
        
      if(!refreshToken) return res.status(300).json(req.session);
    
      if(AdminUsername &&  AdminUsername !== undefined && AdminUsername !== null){ 
         const  query = `SELECT * FROM  eduall_employees LEFT JOIN  eduall_user_accounts ON
         eduall_employees.ed_employee_email = eduall_user_accounts.ed_user_account_email  LEFT JOIN  eduall_system_accounts ON
         eduall_system_accounts.ed_system_account_employee = eduall_employees.ed_employee_id
    
         LEFT JOIN eduall_institutes ON eduall_institutes.ed_institute_code = eduall_system_accounts.ed_system_account_institute_code  
         LEFT JOIN eduall_institutes_licences ON eduall_institutes_licences.ed_institute_licence_instituteCode = eduall_system_accounts.ed_system_account_institute_code
    
         WHERE  eduall_user_accounts.ed_user_account_deleted = 0 AND 
         eduall_employees.ed_employee_deleted = 0 AND  eduall_system_accounts.ed_system_account_name = ?  AND eduall_user_accounts.ed_usertoken = ?`;
    
    
    
         DATABASE.query(query, [AdminUsername, refreshToken], (err, row)=>{ 
            if(err) return  res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !!!!!**!*!"});
            if(!row[0]) return  res.status(300).json({msg:"Erro ao iniciar sessão *!"});
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded)=>{
    
              if(CalculateRemainingDays (row[0].ed_institute_licence_startDate, row[0].ed_institute_licence_endDate) <= 0){
                  console.log("Reamining days  = "+ CalculateRemainingDays(row[0].ed_institute_licence_startDate, row[0].ed_institute_licence_endDate))
                  console.log("Data sent with error 😢😢😢")
                 return res.status(300).json({msg:"Acesso bloqueiado, renove a sua licença !"})
             }
                if(err) {
                   console.log(err);
                   console.log("Data sent with error 😢😢😢")
                   return  res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor ++++++++!"});
                }
                const cr_usercode = row[0].ed_user_account_id;
                const cr_username = row[0].ed_user_account_name;
                const cr_useremail = row[0].ed_user_account_email;
                const cr_usertype = 0;
                const cr_username_id =  row[0].ed_system_account_id;
                const cr_user_largecode = row[0].ed_user_account_code;
                const accessToken = jwt.sign({cr_usercode, cr_user_largecode, cr_username_id, cr_username, cr_useremail, cr_usertype}, process.env.ACCESS_TOKEN_SECRET,{
                   expiresIn:'15s'
                });
    
                const  query2 = `SELECT * FROM eduall_user_institutes
                LEFT JOIN eduall_institutes ON   eduall_user_institutes.ed_user_institute_code = eduall_institutes.ed_institute_code 
                LEFT JOIN eduall_institutes_licences ON eduall_institutes_licences.ed_institute_licence_instituteCode =  eduall_user_institutes.ed_user_institute_code  
                WHERE eduall_user_institutes.ed_user_institute_deleted = 0 AND  eduall_user_institutes.ed_user_institute_userCode = ? AND eduall_institutes.ed_institute_code = ?`;
                DATABASE.query(query2, [cr_usercode, row[0].ed_system_account_institute_code], (err, rows)=>{ 
                   console.log(rows);
    
                    if(err) {
                      console.log(err) 
                      console.log("Data sent with error 😢😢😢")
                      return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor *****!"});
                   }
                    if(rows.length >= 1){
                      if(CalculateRemainingDays(rows[0].ed_institute_licence_startDate, rows[0].ed_institute_licence_endDate) <= 0){ 
                         req.session.user.eduall_user_session_curentinstitute =  null;  
                           return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !@@@@@@@@@@@@@"});
                      }else{ 
                       console.log("Data sent 😜😊😍") 
                        return res.json({accessToken});
                      }
                 
                    }else{
                     console.log("Data sent with error 😢😢😢")
                      req.session.user.eduall_user_session_curentinstitute =  null;
                       return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor **+*+*+****!"});
                    } 
                })   
            });
         }); 
         }else{ 
          console.log("Token  = ", refreshToken);
            const  query = 'SELECT * FROM eduall_user_accounts WHERE ed_user_account_deleted = 0 AND ed_usertoken = ?';
            DATABASE.query(query, [refreshToken], (err, row)=>{ 
               if(err){
                console.log(err) 
                console.log("Data sent with error 😢😢😢")
                return res.json(err); 
               } 
               if(row.length <= 0) return  res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor -*-*---***"});
               jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded)=>{
                   if(err) return  res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor */*/*!"});
                   const cr_usercode = row[0].ed_user_account_id;
                   const cr_username = row[0].ed_user_account_name;
                   const cr_useremail = row[0].ed_user_account_email;
                   const cr_usertype = 1;
                   const cr_user_largecode = row[0].ed_user_account_code;
                   const accessToken = jwt.sign({cr_usercode, cr_user_largecode, cr_username, cr_useremail, cr_usertype}, process.env.ACCESS_TOKEN_SECRET,{
                      expiresIn:'15s'
                   }); 
                   console.log("Data sent 😜😊😍")
                   res.json({accessToken});
               });
            }); 
         } 

    }else{
        res.status(300).json("Something went wrong black !");
    } */