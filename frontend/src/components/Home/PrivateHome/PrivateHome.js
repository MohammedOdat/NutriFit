import React from "react";
import "./style.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import{useNavigate}from 'react-router-dom'
import axios from "axios";
import {setLogin,setUserId, setLogout } from '../../Redux/Reducers/Auth/index'
import Spinner from "react-bootstrap/Spinner";

import logo from "../../assets/user.png"
import Button from "react-bootstrap/Button";

const PrivateHome = () => {
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);
  const [selected, setSelected] = useState("private");
  const [myCoachs, setMyCoachs] = useState([])
  const [coaches, setCoaches] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const [coachLoading, setCoachLoading] = useState(true);
  const [onTheme, setOnTheme] = useState(false);
  useEffect(()=>{
    if(authState.theme === "female"){
      setOnTheme(true);
    }else{
      setOnTheme(false);
    }
  },[authState.theme]);
  useEffect(() => {
    getAllCoaches();
    getAllCoachesByUserId()
  }, []);
const getAllCoachesByUserId =()=>{
  setUserLoading(true)
  axios.get(`http://localhost:5000/coachs/coach`, {
    headers: {
      Authorization: `Bearer ${authState.token}`,
    },
  }).then((result)=>{
    setUserLoading(false)
    console.log(result);
    setMyCoachs(result.data.coachs)
  }).catch((error)=>{
    console.log(error);
    setUserLoading(false)

  })
}

  const getAllCoaches = () => {
    setCoachLoading(true)
    axios.get("http://localhost:5000/coachs/filter/", {
      headers: {
        Authorization: `Bearer ${authState.token}`,
      },
    })
    .then((response) => {
      setCoachLoading(false)
      setCoaches(response.data.coachs);
    })
    .catch((error) => {
      console.log(error);
      setCoachLoading(false)
      setMessage("Error fetching coaches.");
    });
  };
  console.log(coaches);
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };



  const SearchBar = ({data}) => {
    const [search, setSearch] = useState("");
    const myArray = ["Apple", "banana",'tomato' ,'banana'];
    const handleSearch = (e) => {
      setSearch(e.target.value);
    };

    const filteredData = coaches?.filter((item) =>
       item.firstname.toLowerCase().includes(search.toLowerCase())
    );
    console.log(filteredData);
    return (
      <div className="page">
        <div className="ser">
          <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search..."
          className="search_bar-input"
        />  
        </div>
        <div  style={
          !onTheme?{color:"#A1E335",textAlign:"left"}:{color:"#E333E5",textAlign:"left"}}><h5>My Coachs</h5><hr style={
            !onTheme?{color:"#A1E335",width:"100%",margin:"0"}:{color:"#E333E5",width:"100%",margin:"0"}}/></div>
        {userLoading ? (
              <div
                style={
                  userLoading
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
            ) :<div className="My-coachs">
          
          {myCoachs?.map((item) => (
              <div className="coach_bar">
                <div className="coach_info"> 
                <img style={{width:"64px",height:"64px", borderRadius:"32px"}} src={item.image?item.image:logo}/>
                  <div>
                    <span>{item.firstname}  <span>{item.lastname}</span></span>
                   
                    
                  </div>
                    
                    
                    
                    </div>
                    
                
                <div className="coach_btn">
                 
                  <button  
                   style={
                    !onTheme?{backgroundColor:"#A1E335"}:{backgroundColor:"#E333E5"}}
                  onClick={()=>{
                    navigate("/user/private")
                  }}
                  className="join-private-btn">
                    OPEN
                      </button>
                  
                
                </div>

             
              </div>
            ))}
        </div>}
        
        <div style={
          !onTheme?{color:"#A1E335",textAlign:"left"}:{color:"#E333E5",textAlign:"left"}}><h5>All Coachs</h5><hr  style={
            !onTheme?{color:"#A1E335",width:"100%",margin:"0"}:{color:"#E333E5",width:"100%",margin:"0"}} /></div>
        {coachLoading ? (
              <div
                style={
                  coachLoading
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
            ):  <div className="coachs">

            {filteredData?.map((item) => (
              <div className="coach_bar">
                <div className="coach_info"> 
                  <img style={{width:"64px",height:"64px", borderRadius:"32px"}} src={item.image?item.image:logo}/>
                  <div>
                    <span>{item.firstname} <span>{item.lastname}</span></span>
                    
                    
                  </div>
                    
                    
                    
                    </div>
                    
                
                <div className="coach_btn">
                  <button 
                   style={
                    !onTheme?{backgroundColor:"#A1E335"}:{backgroundColor:"#E333E5"}}
                  onClick={()=>{
                    navigate(`/${item.id}/private/plan`)
                    
                  }}
                  className="join-private-btn">
                    JOIN
                      </button>
                  
                
                </div>

             
              </div>
            ))}
          </div>}
      
      </div>
    );
  };
  

  return (
      <div className="search_bar">
        <SearchBar />
      </div>
  );
};

export default PrivateHome;