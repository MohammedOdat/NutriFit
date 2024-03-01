import React from 'react'
import "./style.css";
import homeLandingImage from '../../assets/home-landing.png';
import { useNavigate } from 'react-router-dom';
function HomeLanding() {
  const navigate=useNavigate()
  return (

    <div id='home' className='home-landing'>
      <div className='container-title-hone-landing'>
        <p className='title-home-landing'>Build your <a style={{color :"#A1E533"}}>BODY</a> and health with top trainers for ultimate fitness and <a style={{color :"#A1E533"}}>STRENGTH</a>!</p>
        <p style={{textAlign:"start", fontSize:"16px", marginTop:"0"}}>Sport is part of health, So be diligent in exercising so that the body becomes stronger and healthier to improve health and keep away from injury</p>
        <button className='join-now' onClick={()=>{
          navigate("/register")
        }}>Join Now</button>
      </div>
      <div className='container-image-hone-landing'>
        <img className='image-home-landing' src={homeLandingImage}/>
      </div>
    </div>
  )
}

export default HomeLanding