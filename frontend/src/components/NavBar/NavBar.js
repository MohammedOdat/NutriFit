import React, { useEffect, useState } from 'react'
import './style.css'
import { useDispatch, useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { setLogout } from '../Redux/Reducers/Auth';
import logo from "../assets/nitri.png"
import logo2 from "../assets/nitripink.png"
import logo3 from "../assets/user.png"
import axios from 'axios';
function NavBar() {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem("userInfo");
  const covertUserInfoToJson = JSON.parse(userInfo);
  const [userImage, setUserImage] = useState(localStorage.getItem("userImage") || null);
  const dispatch = useDispatch();

  const [onTheme, setOnTheme] = useState(false);
  const state = useSelector((state)=>{
  return{
      isLoggedIn : state.auth.isLoggedIn,
      role:state.auth.role,
      theme : state.auth.theme,
      userId : state.auth.userId,
      token : state.auth.token,
      userImage : state.auth.image
    }
  });

  useEffect(()=>{
    if(state.theme === "female"){
      setOnTheme(true);
    }else{
      setOnTheme(false);
    }
  },[state.theme]);

  const config = {
    headers: { Authorization: `Bearer ${state.token}` }
  }
  useEffect(()=>{
    axios.get(`http://localhost:5000/users/info/${state.userId}`, config).then((result) => {
      localStorage.setItem("userImage", result.data.info.image);
    }).catch((err) => {
    });
  },[state.userImage]);
  
  return (
    <div className='nav-bar' style={!onTheme ? {borderBottom:"1px solid #A1E533"} : {borderBottom:"1px solid #e333e5"}}>
        <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
          <img style={{width:"47px",height:"47px",cursor:"pointer"}} src={!onTheme?logo:logo2} onClick={()=>{
            navigate('/')
          }}/>
            <h2 style={{fontWeight:"bold",margin:"0"}}><a href='/' style={{textDecoration:"none", color:"white"}}>NUTRI <span style={!onTheme?{color:"#A1E533"} : {color:"#e333e5"}}>FIT</span></a></h2>
        </div>
        <div style={{ display:"flex", justifyContent:"center"}}>
          {state.isLoggedIn ?
            <ul className="navbar-lu">
                <li className='nav-map' onClick={()=>{
                  navigate("/recipe")
                }}>Recipes</li>
                <li className='nav-map' onClick={()=>{
                  navigate("/home")
                }}>Dashboard</li>
                <li className='nav-map end' onClick={()=>{
                  navigate('/profile')
                }}>Settings</li>
            </ul>
            :
            <ul className="navbar-lu">
                <li className='nav-map' onClick={()=>{
                  navigate('/')
                }}>Home</li>
                <li className='nav-map' onClick={()=>{
                  navigate('/')
                }} >Service</li>
                <li className='nav-map' onClick={()=>{
                  navigate('/')
                }}>About</li>
                <li className='nav-map end'onClick={()=>{
                  navigate('/')
                }} >Contact</li>
            </ul>
          }
        </div>

        <div style={{textAlign:"end"}}>
          {state.isLoggedIn? 
          <div style={{display:"flex" , gap:"10px"}}>
            <ul style={{listStyle: "none", margin :"0", display:"flex", justifyContent:"center", alignItems:"center", gap:"5px", padding:"0"}}>
            <img style={{width:"48px",height:"48px", borderRadius:"24px"}} src={state.userImage ? state.userImage : logo3}/>
            <div>
              <ul style={{textAlign:"start", listStyle: "none",padding:"0"}}>
                <li>{covertUserInfoToJson && covertUserInfoToJson.nameUser}</li>
                <li style={{fontSize:"10px"}}>{covertUserInfoToJson?.role === 3 && "<COACH>" || covertUserInfoToJson?.role === 2 && "<USER>"}</li>
              </ul>
            </div>
            </ul>
            <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            <button style={{border:"0", borderRadius:"4px", fontWeight:"bold", backgroundColor:"rgb(255,100,100)"}} onClick={()=>{
              localStorage.clear();
              dispatch(setLogout());
              navigate('/login');
            }}>Logout</button>
            </div>
            </div>
            : 
            <button className='button' style={!onTheme ? {backgroundColor:"#A1E553"} : {backgroundColor:"#e333e5"}} onClick={()=>{
              navigate('/login')
            }}>Login</button>
            }
        </div>
    </div>
  )
}

export default NavBar
