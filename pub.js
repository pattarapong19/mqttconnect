const mqtt = require("mqtt");
let client = mqtt.connect("mqtt://103.207.71.56");

client.on("connect",()=>{
    setInterval(()=>{
        let random = Math.random()*50;
        console.log(random);
        if(random<30){
            client.publish('server','Simple MQTT using HiveMQ : '+random.toString()+'.')
        }
    },3000)
})