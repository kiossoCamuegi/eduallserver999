const sqlite = require("sqlite3").verbose();
const mysql = require("mysql");   
const session = require('express-session'); 
const mysqlStore = require('express-mysql-session')(session);



const DB_SQLITE = new sqlite.Database("./me.db", (err) => {
    if (err) {
      console.error(err.message);
    }else{
      console.log(' ');
      console.log('*************************************************************');
      console.log('************* BANCO DE DADOS OFFLINE CONECTADO **************');
      console.log('*************************************************************');
      console.log(' ');
    }
}); 

  
const CurrentNetworkStatus = ()=>{  
  return {host:"bbwmy0j6vnqfwlwreg3x-mysql.services.clever-cloud.com",  user:"uf3c2i1lgdfrfn9v",
  password:"mY92miw96iMOuJHuWXH9",   database:"bbwmy0j6vnqfwlwreg3x", port:3306,
 
    connectionLimit: 10 ,
    connectTimeout: 10000,
    waitForConnections: true,
    queueLimit: 0 , 
};

} 

const pool = mysql.createPool(CurrentNetworkStatus());
const  SESSION_STORE = new mysqlStore(CurrentNetworkStatus(), pool);




var connection;
let DATABASE  = connection;
function handleDisconnect() {
connection = mysql.createConnection(CurrentNetworkStatus());  
connection.connect(function(err) {      
if(err) {                        
  setTimeout(handleDisconnect, 2000); 
}else{
  console.log("connected !🤣😒😍❤")
}    
});                                     
connection.on('error', function(err) {
console.log('db error', err);
if(err.code === 'PROTOCOL_CONNECTION_LOST') {  
  handleDisconnect();      
} else {    
  throw err;              
}
});
DATABASE  = connection;
}

handleDisconnect();

 
module.exports =  {DATABASE, SESSION_STORE, DB_SQLITE};
 
 
