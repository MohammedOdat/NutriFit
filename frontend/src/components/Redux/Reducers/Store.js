import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/index"
import coachPrivateReducer from "./CoachPrivate/index"
export default configureStore({
  reducer: {
    auth:authReducer,
    coachPrivate:coachPrivateReducer,
  },
});