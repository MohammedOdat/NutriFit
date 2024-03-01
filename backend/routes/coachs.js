const express = require("express");
const coachRouter = express.Router();
const {
  createNewPlane,
  AddUserToPrivate,
  removeUserFromPrivate,
  getAllPlanByCoachId,
  getAllUserByPlanId,
  activePrivate,
  disActivePrivate,
  getAllCoachsAreOpenPrivate,
  getAllUserByCoachId,
  getAllCoachesByUserId,
  updatePlanByName,
  removePlanByName,
  getPlanById,
  getMessageByPrivate,
  filterCoachs
} = require("../controllers/coachs");
const {authentication} = require("../middleware/authentication");
coachRouter.post("/plan", authentication, createNewPlane);
coachRouter.get("/plan/:coachid", authentication, getAllPlanByCoachId);
coachRouter.post("/user", authentication, AddUserToPrivate);
coachRouter.get('/user',authentication,getAllUserByCoachId)
coachRouter.get('/coach',authentication,getAllCoachesByUserId)
coachRouter.put("/user/remove", authentication, removeUserFromPrivate);
coachRouter.get("/:idplan/user", authentication, getAllUserByPlanId);
coachRouter.get("/private", authentication, activePrivate);
coachRouter.get("/private/disactive",authentication,disActivePrivate)
coachRouter.get("/openedprivate", authentication, getAllCoachsAreOpenPrivate);
coachRouter.put('/plan',authentication,updatePlanByName)
coachRouter.put('/remove/plan',authentication,removePlanByName)
coachRouter.get('/plans/plan/:plan_id',authentication,getPlanById)
coachRouter.get('/message/:coach_id/:user_id',authentication,getMessageByPrivate)
coachRouter.get('/filter/',authentication,filterCoachs)
module.exports = coachRouter;
