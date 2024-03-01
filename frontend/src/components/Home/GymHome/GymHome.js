import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import logoGym from '../../assets/image-gym.jpg';
import './style.css'
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
function GymHome() {
    const navigate = useNavigate();
    const [myGym, setMyGym] = useState([]);
    const [ownerGym, setOwnerGym] = useState(null);
    const userInfo = localStorage.getItem("userInfo");
    const covertUserInfoToJson = JSON.parse(userInfo);
    
    const state = useSelector((state)=>{
      return{
      userId : state.auth.userId,
      token : state.auth.token,
      role : state.auth.role
      }
    })

    const config = {
      headers: { Authorization: `Bearer ${state.token}` }
    }
    useEffect(()=>{
      if(!state.token){
        localStorage.clear();
            navigate('/login')
      }else{
        axios.get(`http://localhost:5000/gyms/owner/${state.userId}`,config).then((result) => {
          console.log(result);
          console.log("result", result);
          setOwnerGym(result.data.result); 
          console.log("State => ", state.role);
        }).catch((err) => {
          console.log(err);
        });
        axios.get(`http://localhost:5000/gyms/user/${state.userId}`, config).then((result) => {
          setMyGym(result.data.gyms);
        }).catch((err) => {
          if(err.response.data.message === "The token is invalid or expired"){
            localStorage.clear();
            navigate('/login')
          }
        });
      }

    },[])
    
    console.log(myGym);
    const generateGymBox = () => {
      const gymBoxes = [];
      {myGym.length !== 0 && myGym.map((e,i)=>{
        gymBoxes.push(
        <Col key={1}>
        <Card>
          <Card.Img variant="top" className='image-gym-in-card' src={e.image} />
          <Card.Body>
            <Card.Title style={{fontWeight:"bold"}}>{e.name}</Card.Title>
            <Card.Text className='text-card'>
              {e.description}
            </Card.Text>
            <button style={{width:"60%", border:"0", backgroundColor:"#101010",color: "white", borderRadius:"4px"}} onClick={()=>{
              navigate(`/gym/${e.gym_id}`);
            }}>Open</button>
          </Card.Body>
        </Card>
      </Col>
      );
      })
      }

      return <Row xs={1} md={5} className="g-2">{gymBoxes}</Row>
    };

    const generateGymOwner = () => {
      const gymOwner = [];
      
      {ownerGym && ownerGym.map((e,i)=>{
        gymOwner.push(
        <Col key={1}>
        <Card>
          <Card.Img variant="top" className='image-gym-in-card' src={e.image} />
          <Card.Body>
            <Card.Title style={{fontWeight:"bold"}}>{e.name}</Card.Title>
            <Card.Text className='text-card'>
              {e.description}
            </Card.Text>
            <button style={{width:"60%", border:"0", backgroundColor:"#101010",color: "white", borderRadius:"4px"}} onClick={()=>{
              navigate(`/gym/${e.id}`);
            }}>Open</button>
          </Card.Body>
        </Card>
      </Col>
      );
      
      })

      {ownerGym?.length < 3 && gymOwner.push(
        <Col key={1}>
        <Card style={{height:"100%"}}>
          <Card.Body style={{display:"flex", justifyContent:"center",alignItems:"center", flexDirection:"column"}}>
            <Card.Title style={{fontWeight:"bold"}}>Create Gym</Card.Title>
            <button style={{width:"60%", border:"0", padding:"5px",fontSize:"35px", backgroundColor:"#101010",color: "white", borderRadius:"4px"}} onClick={()=>{
              navigate(`/gym/create`);
            }}>+</button>
          </Card.Body>
        </Card>
      </Col>
      );
      }
      }

      return <Row xs={1} md={5} className="g-2">{gymOwner}</Row>
    };


  return (
    <div className='contenier-gyms-g'>
      { covertUserInfoToJson.role === 3 && 
        <>
        <div>
        <h5 style={{textAlign:"start", fontWeight:"bold", backgroundColor:"#303030", padding:"10px 10px"}}>Gym Created</h5>
        {generateGymOwner()}
        </div>
        </>
      }
      
      
      <div>
        <h5 style={{textAlign:"start", fontWeight:"bold", backgroundColor:"#303030", padding:"10px 10px"}}>Gym Joined</h5>
        {myGym.length ?  generateGymBox() : <h6 style={{marginTop:"10px", color:"#808080"}}>You are not joined to any gym, please select all gym and choose one</h6>}
      </div>
      
    </div>
  )
}

export default GymHome
