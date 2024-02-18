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
const senddata = () => {
    return new Promise((resolve, reject) => {
        let plcres = -1;
        let ht = '';
        
        client.on('message', function (headSendTopic, message) {
            let res = message.toString();  
                const input = headSendTopic;
                const parts = input.split("/");
                const plc   = parts[0]
                const nplc = Number(parts[1])-1;
                let newArray = []

                if(nplc >= min_PLC && nplc<= max_PLC && plc =='plc'){  
                    writeModbusData(ipM,portM,nplc,[Number(message.toString())])
                }else if(plc=='allplc'){
                    
                    readModbus(ipM,portM,1).then((res)=>{
                        const counts = _.countBy(res);
                        const maxCount = _.max(Object.values(counts));
                        const mostFrequentValues = Object.keys(counts).filter(key => counts[key] === maxCount).map(Number);
                        if(mostFrequentValues[0]==0){
                            newArray = _.fill(new Array(max_PLC-1), 1);                            
                            writeModbusData(ipM,portM,1,newArray)
                        }else {
                            newArray = _.fill(new Array(max_PLC-1), 0);
                            writeModbusData(ipM,portM,1,newArray)
                        } 
                    })
                    
                }else if(plc=='allplc0'){ 
                            newArray = _.fill(new Array(max_PLC-1), 0);
                            writeModbusData(ipM,portM,1,newArray)                           
                }else if(plc=='allplc1'){ 
                    newArray = _.fill(new Array(max_PLC-1), 1);
                    writeModbusData(ipM,portM,1,newArray)                           
        }else{
            reject('error not plc')
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
