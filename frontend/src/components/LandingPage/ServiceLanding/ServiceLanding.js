import React from 'react'
import './style.css'
import hand from '../../assets/hand.png';
import { useNavigate } from 'react-router-dom';
function ServiceLanding() {
  const navigate = useNavigate();
  return (
    <div className='service-landing'>

      <div className='container-service-landing'>
        <div className='container-service-title' style={{textAlign:"center"}}>
          THIS IS OUR SERVICES
        </div>
        <div className='container-service-card'>
          <img src= {hand} style={{transform: "rotateY(180deg)"}}/>
          <div className='card-service' style={{borderRadius:"15px  0px 0px 15px"}}>
            <div className='title-card'>Food Recipes</div>
            <div className='desc-card'>Offers healthy and delicious cooking recipes, Specially designed for athletes and sports enthusiasts. Discover balanced meals that contain the Calories, Protein, and Vitamins you need to achieve peak athletic performance.</div>
            <div className='container-button-card'>
            <button className='btn-card' onClick={()=>{
              navigate("/register");
            }}>Show Recipes</button>
            </div>
          </div>
          <div className='card-service' style={{borderRadius:"0"}}>
            <div className='title-card'>Online Gym</div>
            <div className='desc-card'>Online gyms offer convenient access to fitness routines, personalized training, and a supportive community, empowering individuals to achieve their health and wellness goals from the comfort of their own homes.</div>
            <div className='container-button-card'>
            <button className='btn-card' onClick={()=>{
              navigate("/register");
            }}>Join To Gym</button>
            </div>
            
          </div>
          <div className='card-service' style={{borderRadius:" 0px  15px 15px 0px"}}>
            <div className='title-card'>Private Coach</div>
            <div className='desc-card'>Private coaches provide personalized guidance, tailored workout plans, and expert support to help individuals reach their fitness goals efficiently and effectively, fostering accountability and motivation along the way.</div>
            <div className='container-button-card'>
            <button className='btn-card' onClick={()=>{
              navigate("/register");
            }}>Chat the coach</button>
            </div>
          </div>
          <img src= {hand}/>
          {/* <div className='card-service'>
            <div className='title-card'>----</div>
              <div className='desc-card'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
              <div className='container-button-card'>
            <button className='btn-card'>Join To Gym</button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default ServiceLanding