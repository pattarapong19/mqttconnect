const mqtt = require("mqtt");
let client = mqtt.connect("mqtt://103.207.71.56");

client.on('connect',()=>{
       client.subscribe('server');
       console.log('Client has subcribed successfully');
});
client.on('message',(topic,message)=>{
        console.log(message.toString());
})