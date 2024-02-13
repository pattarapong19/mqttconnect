const XLSX = require('xlsx');
const fs = require('fs');

exports.readfile =(dataMQTT)=>{
    const excelFileName = dataMQTT.a;

// ตรวจสอบว่าไฟล์ Excel มีอยู่หรือไม่
    if (!fs.existsSync(excelFileName)) {
        console.log("ไฟล์ Excel ไม่พบ");
        return;
    }

// อ่านไฟล์ Excel
    const workbook = XLSX.readFile(excelFileName);

// ดึงชื่อของชีททั้งหมด
    const sheetNames = workbook.SheetNames;

// ดึงชื่อของชีทแรก
//    const sheetName = workbook.SheetNames[0];
    const sheetName = dataMQTT.sn

// อ่านข้อมูลจากชีทแรก
    const worksheet = workbook.Sheets[sheetName];
    
// แสดงข้อมูลทั้งหมด
    
    return new Promise((resolve, reject) => {
        if (!sheetNames.includes(sheetName)) {
            reject("ชื่อของชีทที่ระบุไม่มีอยู่ในไฟล์ Excel");
        }else {
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            resolve(data)
        }
    })
}

