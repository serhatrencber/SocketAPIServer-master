const io = require("socket.io-client");

const userRoutes = (app, fs) => {
  const socket = io.connect("http://localhost:3000");
  socket.on('connect', () => {
    console.log("APIs Socket ID : ", socket.id); 
 });

  app.post('/deviceList', async function(req, res){
   

    var user =  req.body;
    JSON.stringify(user);
    var instance= user.instance;
    var key= user.key;
    var socketId=socket.id;
    action="deviceList";
    async function doesSocketAgree(){
      await socket.emit("tyrosclient:loginServer", {instance});
      await socket.once(socket.id, (getdevices)=>{
          // console.log(socket.id);
            return  res.send(getdevices);
      });
    }

    try{
      doesSocketAgree();
   
   
        }catch(err){
        //  console.log(err);
            return next(err);
          }
    });


   
    app.post('/action', async function(req, res){
    

    var printBox = await req.body;

    // //var printBox=JSON.stringify(printBox);
    // var DeviceID= printBox.DeviceID;
    // var Instance= printBox.Instance;
    // var Key= printBox.Key;
    // var Payload= printBox.Payload;
    var SocketID=socket.id;
    var Request="Print";
    printBox.SocketID=SocketID;
    printBox.Request=Request;

   // console.log(printBox);
    printBox=JSON.stringify(printBox);
    async function doesSocketAgree(){
      await socket.emit("action", (printBox));
      await socket.once(socket.id, (getdevices)=>{
          // console.log(socket.id);
            return  res.send(getdevices);
      });
    }

    try{
      doesSocketAgree();
   
   
        }catch(err){
        //  console.log(err);
            return next(err);
          }
        

      });
  
      
};

module.exports = userRoutes;
