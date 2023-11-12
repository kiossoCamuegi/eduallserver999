const {LocalStorage} =  require('node-localstorage');
var localStorage = new LocalStorage('./scratch'); 
const { DATABASE } = require("../config/Database");


const UpdateCurrentUserInstitute = async(req, res)=>{   
    const {CODE} = req.body; 

    console.log("Code = ", CODE);
    try {
        const  query = `SELECT * FROM   eduall_institutes WHERE ed_institute_code = ?`;
       DATABASE.query(query, [CODE], (err, rows)=>{ 
        if(err) return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !"});
        if(rows.length >= 1){ 

            localStorage.setItem('eduall_user_curentinstitute', CODE); 
            res.status(200).json("Informação atualizada com sucesso !"); 

        }else{
            res.status(300).json({msg:"Instituição não encomtrada !"});
        }     
    })
    } catch (error) {
        console.clear();
        console.log(CODE);
        console.log(error);
        res.status(300).json({msg:"Instituição não encomtrada  !"});
    } 
}
 
function GetCurrentUserData(e) {
    const data =  [
        localStorage.getItem("eduall_user_curent"),
        localStorage.getItem("eduall_user_curentinstitute"),
    ];
    return data[e*1];
}

module.exports =  {GetCurrentUserData, UpdateCurrentUserInstitute};