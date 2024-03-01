import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserId } from "../Redux/Reducers/Auth/index";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import "./Profile.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setImageUser } from '../Redux/Reducers/Auth';
import Spinner from 'react-bootstrap/Spinner';
import logo from '../assets/user.png'
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef=useRef(null)
  const [image, setImage] = useState("");
  const [userinfo, setUserInfo] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [status, setStatus] = useState(false);
  const [goal, setGoal] = useState('');
  const [onTheme, setOnTheme] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
  useEffect(() => {
    getUserInfoByUserId();
  }, []);
  const getUserInfoByUserId = () => {
    axios
      .get(`http://localhost:5000/users/info/${state.userId}`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      })
      .then((result) => {
        setUserInfo(result.data.info);
        setMessage(result.data.message);
      })
      .catch((error) => {
        setMessage(error.result.data);
      });
  };

  const updateUserInfo = async () => {
    try {
      const result =await axios.put(`http://localhost:5000/users/info/${state.userId}`, {
        image ,
        weight,
        height,
        goal

      },
      {headers: {
        Authorization: `Bearer ${state.token}`,
      }});
      localStorage.setItem("userImage", image);

      setUserInfo({...userinfo,...result})
      navigate(-1);
      dispatch(setImageUser(image));
    } catch (error) {
    }
  };

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
          setLoading(false);
      }).catch((err) => {
        setLoading(false)
      });
  };
  const handleImageClick = () => {
    fileInputRef.current.click();
};
  return (
    <div className="profile">
      <div className="prifile-title">
                <h1 style={{ border: "0" ,}}>profile Info</h1>
              </div>
      {userinfo && (
        <div className="profile_form">
              
          <div className="profile_img" style={{position:"relative"}}>
          <img src={image?image: userinfo.image ? userinfo.image : logo}   style={{width:"256px",height:"256px",borderRadius:"128px"}}
           onClick={handleImageClick}/>
          <input
                type='file'
                accept='image/jpeg, image/jpg'
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e)=>{
                  uploadImage(e)
                  setLoading(true)}}
            />

            <Spinner animation="border" role="status" style={loading ? {position:"absolute", width:"124px", height:"124px", top:"25%"} : {display: "none"}}></Spinner>
          </div>
           <Form style={{width:"50%"}}>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridEmail" style={{textAlign:"start"}}  >
          <Form.Label style={{color:"white",fontSize:"18px"}}>First Name:</Form.Label>
          
          <Form.Control type="text" placeholder="first name" value={userinfo.firstname}style={{  border: "0",backgroundColor:"#101010", color: "white"}} />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridPassword" style={{textAlign:"start"}}>
          <Form.Label style={{color:"white",fontSize:"18px"}}>Last Name:</Form.Label>
          <Form.Control type="text" placeholder="last name"  value={userinfo.lastname}   style={{ border: "0", backgroundColor:"#101010", color: "white"}} />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="formGridAddress1" style={{textAlign:"start"}}>
        <Form.Label style={{color:"white",fontSize:"18px"}}>email:</Form.Label>
        <Form.Control placeholder="email"  value={userinfo.email}  style={{ border: "0",backgroundColor:"#101010", color: "white"}} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGridAddress2" style={{textAlign:"start"}}>
        <Form.Label style={{color:"white",fontSize:"18px"}}>your goals:</Form.Label>
        <Form.Control defaultValue={userinfo.goal}    onChange={(e)=>{
            setGoal(e.target.value)
          }}  style={{  border: "0",backgroundColor:"#101010", color: "white"}}/>
      </Form.Group>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridCity" style={{textAlign:"start"}}>
          <Form.Label style={{color:"white",fontSize:"18px"}}>height:</Form.Label>
          <Form.Control  defaultValue={userinfo.height} type="number"   onChange={(e)=>{
            setHeight(e.target.value)
          }} style={{border: "0",backgroundColor:"#101010", color: "white"}}/>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridZip" style={{textAlign:"start"}}>
          <Form.Label style={{color:"white",fontSize:"18px"}}>weight:</Form.Label>
          <Form.Control  defaultValue={userinfo.weight} type="number"  onChange={(e)=>{
            setWeight(e.target.value)
          }}  style={{border: "0",backgroundColor:"#101010", color: "white"}}/>
        </Form.Group>
      </Row>

       

      <Button style={
          !onTheme?{backgroundColor:"#A1E335",border:"0", color:"black",fontWeight:"bold"}:{backgroundColor:"#E333E5",border:"0", color:"black",fontWeight:"bold"}}  type="submit" onClick={(e)=>{
        e.preventDefault()
        updateUserInfo()
      }}>
        Save Change
      </Button>
    </Form>


        </div>
      )}

    
    </div>
  );
};

export default Profile;

