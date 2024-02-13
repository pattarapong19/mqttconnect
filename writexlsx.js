const XLSX = require('xlsx');


exports.writeFile =(data)=>{

        
        // กำหนดพาธของไฟล์ Excel
        /*const excelFilePath = 'example.xlsx';

        // อ่านข้อมูลจากไฟล์ Excel
        const workbook = XLSX.readFile(excelFilePath);

        // เลือกชีทที่ต้องการอ่านข้อมูล
        const sheetName = workbook.SheetNames[0]; // เลือกชีทแรก
        const worksheet = workbook.Sheets[sheetName];

        // แปลงข้อมูลในชีทเป็นรูปแบบ JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // แสดงข้อมูลทั้งหมดในรูปแบบ JSON
        console.log(jsonData);*/


        // กำหนดพาธของไฟล์ Excel
        const excelFilePath = data.a;
       
        // อ่านข้อมูลจากไฟล์ Excel
        const workbook = XLSX.readFile(excelFilePath);

        // เลือกชีทที่ต้องการอ่านข้อมูล
        //const sheetName = workbook.SheetNames[1]; // เลือกชีทแรก
        
        const worksheet = workbook.Sheets[data.sn];
    
        // กำหนดค่าใหม่ในช่วงที่ต้องการแก้ไข (A8:B9)
        worksheet[data.c].v = data.v;
        //worksheet['A9'].v = 'แก้ไข2';
        //worksheet['B8'].v = 22;
        //worksheet['B10'].f =30;

        
         XLSX.writeFile(workbook, excelFilePath)
        // บันทึกไฟล์ Excel ที่แก้ไขแล้ว
        return new Promise((resolve,reject) =>{
            if(excelFilePath!==''){
                resolve('Save file seccess')
            }else{
                reject('error')
            }
        })

}