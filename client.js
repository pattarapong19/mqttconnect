var mqtt = require('mqtt')

var options = {
    host: '103.207.71.56',
    port: 1883,  // ใช้พอร์ต MQTT ที่ไม่ได้เข้ารหัสแบบเพิ่มเติม
    protocol: 'mqtt',  // เปลี่ยนโปรโตคอลเป็น 'mqtt'
    username: 'saw',
    password: '123456'
}

//initialize the MQTT client
var client = mqtt.connect(options);

//setup the callbacks
client.on('connect', function () {
    console.log('Connected');
});

client.on('error', function (error) {
    console.log(error);
});
client.subscribe('server');
client.on('message', function (topic, message) {
    //Called each time a message is received
    console.log('Received message:', topic, message.toString());
});
 //subscribe to topic 'my/test/topic'

 //client.on('message',(topic,message)=>{
   //  console.log(message.toString());
 //})
 //publish message 'Hello' to topic 'my/test/topic'
