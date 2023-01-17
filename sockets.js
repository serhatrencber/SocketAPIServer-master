
const io = require('./server.js');
//const io = new Server(httpServer);


let devices = [
 
];
let getdevices = [];

(io) => {

  io.on("connection", (socket) => {


    console.log("New Socket Connection:", socket.id);

    //io.emit("server:loaddevices", devices);
    
    socket.on("tyrosclient:loginServer", (tloginServer) => {

      
     let getdevices = devices.filter((device) => device.Instance === tloginServer.instance
      && device.Key ===tloginServer.key);
      //console.log(tloginServer.instance);
      socket.join(tloginServer.instance);
      io.to(tloginServer.instance).emit(tloginServer.instance, getdevices);
     /// socket.to(room).emit('user joined', socket.id);


    });
    /// hardware wanna connect to Server. 
    socket.on("hardwareclient:hardwareloginServer", (hloginServer) => {
      var fromDevice= JSON.parse(hloginServer);
      const checkdevices = devices.filter((device) => device.DeviceID === fromDevice.DeviceID
       && device.Instance === fromDevice.Instance && device.Key === fromDevice.Key && device.SocketID === fromDevice.SocketID
      );
      // If there is no hardware in our list
      if (checkdevices=="")
      {

        fromDevice.SocketID=socket.id;

        /// we are adding to list
       

        

       devices.push(fromDevice);
              /// we are replying to hardware.
      // io.emit("server:appendDevice", newdevice);

      // io.emit("server:reponseHardware", newdevice.id);
      // console.log(devices);
    //  console.log(devices);

      }
    //  console.log(devices);

     // io.emit("server:reponseHardware", "We could not  add");


    });

    socket.on("client:printevent", (printBox) => {
   
      const selectedDevice = devices.find((device) => device.DeviceID === printBox.id
      && device.Instance === printBox.instance && device.Key === printBox.key);


      console.log(printBox);
    
       // selectedDevice.Status="THERE IS NO CONNECTION";
       // io.emit("server:upDateDevice", selectedDevice);
         // If our device list has no got  the Device
        // io.emit("server:responseClient", response);
      
        //var printToDevice= JSON.parse(selectedDevice);

         /// Devices are listening to Server and If the device has this ID, it is starting to print 
         io.emit("server:startPrinting",printBox);
        // selectedDevice.status="PRINTING";
        // io.emit("server:upDateDevice", selectedDevice);
       
        /// delete users[socket.id];
       
      
    });

  
      
    socket.on("disconnect", () => {
      console.log(socket.id, "disconnected");
      

      // If The Devices are disconnected, We are remove from online device List
      devices = devices.filter(device => device.SocketID !== socket.id);
      devices.status="There is no connection";
     // delete devices[socket.id];

          });
  });
};
