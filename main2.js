var mqtt = require('mqtt')
const fs = require('fs');
const { log } = require('console');
const { createxlsx } = require('./createxlsx');
const moment = require('moment');
const { writeFile } = require('./writexlsx');
const { ckxlsx } = require('./ckxlsx');
const { readfile } = require('./readfile');
const { writeOPC, readOPC } = require('./opcConnect');
const { readModbus, writeModbusData } = require('./modbusConnect');

// สร้างการเชื่อมต่อ MQTT นอกจากฟังก์ชั่น readFile
var options = {
    host: '103.207.71.56',
    port: 1883,  // ใช้พอร์ต MQTT ที่ไม่ได้เข้ารหัสแบบเพิ่มเติม
    protocol: 'mqtt',  // เปลี่ยนโปรโตคอลเป็น 'mqtt'
    username: 'saw',
    password: '123456'
}
const ipM = '192.168.1.16';
const portM = 502;
//initialize the MQTT client
var client = mqtt.connect(options);
let deg = 50;
const senddata = () => {
    return new Promise((resolve, reject) => {
        let plcres = -1;
        let ht = '';

        client.on('message', function (headSendTopic, message) {
            let res = message.toString();
            if(headSendTopic=='deg/1'){
               deg = Number(res)
               console.log('เปลี่ยนอูณภูมิเป็น '+res);
            }else{
                const input = headSendTopic;
                const parts = input.split("/");
                const plc   = parts[0]
                const nplc = Number(parts[1])-1;
                if(nplc>1 && plc =='plc'){
                    writeModbusData(ipM,portM,nplc,[Number(message.toString())])
                }


            }
                
        });
        setTimeout(() => {
            reject(plcres);
        }, 5000); // กำหนดเวลาในการรอให้เหมาะสม
    });
};
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
senddata().then((res)=>console.log(res)).catch(err=>console.log(err))
setInterval(() => {
    readModbus(ipM,portM,0).then((res)=>{
            client.publish("resplc/1",res[0].toString())
            console.log(res[0]);
        if(res[0]>deg){
            client.publish("resplc/0",res[0].toString()) 
            client.publish("led/0","2") 
        }else{
            client.publish("led/0","1") 
        }
    }).catch((err)=>console.log(err))
}, 3500);