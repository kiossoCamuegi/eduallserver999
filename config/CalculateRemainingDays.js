const moment = require("moment");

const CalculateRemainingDays = (date1, date2)=>{  
    const currentDate  =  new Date();
    const StartDate  = new Date(moment(date1).format("MM/DD/YYYY"));
    const EndDate  = new Date(moment(date2).format("MM/DD/YYYY"));
    const Difference_In_Time = EndDate.getTime() - StartDate.getTime(); 
    const LicenceLeftDays = (Difference_In_Time / (1000 * 3600 * 24))*1; 

    if(EndDate.getTime() < currentDate.getTime()){return 0}else{return LicenceLeftDays}; 
} 

module.exports = CalculateRemainingDays;

