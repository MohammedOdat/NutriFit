import React, { useEffect, useState } from 'react';
import './style.css';
import Pagination from 'react-bootstrap/Pagination';
import GymHome from './GymHome/GymHome';

import PrivateHome from './PrivateHome/PrivateHome';
import { useDispatch, useSelector } from "react-redux";
import AllGymHome from './AllGymHome/AllGymHome';
import CoachPrivate from './CoachPrivate/CoachPrivate';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Home() {
  const {token,userId} = useSelector((state) => {
    return {
      userId: state.auth.userId,
      token: state.auth.token,
    };
  });
  const navigate=useNavigate()

  const [onTheme, setOnTheme] = useState(false);
  const state = useSelector((state)=>{
  return{
      isLoggedIn : state.auth.isLoggedIn,
      role:state.auth.role,
      theme : state.auth.theme
    }
  });

  useEffect(()=>{
    if(state.theme === "female"){
      setOnTheme(true);
    }else{
      setOnTheme(false);
    }
  },[state.theme]);

  const userInfo = localStorage.getItem("userInfo");
  const covertUserInfoToJson = JSON.parse(userInfo);
  const [selected , setSelected] = useState('gym');
  const items = [];


  const [PageNumber, setPageNumber] = useState(1); 
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
useEffect(()=>{
  axios.get(`http://localhost:5000/users/info/${userId}`,config).then((result)=>{
    if(!result.data.success){
      console.log(result);
      navigate('/userinfo')
    }

  }).catch((err)=>{
    console.log(err);
  })
},[])

  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} linkStyle={PageNumber === number ? {backgroundColor:"#A1E533", border:"0", color:"#101010"} : {backgroundColor:"#404040",border:"0", color:"white"}}  active={number === PageNumber} onClick={()=>{
        setPageNumber(number);
      }}>
        {number}
      </Pagination.Item>
    );
  }
  return (
    <div className='contener-home'>
      <div>
        <ul className='contener-navbar-home'>
            <li className={selected === "gym" ? "nav-home gyms-selected": "nav-home gyms"} style={selected === 'gym' ? !onTheme ? {backgroundColor:"#A1E553"}: {backgroundColor:"#E333E5"} : {backgroundColor:"#404040"}}  onClick={()=>{
              setSelected("gym")
            }}>My Gyms</li>
            <li className={selected === "private" ? "nav-home private-selected" : "nav-home private"} style={selected === 'private' ? !onTheme ? {backgroundColor:"#A1E553"}: {backgroundColor:"#E333E5"} : {backgroundColor:"#404040"}} onClick={()=>{
              setSelected("private")
            }}>Private</li>
            <li className={selected === "allgym" ? "nav-home all-gyms-selected" : "nav-home all-gyms"} style={selected === 'allgym' ? !onTheme ? {backgroundColor:"#A1E553"}: {backgroundColor:"#E333E5"} : {backgroundColor:"#404040"}} onClick={()=>{
              setSelected("allgym")
            }}>All Gyms</li>
        </ul>
      </div>

      <div className='contener-gym-viewer'>
        {selected == 'gym' && <GymHome/>}
        {selected == 'private' && (covertUserInfoToJson.role===3?navigate("/coach/private"):covertUserInfoToJson.role===2&& <PrivateHome/>)}
        {selected == 'allgym' && <AllGymHome/>}
      </div>
      
    </div>
  )
}

export default Home
