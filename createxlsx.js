const XLSX = require('xlsx');
const fs = require('fs');

exports.createxlsx = (mqttData) => {
    // ตรวจสอบว่าไฟล์ Excel ถูกสร้างไว้แล้วหรือไม่
    const excelFileName = mqttData.a;
    const isExist = fs.existsSync(excelFileName);
    
    // อ่านข้อมูลจากไฟล์ Excel หากมีอยู่
    let existingData = [];
    if (isExist) {
        const workbook = XLSX.readFile(excelFileName);
       // const sheetName = workbook.SheetNames[0]; // เรียกชื่อของชีทแรก
        existingData = XLSX.utils.sheet_to_json(workbook.Sheets[mqttData.sn], {header:1}); // โดยเพิ่ม {header: 1}
    }

    // เพิ่มข้อมูลใหม่ลงในอาร์เรย์ของข้อมูลที่มีอยู่
    existingData.push(["อูณภูมิ",mqttData.v]);

    // สร้าง Workbook ใหม่
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(existingData);

    // เพิ่ม Worksheet เข้าไปใน Workbook
    XLSX.utils.book_append_sheet(wb, ws, mqttData.sn);

    // สร้างไฟล์ Excel 
    XLSX.writeFile(wb, excelFileName);

    //console.log('Excel file created successfully.');

    return new Promise((resolve, reject) => {
        if (fs.existsSync(excelFileName)) {
            console.log('Excel file saved successfully.');
            resolve(200);
        } else {
            console.log('Error: Failed to save Excel file.');
            reject('Error: Failed to save Excel file.');
        }
    });
}
