const sqlite = require("sqlite3").verbose();
const mysql = require("mysql"); 
const {LocalStorage} =  require('node-localstorage');
const CheckInternet = require("./CheckInternet");
var localStorage = new LocalStorage('./scratch'); 



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
  password:"mY92miw96iMOuJHuWXH9",   database:"bbwmy0j6vnqfwlwreg3x", port:3306};
} 

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

 
module.exports =  {DATABASE, DB_SQLITE};
 
 
