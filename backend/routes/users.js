const express = require("express");

const { register, login,AddUserinfo,getAllUsers ,getAllCoachs,updateUserInfo,getUserInfoByUserId} = require("../controllers/users");
const {authentication} = require("../middleware/authentication");
const usersRouter = express.Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.post("/info/create",authentication,AddUserinfo)
usersRouter.get("/", authentication,getAllUsers)
usersRouter.get("/coaches", authentication,getAllCoachs)
usersRouter.put('/info/:id', authentication,updateUserInfo)
usersRouter.get('/info/:userId',authentication,getUserInfoByUserId)
module.exports = usersRouter;
