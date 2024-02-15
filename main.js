
var mqtt = require('mqtt')
const fs = require('fs');
const { log } = require('console');
const { createxlsx } = require('./createxlsx');
const moment = require('moment');
const { writeFile } = require('./writexlsx');
const { ckxlsx } = require('./ckxlsx');
const { readfile } = require('./readfile');
const { writeOPC, readOPC } = require('./opcConnect');

// สร้างการเชื่อมต่อ MQTT นอกจากฟังก์ชั่น readFile
var options = {
    host: '103.207.71.56',
    port: 1883,  // ใช้พอร์ต MQTT ที่ไม่ได้เข้ารหัสแบบเพิ่มเติม
    protocol: 'mqtt',  // เปลี่ยนโปรโตคอลเป็น 'mqtt'
    username: 'saw',
    password: '123456'
}

//initialize the MQTT client
var client = mqtt.connect(options);

const  senddata = () => {
    // ส่งข้อมูลผ่าน MQTT โดยใช้การเชื่อมต่อที่สร้างไว้นอกฟังก์ชั่น
    client.on('message', function (headSendTopic, message) {
        
        let res = JSON.parse(message.toString())

      if(res.e=='ck')
         {
           ReadFile(res)
         }
        else{
            try {
                 ckxlsx(res.a).then((rev) => {
                    if(res.e == 'ed') {
                        WriteFile(res).then((resove)=>{PublicMQTT(res.v,headSendTopic)}).catch((err)=>{console.log(err)})
                    } else {
                      /*  xlxsfile(res).then((resove)=>{
                                                        PublicMQTT(res.v,headSendTopic)
                                                        console.log(resove);
                                                    }).catch((err)=>{console.log(err)});*/
                        createxlsx(res).then((resove)=>{
                                                            PublicMQTT(res.v,headSendTopic)
                                                            console.log(resove);
                                                        }).catch((err)=>{console.log(err)});
                          
                    }
                }).catch((err) => {
                    if(err == -1) {
                        xlxsfile(res).then((resove)=>{PublicMQTT(res.v,headSendTopic)}).catch((err)=>{console.log(err)});
                        
                    } else {
                        console.log(err);
                    }
                });
            } catch (error) {
                console.log("Error in ckxlsx:", error);
              
            }
        }
    

      
     
    })
    
   
  
}
// ตรวจสอบการเชื่อมต่อ MQTT
client.on('connect', function () {
    console.log('Connected');
});

client.on('error', function (error) {
    console.log(error);
});

// subscribe topic ไว้นอกฟังก์ชั่นเดียวกัน
client.subscribe('#');

const xlxsfile = async (nowdate)=>{
    await createxlsx(nowdate).then((revsove)=>{console.log(revsove);}).catch((err)=>{console.log(err);})
    
}
const WriteFile = async (datajson)=>{
    await writeFile(datajson).then((revsove)=>{console.log(revsove);}).catch((err)=>{console.log(err);})
    
}
const ReadFile =async (datajson)=>{
    await readfile(datajson).then((res)=>console.log(res)).catch((err)=>console.log(err))
}

const PublicMQTT=(data,headSendTopic)=>{
    return new Promise((resolve, reject) => {
        if(headSendTopic =='temp/1' && data>50)
        {
          
            client.publish("vol/1",data.toString())
            resolve("warnning!!" + headSendTopic + " > 50  value is " + data.toString());

       
        }else
            {
                reject('Error cat not sand data')
            }
    })

}
// เรียกใช้ฟังก์ชั่นอ่านไฟล์
senddata()
