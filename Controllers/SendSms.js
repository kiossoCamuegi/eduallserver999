const textflow = require("textflow.js");
textflow.useKey("BC9XkFVbooFV5gQ8QRDju5A60FMcuP3MYDrtwK0rpTv1AJEuNCBBdHimIcoyNCky");

 async function SendSms(phone, message){
    let result = await textflow.sendSMS("+244925459395", "message");
    if (result.ok) {
        console.log(result)
    }else{
        console.log(result);
    }
}

console.log(SendSms("+244925459395" ,  "Oi"));

 