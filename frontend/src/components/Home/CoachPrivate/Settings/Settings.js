import React, { useState, useEffect } from "react";
import "./Settings.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  setPlans,
  addNewPlan,
} from "../../../Redux/Reducers/CoachPrivate/index";
import axios from "axios";
import { setActivePrivate } from "../../../Redux/Reducers/Auth";
import CloseButton from 'react-bootstrap/CloseButton';

const Settings = () => {
  const dispatch = useDispatch();
  const { token, userId, activePrivate, plans , theme} = useSelector((state) => {
    return {
      token: state.auth.token,
      userId: state.auth.userId,
      activePrivate: state.auth.activePrivate,
      plans: state.coachPrivate.plans,
      theme : state.auth.theme
    };
  });
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState("");
  const [arr, setarr] = useState([]);
  const [abeled, setAbeled] = useState(false);
    // const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(null);
  const [numOfMonth, setNumOfMonth] = useState(null);
  const [onTheme, setOnTheme] = useState(false);
  useEffect(()=>{
    if(theme === "female"){
      setOnTheme(true);
    }else{
      setOnTheme(false);
    }
  },[theme]);

  const getAllPlans = () => {
    axios
      .get(`http://localhost:5000/coachs/plan/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        if (result.data.plans) {
          const arr_plans = result.data.plans.map((ele, i) => {
            return ele.name;
          });
          dispatch(setPlans(result.data.plans));
          setarr(arr_plans);
        } else {
          
          setMessage("There is No Plan Yet");
        }
      })
      .catch((error) => {
        setSuccess(false);
        setMessage(error.response.data.message);
      });
  };
  const updatePlan=(name)=>{
    setAbeled(true);
    axios.put(`http://localhost:5000/coachs/plan`,{name:name,description,numOfMonth,price}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((result)=>{
      console.log(result);
      setAbeled(false);
      setSuccess(result.data.success);
      setMessage(result.data.message);
      getAllPlans()
    }).catch((error)=>{
      setSuccess(false);
          setMessage(error.response.data.message);
      setAbeled(false);
      console.log(error);
    })
  }
  const deletePlan=(name)=>{
    axios.put(`http://localhost:5000/coachs/remove/plan`,{name:name}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((result)=>{
      getAllPlans()
      setSuccess(result.data.success);
      setMessage(result.data.message);
    }).catch((error)=>{
      setSuccess(false);
      setMessage(error.response.data.message);
    })
  }
  const disActivePrivate = () => {
    axios
      .get(`http://localhost:5000/coachs/private/disactive`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(setActivePrivate("0"));
        setSuccess(result.data.success);
        setMessage(result.data.message);
      })
      .catch((error) => {
        setSuccess(false);
        setMessage(error.response.data.message);
      });
  };
  useEffect(() => {
    getAllPlans();
  }, []);

  const createNewPlan = (name) => {
    console.log(name);
    setAbeled(true);
    if (name && description && price && numOfMonth) {
      axios
        .post(
          `http://localhost:5000/coachs/plan`,
          { name: name, description, price, numOfMonth },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((result) => {
          dispatch(addNewPlan(result.data.plan));
          setSuccess(result.data.success);
          setMessage(result.data.message);
          setAbeled(false);
          getAllPlans()
        })
        .catch((error) => {
          setSuccess(false);
          setMessage(error.response.data.message);
          setAbeled(false);
        });
    } else {
      setSuccess(false);
      setMessage("Please Fill All Field");
      setAbeled(false);
    }
  };

  const activePrivateFun = () => {
    axios
      .get(`http://localhost:5000/coachs/private`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(setActivePrivate("1"));
        setSuccess(result.data.success);
        setMessage(result.data.message);
      })
      .catch((error) => {
        setSuccess(false);
        setMessage(error.response.data.message);
      });
  };
  return (
    <div className="setting-Page">
      <div className="Page-Title">
        <h1>Settings Private</h1>
      </div>
      <div className="Items">
        <div className="Open-Private">
          <h1 className="open">Open Private</h1>
          <div className="toggle">
            <Form.Check
              className="form-check-input form-switch"
              checked={activePrivate === "1" ? true : false}
              onChange={(e) => {
                console.log(e.target.checked);
                e.target.checked ? activePrivateFun() : disActivePrivate();
              }}
              type="switch"
            />
          </div>
        </div>
        <div className="Plans">
          {!arr.includes("Lite") &&
             <div className="Plan">
             <div className="Plan-Title">Lite Plan</div>
             
             <div className="inputs">
               <div className="Description-Input">
                 <Form.Label>Description Plan Lite</Form.Label>
                 <Form.Control
                   style={{
                     height: "100%",
                     backgroundColor: "#1e1e1e",
                     border: "0",
                     color: "white",
                   }}
                   as="textarea"
                   rows={3}
                   onChange={(e) => {
                     setDescription(e.target.value);
                   }}
                 />
               </div>
               <div className="Sub-Duration">
                 <p
                   style={{
                     fontSize: "larger",
                     width: "70%",
                     textAlign: "left",
                   }}
                 >
                   Subscription Duration:
                 </p>
                 <div className="month">
                   <Form.Control
                     style={{
                       height: "80%",
                       width: "50%",
                       backgroundColor: "#1e1e1e",
                       border: "0",
                       color: "white",
                     }}
                     type="number"
                     onChange={(e) => {
                       setNumOfMonth(e.target.value);
                     }}
                   />
                   <p style={{ fontSize: "larger" }}>Month</p>
                 </div>
               </div>
               <div className="Price">
                 <p style={{ fontSize: "larger" }}>Total Price:</p>
                 <div className="num-price">
                   <Form.Control
                     style={{
                       height: "80%",
                       width: "50%",
                       backgroundColor: "#1e1e1e",
                       border: "0",
                       color: "white",
                     }}
                     type="number"
                     onChange={(e) => {
                       setPrice(e.target.value);
                     }}
                   />
                   <p style={{ fontSize: "x-large" }}>$</p>
                 </div>
               </div> 
               <div className="Save-Btn" >
                   <Button style={!onTheme ? {backgroundColor:"#A1E335"} : {backgroundColor:"#E333E5"}}
                     disabled={abeled}
                     onClick={() => {
                       createNewPlan("Lite");
                     }}
                   >
                     Save Changes
                   </Button>
                 </div>
             </div>
           </div>}
             {!arr.includes("Gold") &&
            <div className="Plan">
            <div className="Plan-Title">Gold Plan</div>
            <div className="inputs">
              <div className="Description-Input">
                <Form.Label>Description Plan Gold</Form.Label>
                <Form.Control
                  style={{
                    height: "100%",
                    backgroundColor: "#1e1e1e",
                    border: "0",
                    color: "white",
                  }}
                  as="textarea"
                  rows={3}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </div>
              <div className="Sub-Duration">
                <p
                  style={{
                    fontSize: "larger",
                    width: "70%",
                    textAlign: "left",
                  }}
                >
                  Subscription Duration:
                </p>
                <div className="month">
                  <Form.Control
                    style={{
                      height: "80%",
                      width: "50%",
                      backgroundColor: "#1e1e1e",
                      border: "0",
                      color: "white",
                    }}
                    type="number"
                    onChange={(e) => {
                      setNumOfMonth(e.target.value);
                    }}
                  />
                  <p style={{ fontSize: "larger" }}>Month</p>
                </div>
              </div>
              <div className="Price">
                <p style={{ fontSize: "larger" }}>Total Price:</p>
                <div className="num-price">
                  <Form.Control
                    style={{
                      height: "80%",
                      width: "50%",
                      backgroundColor: "#1e1e1e",
                      border: "0",
                      color: "white",
                    }}
                    type="number"
                    onChange={(e) => {
                      setPrice(e.target.value);
                    }}
                  />
                  <p style={{ fontSize: "x-large" }}>$</p>
                </div>
              </div> 
              <div className="Save-Btn" >
                  <Button style={!onTheme ? {backgroundColor:"#A1E335"} : {backgroundColor:"#E333E5"}}
                    disabled={abeled}
                    onClick={() => {
                      createNewPlan("Gold");
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
            </div>
          </div>}
             {!arr.includes("Premuim") &&
            <div className="Plan">
            <div className="Plan-Title">Premuim Plan</div>
            <div className="inputs">
              <div className="Description-Input">
                <Form.Label>Description Plan Premuim</Form.Label>
                <Form.Control
                  style={{
                    height: "100%",
                    backgroundColor: "#1e1e1e",
                    border: "0",
                    color: "white",
                  }}
                  as="textarea"
                  rows={3}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </div>
              <div className="Sub-Duration">
                <p
                  style={{
                    fontSize: "larger",
                    width: "70%",
                    textAlign: "left",
                  }}
                >
                  Subscription Duration:
                </p>
                <div className="month">
                  <Form.Control
                    style={{
                      height: "80%",
                      width: "50%",
                      backgroundColor: "#1e1e1e",
                      border: "0",
                      color: "white",
                    }}
                    type="number"
                    onChange={(e) => {
                      setNumOfMonth(e.target.value);
                    }}
                  />
                  <p style={{ fontSize: "larger" }}>Month</p>
                </div>
              </div>
              <div className="Price">
                <p style={{ fontSize: "larger" }}>Total Price:</p>
                <div className="num-price">
                  <Form.Control
                    style={{
                      height: "80%",
                      width: "50%",
                      backgroundColor: "#1e1e1e",
                      border: "0",
                      color: "white",
                    }}
                    type="number"
                    onChange={(e) => {
                      setPrice(e.target.value);
                    }}
                  />
                  <p style={{ fontSize: "x-large" }}>$</p>
                </div>
              </div> 
              <div className="Save-Btn" >
                  <Button style={!onTheme ? {backgroundColor:"#A1E335"} : {backgroundColor:"#E333E5"}}
                    disabled={abeled}
                    onClick={() => {
                      createNewPlan("Premuim");
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
            </div>
          </div>}
          {arr.map((ele, i) => (
            <div className="Plan">
              <CloseButton
              onClick={()=>{
                deletePlan(ele)
              }}
              title="Remove"
              style={{backgroundColor:"#464646" ,alignSelf:"end"}}
               />
              <div className="Plan-Title">{ele} Plan</div>
              <div className="inputs">
                <div className="Description-Input">
                  <Form.Label>Description Plan {ele}</Form.Label>
                  <Form.Control
                    style={{
                      height: "100%",
                      backgroundColor: "#1e1e1e",
                      border: "0",
                      color: "white",
                    }}
                    defaultValue={
                      plans[i]?.name === ele &&
                      plans[i]?.description &&
                      plans[i]?.description
                    }
                    as="textarea"
                    rows={3}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
                <div className="Sub-Duration">
                  <p
                    style={{
                      fontSize: "larger",
                      width: "70%",
                      textAlign: "left",
                    }}
                  >
                    Subscription Duration:
                  </p>
                  <div className="month">
                    <Form.Control
                      style={{
                        height: "80%",
                        width: "50%",
                        backgroundColor: "#1e1e1e",
                        border: "0",
                        color: "white",
                      }}
                      defaultValue={
                        plans[i]?.name === ele &&
                        plans[i]?.numofmonth &&
                        plans[i]?.numofmonth
                      }
                      type="number"
                      onChange={(e) => {
                        setNumOfMonth(e.target.value);
                      }}
                    />
                    <p style={{ fontSize: "larger" }}>Month</p>
                  </div>
                </div>
                <div className="Price">
                  <p style={{ fontSize: "larger" }}>Total Price:</p>
                  <div className="num-price">
                    <Form.Control
                      style={{
                        height: "80%",
                        width: "50%",
                        backgroundColor: "#1e1e1e",
                        border: "0",
                        color: "white",
                      }}
                      defaultValue={
                        plans[i]?.name === ele &&
                        plans[i]?.price &&
                        plans[i]?.price
                      }
                      type="number"
                      onChange={(e) => {
                        setPrice(e.target.value);
                      }}
                    />
                    <p style={{ fontSize: "x-large" }}>$</p>
                  </div>
                </div>
                  <div className="Save-Btn">
                    <Button style={!onTheme ? {backgroundColor:"#A1E335"} : {backgroundColor:"#E333E5"}}
                      disabled={(plans[i]?.name===ele ?(description===plans[i].description || numOfMonth===plans[i].numOfMonth || price===plans[i].price):false)}
                      onClick={() => {
                        updatePlan(ele);
                      }}
                    >
                      Save Changes
                    </Button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
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
  );
};

export default Settings;
