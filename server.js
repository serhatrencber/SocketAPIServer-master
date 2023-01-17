const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const {Server} = require('socket.io');
const http = require('http');

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const server = http.createServer(app);
const httpServer = server.listen(3000);

const io = new Server(httpServer);
const routes = require('./routes/routes.js')(app,fs);

console.log("Server on http://localhost:3000");

//// Server 
var JSONObj = new Object();
var sendObj= new Object();
sendObj={
  "devices": [
    
  ]
}
let connectors = [];
let users = [];

  io.on("connection", (socket) => {

    const sessionID = socket.id;
    console.log("New Socket Connection:", socket.id);
    socket.on("tyrosclient:loginServer", async (tloginServer) => {
    
      const checkusers = await users.filter((user) => user.Instance === tloginServer.instance
     );

     // If there is no users in our list
     if (checkusers=="")
     {
      tloginServer.SocketID=socket.id;
      tloginServer.Request="getDevices";
     // socket.manager.onClientDisconnect(socket.id);
     //socket.disconnect(true);
    
      users.push(tloginServer);
     console.log(tloginServer)
     }
    // socket.join(tloginServer.instance)
    // io.to(tloginServer.instance).emit(tloginServer.instance, tloginServer);

   // io.emit(tloginServer.instance, "getFromDevices");
       //  console.log(tloginServer.instance);

     // io.emit(tloginServer.instance,"getFromDevices");

      let selectedConnector = await connectors.find((device) => device.Instance === tloginServer.instance);

      await socket.join(tloginServer.instance);
      io.emit(selectedConnector.SocketID,tloginServer);
     // console.log(selectedConnector.SocketID);

      //  Array.from(JSONObj).forEach((device) => {
      //   delete JSONObj[0]["Instance"];
      //   delete JSONObj[0]["Key"];
      //   delete JSONObj[0]["IPAddress"];
      //   delete JSONObj[0]["Port"];
      //   delete JSONObj[0]["ConnectionType"];
      //   sendObj["devices"].push(device);
      // });
       

       //io.to(tloginServer.instance).emit(tloginServer.instance, sendObj);
     /// socket.to(room).emit('user joined', socket.id);
     //console.log(JSONObj);

    // console.log(getdevices);

    });

    socket.on("sendingFromDevices", async  (socketId,sendingFromDevices) => {
     
      var fromDevice= await JSON.parse(sendingFromDevices);

     // fromDevice.SocketID=socket.id;
      // console.log(fromDevice);
    //io.emit("server:loaddevices", devices);
    io.emit(socketId,fromDevice);


  });

    socket.on("hardwareclient:hardwareloginServer", (hloginServer) => {
     
      var fromDevice= JSON.parse(hloginServer);

      fromDevice.SocketID=socket.id;
       //console.log(fromDevice);
      //console.log(fromDevice.DeviceID);
      //console.log(fromDevice.Instance);
      const checkdevices = connectors.filter((device) => device.DeviceID === fromDevice.DeviceID
       && device.Instance === fromDevice.Instance && device.Key === fromDevice.Key && device.SocketID === fromDevice.SocketID
      );
      // If there is no hardware in our list
      if (checkdevices=="")
      {

        //fromDevice.SocketID=socket.id;

        /// we are adding to list

       connectors.push(fromDevice);
              /// we are replying to hardware.
      // io.emit("server:appendDevice", newdevice);

      // io.emit("server:reponseHardware", newdevice.id);
      // console.log(fromDevice);
     //console.log(devices);

      }
    //  console.log(devices);

     // io.emit("server:reponseHardware", "We could not  add");


    });

    
    /// hardware wanna connect to Server. 
    
    socket.on("action",async (printBox) => {
      printBox= JSON.parse(printBox);
      const selectedDevice = connectors.find((device) => device.DeviceID === printBox.DeviceID
      && device.Instance === printBox.Instance);
      console.log(connectors);

     // socket.join(selectedDevice.Instance);
      await io.emit(selectedDevice.SocketID,printBox);
      console.log(printBox);
    
       // selectedDevice.Status="THERE IS NO CONNECTION";
       // io.emit("server:upDateDevice", selectedDevice);
         // If our device list has no got  the Device
        // io.emit("server:responseClient", response);
      
        //var printToDevice= JSON.parse(selectedDevice);

         /// Devices are listening to Server and If the device has this ID, it is starting to print 
       //  io.emit("server:startPrinting",printBox);
        // selectedDevice.status="PRINTING";
        // io.emit("server:upDateDevice", selectedDevice);
       
        /// delete users[socket.id];
       
      
    });
    socket.on("actionResult", async  (socketId,actionResult) => {
     
      var actionResult= await JSON.parse(actionResult);

     // fromDevice.SocketID=socket.id;
      // console.log(fromDevice);
    //io.emit("server:loaddevices", devices);
    io.emit(socketId,actionResult);


  });
  
      
    socket.on("disconnect", () => {
      console.log(socket.id, "disconnected");
      

      // If The Devices are disconnected, We are remove from online device List
     connectors = connectors.filter(device => device.SocketID !== socket.id);
     users = users.filter(user => user.SocketID !== socket.id);

    //  sendObj = sendObj.filter(device => device.SocketID !== socket.id);

     // devices.status="There is no connection";
     // delete devices[socket.id];

          });
  });

