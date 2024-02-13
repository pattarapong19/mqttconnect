const XLSX = require('xlsx');
const fs = require('fs');
const { log } = require('console');

// กำหนดพาธของไฟล์ Excel

exports.ckxlsx =(checkF)=>{
    const excelFilePath = checkF;
    let errorfile  = ''
    // ตรวจสอบว่าไฟล์ Excel ถูกเปิดอยู่หรือไม่
    
    return new Promise((resolve, reject) => {
        fs.access(excelFilePath, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            
            if (err) {
                if (err.code === 'ENOENT') {
                   
                    reject(-1);
                } else {
                    
                    reject('Error accessing the file:'+ err);
                }
                
            }else {
                resolve(200)
            }
            // ทำสิ่งที่ต้องการกับข้อมูลในไฟล์ Excel ต่อไปนี้...
        }); 

    })
        
    
}
