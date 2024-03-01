const express = require("express");
const cors = require("cors");
const{Server} = require('socket.io')
const {auth}=require("./middleware/authentication")
 require("dotenv").config()
require("./models/db");
require("./models/dbMongoose");
const messageHandler = require('./controllers/Messages');
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
const gymsRouter = require("./routes/Gym");
const roleRouter = require("./routes/Roles");
const permissionRouter=require('./routes/permissions')
const rolePermissionRouter=require('./routes/role_permission')
const usersRouter = require("./routes/users");
const coachRouterRouter = require("./routes/coachs");
app.use("/gyms", gymsRouter)
app.use("/roles", roleRouter)
app.use("/users",usersRouter)
app.use("/permissions",permissionRouter)
app.use("/role_permission",rolePermissionRouter)
app.use("/coachs",coachRouterRouter)


const io= new Server(8080,{cors:{origin:"*"}});
const client={}

io.use(auth);


io.on("connection",(socket)=>{
  console.log("connected", socket.data);

  const user_id=socket.handshake.headers.user_id
  client[user_id]={socket_id:socket.id,user_id}
  console.log(client);
  messageHandler(socket, io)
  socket.on("disconnect",()=>{
    for (const key in client) {
     if(client[key].socket_id===socket.id){
      delete client[key]
     }
    }
    console.log(client);
  })

})

app.use("*", (req, res) => res.status(404).json("NO content at this path"));


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
