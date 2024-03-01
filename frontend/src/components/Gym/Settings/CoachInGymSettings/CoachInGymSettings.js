import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import logo from "../../../assets/user.png"
function CoachInGymSettings() {
  const [coachsInGym, setCoachInGym] = useState(null);
  const [indexUserInArr,setIndexUserInArr] = useState(null);

  console.log(coachsInGym);
  const {gymid} = useParams();

  const [onTheme, setOnTheme] = useState(false);
  const state = useSelector((state)=>{
    return{
    userId : state.auth.userId,
    token : state.auth.token,
    theme : state.auth.theme,
    }
  })

  const config = {
    headers: { Authorization: `Bearer ${state.token}` }
  }

  useEffect(()=>{
    axios.get(`http://localhost:5000/gyms/${gymid}/coach`, config).then((result) => {
      setCoachInGym(result.data.coachs);
    }).catch((err) => {
      
    });
  },[]);
  useEffect(()=>{
    if(state.theme === "female"){
      setOnTheme(true);
    }else{
      setOnTheme(false);
    }
  },[state.theme]);
  const viewUserInList = () => {
    const userArray = [];
  
    for (let i = 0; i < coachsInGym?.length; i++) {
      userArray.push(
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px" ,height:"fit-content"}}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <h6 style={{ paddingRight: "10px" }}>{i + 1}</h6>
            <img style={{ width: "52px", height: "52px", borderRadius: "32px" }} src={coachsInGym[i].image?coachsInGym[i].image:logo} alt={`Avatar ${i + 1}`} />
            <h5>{coachsInGym[i].firstname} {coachsInGym[i].lastname}</h5>
          </div>
         <button className='btn-user' style={!onTheme ? {backgroundColor:"#A1E553"} : {backgroundColor:"#E333E5"}} onClick={()=>{
          setIndexUserInArr(i);
          handleShow()
         }}>Down To User</button>
        </div>
        
      );
  
      if (i + 1 < 50) {
        userArray.push(
          <div key={`divider-${i}`} style={{ padding: "0 10px", width: "100%", borderBottom: "1px solid #404040" }}></div>
        );
      }
    }
    return userArray;
  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div style={{display:"flex", justifyContent:"center", flexDirection:"column", width:"100%",placeItems:"center",padding:"10px"}}>
      <div className='member-in-gym-settings'>
        
        <p>{coachsInGym?.length}/3 Coach</p>
      </div>
      <input style={{width:"50%", padding:"5px", borderRadius:"4px", border:"0", color:"white", backgroundColor:"#404040"}} placeholder='Search...'/>
      {viewUserInList()}
    
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Role  {coachsInGym && coachsInGym[indexUserInArr]?.firstname} To User</Modal.Title>
        </Modal.Header>
        <Modal.Body>you are sure? please choose the plan</Modal.Body>
        <Modal.Footer>
          <Button style={{backgroundColor:"gray", color:"white",fontWeight:"bold", border:"0"}} onClick={()=>{
            axios.post(`http://localhost:5000/gyms/coach/down`, { gymid , userid : coachsInGym[indexUserInArr].id, name_plan : "Lite"}, config).then((result) => {
              coachsInGym.splice(indexUserInArr, 1);
              handleClose()
            }).catch((err) => {
              console.log(err);
            });
          }}>
            Lite
          </Button>
          <Button style={{backgroundColor:"gold", color:"#101010",fontWeight:"bold", border:"0"}} onClick={()=>{
            axios.post(`http://localhost:5000/gyms/coach/down`, { gymid , userid : coachsInGym[indexUserInArr].id, name_plan : "Gold"}, config).then((result) => {
              coachsInGym.splice(indexUserInArr, 1);
              handleClose()
            }).catch((err) => {
              console.log(err);
            });
          }}>
            Gold
          </Button>
          <Button style={{backgroundColor:"#A1E533", color:"#101010",fontWeight:"bold",border:"0"}} onClick={()=>{
            axios.post(`http://localhost:5000/gyms/coach/down`, { gymid , userid : coachsInGym[indexUserInArr].id, name_plan : "Premium"}, config).then((result) => {
              coachsInGym.splice(indexUserInArr, 1);
              handleClose()
            }).catch((err) => {
              console.log(err);
            });
          }}>
            Premium
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default CoachInGymSettings
