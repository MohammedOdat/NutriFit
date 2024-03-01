const express = require("express");

const {createGym,
    addNewUserInGym,
    addNewCoachInGym,
    getAllGymByUserId,
    getAllGym,
    getAllUserInGym,
    getAllCoachInGym,
    deleteUserInGym,
    deleteCoachInGym,
    createPlan,
    getGymByOwner,
    getPlanByGymId,
    createRoomInGym,
    getRoomByIdRoom,
    getAllRoomByGymId,
    getGymByGymId,
    getPlanById,
    updateGym,
    updatePlanById,
    downCoachToUser,
    getMessageByPlanName} = require("../controllers/Gym");
const {authentication} = require("../middleware/authentication");
const gymsRouter = express.Router();

gymsRouter.post("/", authentication ,createGym);
gymsRouter.get("/", authentication, getAllGym);
gymsRouter.put("/:gymid", authentication ,updateGym);
gymsRouter.get("/:gymId", authentication, getGymByGymId);
gymsRouter.get("/user/:userId", authentication, getAllGymByUserId);
gymsRouter.get("/owner/:ownerId", authentication,getGymByOwner);
gymsRouter.post("/:gymid/plan/create", authentication,createPlan);
gymsRouter.get("/plan/:gymid", authentication ,getPlanByGymId);
gymsRouter.put("/plan/:planid/update", authentication ,updatePlanById);
gymsRouter.get('/plan/:planid/select', authentication, getPlanById);
gymsRouter.post("/gym/user",authentication, addNewUserInGym);
gymsRouter.get("/:gymId/user", authentication,getAllUserInGym);
gymsRouter.delete("/gym/user", authentication,deleteUserInGym);
gymsRouter.post("/gym/coach", authentication,addNewCoachInGym)
gymsRouter.get(`/:gymId/coach`,authentication, getAllCoachInGym);
gymsRouter.delete("/delete/coach", authentication,deleteCoachInGym)
gymsRouter.post("/:gymid/room/create", authentication,createRoomInGym);
gymsRouter.get("/:gymid/room/:roomid", authentication,getRoomByIdRoom);
gymsRouter.get("/:gymid/room/", authentication,getAllRoomByGymId);
gymsRouter.post("/coach/down", authentication,downCoachToUser);
gymsRouter.get('/message/:gym_id/:plan_name', getMessageByPlanName);

module.exports = gymsRouter