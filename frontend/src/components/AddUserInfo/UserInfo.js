import React, { useRef } from 'react'
import "./UserInfo.css"
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImageUser } from '../Redux/Reducers/Auth';
import logo from "../assets/user.png"
import { useNavigate } from 'react-router-dom';
const UserInfo  = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate()
    const fileInputRef=useRef(null)
    const [image, setImage] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [success, setSuccess] = useState(null);
    const [message, setMessage] = useState("")
    const [goal, setGoal] = useState('')
    const [onTheme, setOnTheme] = useState(false);
  const state = useSelector((state) => {
    return {
      userId: state.auth.userId,
      token: state.auth.token,
      theme : state.auth.theme
    };
  });
  useEffect(()=>{
    if(state.theme === "female"){
      setOnTheme(true);
    }else{
      setOnTheme(false);
    }
  },[state.theme]);
  const uploadImage = async(e) => {
    const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'yk50quwt');
      formData.append("cloud_name", "dorpys3di");
      await fetch('https://api.cloudinary.com/v1_1/dvztsuedi/image/upload', {
        method: 'post',
        body: formData,
      }).then((result)=> result.json()).then((data) => {
          setImage(data.url);
          setSuccess(true)
      }).catch((err) => {
      console.log(err);
      });
  };
  const handleImageClick = () => {
    fileInputRef.current.click();
};
const createUserInfo =async()=>{
  if(weight&&height&&goal){
    try {
        const result =await axios.post(`http://localhost:5000/users/info/create`, 

        {

          image , 
          weight,
          height,
          goal
        },
        {headers: {
          Authorization: `Bearer ${state.token}`,
        }});
        navigate('/home')
        localStorage.setItem("userImage", image);
        dispatch(setImageUser(image));
      } catch (error) {
        setSuccess(false)
        setMessage(error.response.data.message)
        console.log(error);
      }
    }else{
setSuccess(false)
setMessage("Please Fill All Field")
    }
  }
  return (
    <div className='user_info'>
        <div className='userinfo_form'>
    <Stack gap={3}>
        
      
      <h1 className="Title" style={{fontFamily:'-moz-initial',margin:"0"}}>Extra Information</h1>
      <div className='a'>
         <div className="profile_img">
          <img src={image?image:logo}   style={{width:"256px",height:"256px",borderRadius:"128px"}}
           onClick={handleImageClick}/>
          <input
                type='file'
                accept='image/jpeg, image/jpg'
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={uploadImage}
            />
          </div>
        <div className="height-width">
          <div className="height">
            <Form.Label>Height:</Form.Label>
            <Form.Control onChange={(e)=>{
              setHeight(e.target.value)
            }}
            
              type="number"
              style={{
                backgroundColor: "#1e1e1e",
                border: "0",
                color: "white",
              }}
            />
          </div>
          <div className="weight">
            <Form.Label>Weight:</Form.Label>
            <Form.Control onChange={(e)=>{
setWeight(e.target.value)
            }}
              type="number"
              style={{
                backgroundColor: "#1e1e1e",
                border: "0",
                color: "white",
              }}
            />
          </div>
        </div>
        <div className="goal">
          <Form.Label> Your Goal:</Form.Label>
          <Form.Control onChange={(e)=>{
            setGoal(e.target.value)
          }}
            type="text"
            style={{ backgroundColor: "#1e1e1e", border: "0", color: "white" }}
          />
        </div>
        <div className="submit-Btn">
          <Button style={
          !onTheme?{backgroundColor:"#A1E335"}:{backgroundColor:"#E333E5"}} onClick={()=>{
            createUserInfo()
          }} >Next</Button>
        </div></div>

        <div
        className={
          success ? message && "SuccessMessage" : message && "ErrorMessage"
        }
        style={{ padding: "5px" }}
      >
        <span style={{ visibility: "hidden" }}>:</span>
        {message}
      </div>
        
    </Stack>
        
        </div>
        
    </div>
  )
}

export default UserInfo 
