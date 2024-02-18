var mqtt = require('mqtt')
const fs = require('fs');
const { log } = require('console');
const { createxlsx } = require('./createxlsx');
const moment = require('moment');
const { writeFile } = require('./writexlsx');
const { ckxlsx } = require('./ckxlsx');
const { readfile } = require('./readfile');
const { writeOPC, readOPC } = require('./opcConnect');
const { readModbus, writeModbusData, readAllModbus } = require('./modbusConnect');
const _ = require('lodash');
require('dotenv').config();
// สร้างการเชื่อมต่อ MQTT นอกจากฟังก์ชั่น readFile
 
var options = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,  // ใช้พอร์ต MQTT ที่ไม่ได้เข้ารหัสแบบเพิ่มเติม
    protocol: 'mqtt',  // เปลี่ยนโปรโตคอลเป็น 'mqtt'
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD
}
const ipM = process.env.IP_MODBUS;
const portM = process.env.PORT_MODBUS;
const max_PLC = Number(process.env.MAX_NUMBERPLC);
const min_PLC = Number(process.env.MIN_NUMBERPLC); 

//initialize the MQTT client
var client = mqtt.connect(options);
let deg = 50;

// ตรวจสอบการเชื่อมต่อ MQTT
client.on('connect', function () {
    console.log('Connected');
});

client.on('error', function (error) {
    console.log(error);
});

// subscribe topic ไว้นอกฟังก์ชั่นเดียวกัน
client.subscribe('#');


// เรียกใช้ฟังก์ชั่นอ่านไฟล์
setInterval(() => {
    readAllModbus(ipM,portM,0,max_PLC).then((res)=>{
        for (let index = 0; index < res.length; index++) {
            const element = res[index];
            const plcN = index+1
            client.publish("resplc/"+plcN.toString(),element.toString())
        }
    }).catch((err)=>{
        console.log(err);
    })
}, 5000);