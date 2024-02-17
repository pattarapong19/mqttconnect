const ModbusRTU = require('modbus-serial');

// กำหนดค่า IP และพอร์ตของอุปกรณ์ Modbus TCP/IP
//สร้าง client ModbusRTU
const ipM = '192.168.137.1';
const portM = 502;

// ฟังก์ชันเขียนข้อมูล Modbus
async function writeModbusData(ip,port,offset,dataToWrite) {
    const client = new ModbusRTU();
    try {
        // เขียนข้อมูลไปยังอุปกรณ์ Modbus
        
        await client.connectTCP(ip, { port });
        await client.writeRegisters(offset, dataToWrite);
        console.log("Change PLC Value Number :",offset,'Data written successfully to Modbus:', dataToWrite);
        // ส่งค่า true แสดงว่าเขียนข้อมูลเสร็จสิ้น
        
    } catch (error) {
        // ถ้าเกิดข้อผิดพลาดในการเขียน Modbus ให้คืนค่า false
        console.error('Error writing Modbus data:', error);
        
    }
}

async function readModbus(ip, port,resV) {
    const client = new ModbusRTU();

    try {
        // เชื่อมต่อกับอุปกรณ์ Modbus TCP/IP
        await client.connectTCP(ip, { port });
        // อ่านค่า Modbus จากอุปกรณ์ที่อยู่ที่ออฟเซ็ต 5
        const response = await client.readHoldingRegisters(resV, 1);
        return response.data;
    } catch (err) {
        console.error('Read Error:', err);
        return null;
    } finally {
        // ปิดการเชื่อมต่อเมื่อเสร็จสิ้น
        client.close(() => {
            console.log('Disconnected from Modbus TCP/IP');
        });
    }
}

const readAllModbus = async(ipM, portM,offsetV,Ndata)=> {
    const client = new ModbusRTU();

    try {
        // เชื่อมต่อกับอุปกรณ์ Modbus TCP/IP
        await client.connectTCP(ipM, { portM });
        // อ่านค่า Modbus จากอุปกรณ์ที่อยู่ที่ออฟเซ็ต 5
        const response = await client.readHoldingRegisters(offsetV, Ndata);
        return response.data;
    } catch (err) {
        console.error('Read Error:', err);
        return null;
    } finally {
        // ปิดการเชื่อมต่อเมื่อเสร็จสิ้น
        client.close(() => {
            console.log('Disconnected from Modbus TCP/IP');
        });
    }
}


module.exports = {
    readModbus: readModbus,
    writeModbusData: writeModbusData,
    readAllModbus:readAllModbus
};
