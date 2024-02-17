const ModbusRTU = require('modbus-serial');
require('dotenv').config();

const ipM = process.env.IP_MODBUS;
const portM = process.env.PORT_MODBUS;

 exports.readAllModbus = async(ipM, portM,resV,Ndata)=> {
    const client = new ModbusRTU();

    try {
        // เชื่อมต่อกับอุปกรณ์ Modbus TCP/IP
        await client.connectTCP(ipM, { portM });
        // อ่านค่า Modbus จากอุปกรณ์ที่อยู่ที่ออฟเซ็ต 5
        const response = await client.readHoldingRegisters(resV, Ndata);
        console.log(response.data);
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



