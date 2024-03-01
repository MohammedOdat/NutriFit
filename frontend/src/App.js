import {Route, Routes} from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage/LandingPage";
import Login from "./components/Login/Login";
import NavBar from "./components/NavBar/NavBar";
import Register from "./components/RegisterPage/Register";
import NotFound from "./components/NotFound/NotFound";
import Home from "./components/Home/Home";
import CoachPrivate from "./components/Home/CoachPrivate/CoachPrivate";
import CreateGym from "./components/CreateGym/CreateGym";
import ProfileSetting from "./components/ProfileSetting/Profile"
import Settings from "./components/Home/CoachPrivate/Settings/Settings";
import PlanGym from "./components/Gym/PlanGym/PlanGym";
import PaymentPlan from "./components/PaymentPlan/PaymentPlan";
import AddUserInfo from "./components/AddUserInfo/UserInfo";
import UserPrivate from "./components/Home/UserPrivate/UserPrivate";
import GymGroup from "./components/Gym/GymGroup/GymGroup";
import SettingsGym from "./components/Gym/Settings/Settings";
import PrivatePlan from "./components/PrivatePlan/PrivatePlan";
import PaymentPrivatePlan from "./components/PaymentPlan/PaymentPrivatePlan";
import Recipe from "./components/Recipe/Recipe";
import Ingredients from "./components/Recipe/Ingredients";

function App() {

  return (
    <div className="App">
     <NavBar/>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="*" element={<NotFound/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/userinfo" element={<AddUserInfo/>}/>
        <Route path="/gym/create" element={<CreateGym/>}/>
        <Route path="/coach/private" element={<CoachPrivate/>}/>
        <Route path="/Profile" element={<ProfileSetting/>}/>
        <Route path="/coach/private/setting" element={<Settings/>}/>
        <Route path="/:gymid/plan" element={<PlanGym/>}/>
        <Route path="/checkout/:gymid/:planid" element={<PaymentPlan/>}/>
        <Route path="/user/private" element={<UserPrivate/>}/>
        <Route path="/gym/:gymid" element={<GymGroup/>}/>
        <Route path="/:gymid/settings" element={<SettingsGym/>}/>
        <Route path="/:coachid/private/plan" element={<PrivatePlan/>}/>
        <Route path="/checkout/private/:coachid/:planid" element={<PaymentPrivatePlan/>}/>
           <Route path="/recipe" element={<Recipe/>}/>
        <Route path="/recipe/:id/ingredients" element={<Ingredients/>}/>
      </Routes>
    </div>
  );
}

export default App;
