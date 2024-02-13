        
        const opcua = require("node-opcua");
exports.writeOPC = (dataOPC)=>{
        // กำหนดค่า endpoint URL ของ PLC
        const endpointUrl = dataOPC.url;
        //const endpointUrl = "opc.tcp://<PLC_IP_ADDRESS>:<PORT>";
        (async () => {
            try {
                const client = new opcua.OPCUAClient();
                
                // เชื่อมต่อกับ PLC
                await client.connect(endpointUrl);
                
                console.log("Connected to PLC");
                
                const session = await client.createSession();
                
                // ส่งข้อมูลไปยัง PLC
                const dataValue = new opcua.DataValue({
                    value: {
                        dataType: opcua.DataType.String,
                        value: "Hello PLC"
                    }
                });
                
                //const nodeId = "ns=1;s=MyVariable"; // กำหนด Node ID ของตัวแปรใน PLC
                const nodeId = dataOPC.nodeID;
                await session.writeSingleNode(nodeId, dataValue);
                
                console.log("Data sent to PLC");
                
                // ปิดเซสชันและยกเลิกการเชื่อมต่อ
                await session.close();
                await client.disconnect();
                
                console.log("Disconnected from PLC");
            } catch (err) {
                console.error("Error:", err);
            }
        })();
    }

   
exports.readOPC = (dataOPC)=>{
    const endpointUrl = dataOPC.url;
        (async () => {
            try {
                const client = new opcua.OPCUAClient();
                
                // เชื่อมต่อกับ PLC
                await client.connect(endpointUrl);
                console.log("Connected to PLC");
                
                const session = await client.createSession();
                
                // อ่านข้อมูลจาก PLC
                const nodeId = dataOPC.nodeID; // กำหนด Node ID ของตัวแปรใน PLC
                const dataValue = await session.read({
                      nodeId:nodeId,
                      attributeId:opcua.AttributeIds.Value
                })
                console.log("Data from PLC:", dataValue.toString());
                
                // ปิดเซสชันและยกเลิกการเชื่อมต่อ
                await session.close();
                await client.disconnect();
                console.log("Disconnected from PLC");
            } catch (err) {
                console.error("Error:", err);
            }
        })();

}