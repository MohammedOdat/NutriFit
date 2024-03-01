const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  try {
    
    if (!req.headers.authorization)
      res.status(403).json({ message: "forbidden" });

    const token = req.headers.authorization.split(" ").pop();

    jwt.verify(token, process.env.SECRET, (err, result) => {
      if (err) {
        res.status(403).json({
          success: false,
          message: `The token is invalid or expired`,
        });
      } else {
        req.token = result;
        
        next();
      }
    });
  } catch (error) {
    res.status(403).json({ message: "forbidden" });
  }
};


const auth=(socket,next)=>{
  const headers = socket.handshake.headers
  if(!headers.token){
       next(new Error("invalid"))
  }else{
    socket.join("room-" + headers.room)
    socket.user = {token:headers.token,user_id:headers.user_id}
    next();
  }
}
module.exports = {authentication,auth};

