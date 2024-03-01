import axios from 'axios'
import React ,{useState,useEffect} from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";
import "./PrivatePlan.css"
import Spinner from "react-bootstrap/Spinner";
import logo from "../assets/user.png"
const PrivatePlan = () => {
    const navigate = useNavigate();
    const [success, setSuccess] = useState(null)
    const [message, setMessage] = useState("")
    const [plans, setplans] = useState([])
    const [coachInfo, setCoachInfo] = useState({})
    const [planLoader, setPlanLoader] = useState(true)
    const [nameLoader, setNameLoader] = useState(true)
    const [picLoader, setPicLoader] = useState(true)
    const [onTheme, setOnTheme] = useState(false);
    const{coachid}=useParams()
    const { token, userId,theme } = useSelector((state) => {
        return {
          token: state.auth.token,
          userId: state.auth.userId,
          theme : state.auth.theme
        };
      });
      useEffect(() => {
        getAllPlans()
        getCoachInfo()
      }, [])
      useEffect(()=>{
        if(theme === "female"){
          setOnTheme(true);
        }else{
          setOnTheme(false);
        }
      },[theme]);
    const getAllPlans = () => {
      setPlanLoader(true)
        axios
          .get(`http://localhost:5000/coachs/plan/${coachid}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((result) => {
            if (result.data.plans) {
              setPlanLoader(false)
                setplans(result.data.plans)
            } else {
              setPlanLoader(false)
              setSuccess(result.data.success)
              setMessage("There is No Plan Yet");
            }
          })
          .catch((error) => {
            setPlanLoader(false)
            setSuccess(false);
            setMessage("Somethig Went Wrong Please Try Again");
          });
      };
const getCoachInfo=()=>{
  setPicLoader(true)
  setNameLoader(true)
    axios.get(`http://localhost:5000/users/info/${coachid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((result)=>{
        setPicLoader(false)
        setNameLoader(false)
        setCoachInfo(result.data.info)
      }).catch((error)=>{
        setPicLoader(false)
        setNameLoader(false)
        setSuccess(false);
        setMessage("Somethig Went Wrong Please Try Again");
      })
}
  return (<div className='Private-Plan-Page'>
          <div className='continer-info-coach'>
        <div className='contener-info-coach'>
        {picLoader ? (
              <div
                style={
                  picLoader
                    ? {
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        placeItems: "center",
                        justifyContent: "center",
                      }
                    : { display: "none" }
                }
              >
                <Spinner animation="border"  style={
          !onTheme?{color:"#A1E335"}:{color:"#E333E5"}} />
                <label>Loading...</label>
              </div>
            ): <div className='continer-image-coach'>
                <img className='image-coach' src={coachInfo&&coachInfo.image?coachInfo.image:logo}/>
            </div>}
            {nameLoader ? (
              <div
                style={
                  nameLoader
                    ? {
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        placeItems: "center",
                        justifyContent: "center",
                      }
                    : { display: "none" }
                }
              >
                <Spinner animation="border"  style={
          !onTheme?{color:"#A1E335"}:{color:"#E333E5"}} />
                <label>Loading...</label>
              </div>
            ):<div className='name-coach'>
                <h3>{coachInfo && coachInfo.firstname} {coachInfo && coachInfo.lastname}</h3>
            </div>}
            
            
        </div>
    </div>
    {planLoader ? (
              <div
                style={
                  planLoader
                    ? {
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        placeItems: "center",
                        justifyContent: "center",
                      }
                    : { display: "none" }
                }
              >
                <Spinner animation="border"  style={
          !onTheme?{color:"#A1E335"}:{color:"#E333E5"}} />
                <label>Loading...</label>
              </div>
            ) :<div className='container-plans'>
        {plans&&plans.map((plan,i)=>
               <div className='plan'>
               <div className='name-price-month-plan'>
                   <h4 className='name-plan'>{ plan.name}</h4>
                   <h2 className='price-plan' style={
          !onTheme?{color:"#A1E335"}:{color:"#E333E5"}}>${plan.price}</h2>
                   <h5 className='month-plan'>{`per ${plan.numofmonth} Month`}</h5>
               </div>
   
               <div className='description-plan'>
                   <p>{plan.description}</p>
               </div>
               <div className='select-plan'>
                   <button className='select-btn'  style={
          !onTheme?{backgroundColor:"#A1E335"}:{backgroundColor:"#E333E5"}} onClick={()=>{
                       navigate(`/checkout/private/${plan.coach_id}/${plan.id}`)
                   }}>select Plan</button>
               </div>
           </div>
        )}
        
    </div>}
    <div
        className={
          success ? message && "SuccessMessage" : message && "ErrorMessage"
        }
        style={{ padding: "5px" }}
      >
        <span style={{ visibility: "hidden" }}>:</span>
        {message}
      </div>
  </div>
  )
}

export default PrivatePlan