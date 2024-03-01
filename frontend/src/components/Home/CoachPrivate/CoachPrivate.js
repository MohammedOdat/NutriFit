import React, { useEffect, useRef, useState } from "react";
import "./CoachPrivate.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import socketInit from '../../Gym/socket.server';
import { setUsers } from "../../Redux/Reducers/CoachPrivate/index";
const CoachPrivate = () => {
  const revarse = useRef(null);
  if (revarse.current) {
    revarse.current.scrollTop = revarse.current.scrollHeight;
  }
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, userId, users } = useSelector((state) => {
    return {
      token: state.auth.token,
      userId: state.auth.userId,
      users: state.coachPrivate.users,
    };
  });
  const userInfo = localStorage.getItem("userInfo");
  const covertUserInfoToJson = JSON.parse(userInfo);
  const [userLoading,setUserLoading] = useState(true);
  const [start, setStart] = useState(false)
  const [show, setshow] = useState(true);
  const [header, setHeader] = useState("");
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState("");
  const [filtered, setFiltered] = useState([]);
// -----------------------------------------------------
const [image, setImage] = useState("")
const [toId , setToId] = useState(null);
const [from , setFrom] = useState("");
const [clearInput, setClearInput] = useState("");
const [inputMessage , setInputMessage] = useState("");
const [socket, setSocket] = useState(null);
const [allMessages, setAllMessages] = useState([]);

const [imageMessage , setImageMessage] = useState(null);
const [onTheme, setOnTheme] = useState(false);
const [messageLoading,setMessageLoading] = useState(false)
const fileInputRef = useRef(null);

const state = useSelector((state)=>{
  return{
      token : state.auth.token,
      isLoggedIn : state.auth.isLoggedIn,
      role:state.auth.role,
      theme : state.auth.theme,
      userId : state.auth.userId
    }
  });
useEffect(()=>{
    
  if (revarse.current) {
    revarse.current.scrollTop = revarse.current.scrollHeight;
  }
 },[allMessages?.length]);


 const uploadImage = async(e) => {
  setMessageLoading(true)
const file = e.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'yk50quwt');
  formData.append("cloud_name", "dorpys3di");
  await fetch('https://api.cloudinary.com/v1_1/dvztsuedi/image/upload', {
    method: 'post',
    body: formData,
  }).then((result)=> result.json()).then((data) => {
      setMessageLoading(false);
      setImageMessage(data.url);
      
  }).catch((err) => {
  console.log(err);
  });
};

const handleImageClick = () => {
      fileInputRef.current.click();
};


useEffect(()=>{
  setAllMessages([])
  axios.get(`http://localhost:5000/coachs/message/${userId}/${toId}`,{headers:{
    Authorization:`Bearer ${token}`
  }}).then((result)=>{
    setAllMessages(result.data.messages)
  }).catch((error)=>{
    console.log(error);
  })
},[toId])

useEffect(()=>{
  if(state.theme === "female"){
    setOnTheme(true);
  }else{
    setOnTheme(false);
  }
},[state.theme]);


useEffect(()=>{
  axios.get(`http://localhost:5000/users/info/${userId}`,{headers:{
    Authorization:`Bearer ${token}`
  }}).then((result)=>{
    setImage(result.data.info.image)
  }).catch((error)=>{
    console.log(error);
  })
},[])
useEffect(()=>{
  socket?.on('connect', ()=>{
      console.log(true)
  })
 
  return()=>{
      socket?.close();
      socket?.removeAllListeners();
  }
},[socket]);


useEffect(()=>{
  socket?.on("messagePrivate", reviMessage);
  return()=>{
      socket?.off("messagePrivate", reviMessage)
  }
},[allMessages]);


const reviMessage = (data)=>{
  console.log(data);
  setAllMessages(prevMessages => [...prevMessages, data]);

};


const sendMessage = ()=>{
  socket?.emit("messagePrivate", {room :toId, from : userId, message:inputMessage,name:covertUserInfoToJson.nameUser,image, image_message : imageMessage, created_at : new Date() });
}

const disconnectServer = ()=>{
  socket?.disconnect();      
}




  const removeUserFromPrivate = (user_id, coach_id) => {
    axios
      .put(
        `http://localhost:5000/coachs/user/remove`,
        { user_id: user_id, coach_id: coach_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllUsers = () => {
    axios
      .get(`http://localhost:5000/coachs/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log(result.data.success);
        if (result.data.success) {
          result.data.users.map((ele, i) => {
            if (new Date() >= new Date(ele.endsub)) {
              removeUserFromPrivate(ele.user_id, ele.coach_id);
            }
          });
          const newUserArr = result.data.users.filter(
            (ele, i) => new Date() < new Date(ele.endsub)
          );
          dispatch(setUsers(newUserArr));
          setFiltered(newUserArr);
          setSuccess(result.data.success);
          setUserLoading(false)
        } else {
          setSuccess(result.data.success);
          setMessage(result.data.message);
          setUserLoading(false)
        }
      })
      .catch((error) => {
        setSuccess(false);
          setUserLoading(false)
          setMessage(error.response.data.message);
      });
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  const userFiltration = (e) => {
    if (e !== "All") {
      const filteredUsers = users.filter((ele, i) => ele.name === e);
      setFiltered(filteredUsers);
    } else {
      setFiltered(users);
    }
  };
  const timeOfMessage=(end)=>{
    const endDate = new Date(end);
    const now = new Date();
    const difference = now - endDate;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor(difference / (1000 * 60));
    const seconds = Math.floor(difference / 1000);
    let dateNow = '';
    if(days){
        dateNow = `${days} days ago`;
    }else if(hours){
        dateNow = `${hours} hour ago`;
    }else if(minutes){
        dateNow = `${minutes} minutes ago`;
    }else if(seconds){
        dateNow = `just now`;
    }else{
        dateNow = `just now`;
    }
    return dateNow
}
  return (
    <>
      {" "}
      <div className="Coach-Private-Page">
        {show && (
          <div className="Left-Side">
            <div className="User-Filter">
              <Form.Select
                onChange={(e) => {
                  userFiltration(e.target.value);
                }}
                style={{
                  alignSelf: "center",
                  width: "100%",
                  paddingLeft: "5px",
                  backgroundColor: "#3d3939",
                  color: "white",
                  border:"0",
                  borderRadius:"4px"
                }}
                aria-label="Default select example"
              >
                <option value="All">All Users</option>
                <option value="Lite">Lite Users</option>
                <option value="Gold">Gold Users</option>
                <option value="Premuim">Premuim Users</option>
              </Form.Select>
            </div>
            {userLoading? <div style={userLoading ? {height:"100%",display:"flex",flexDirection:"column", placeItems:"center",justifyContent:"center"} : {display:"none"}} >
                <Spinner animation="border" style={!onTheme ? {color:"#A1E533"} : {color:"#E333E5"}}   />
                <label>Loading...</label>
                </div>: success ? (
              <div className="User-List">
                {filtered.map((user, i) => (
                  <><div
                  className="User-Name"
                  style={header===`${user.firstname} ${user.lastname}`? !onTheme ? {backgroundColor:"#A1E553",color:"#101010"} : {backgroundColor:"#E333E5",color:"#101010"}:{backgroundColor:"transparent"}}
                  onClick={() => {
                    setToId(user.user_id)
                    setSocket(socketInit({user_id : userId, token :token, room :user.user_id }));
                    setHeader(`${user.firstname} ${user.lastname}`);
                    setStart(true)
                  }}
                >
                  <>
                    {user.name === "Lite"
                      ? "🐱"
                      : user.name === "Gold"
                      ? "🦁"
                      : user.name === "Premuim" && "👑"}
                  </>{" "}
                  {user.firstname} {user.lastname}
                </div>
                <hr style={{width:"90%",margin:"10px"}}/></>
                ))}
              </div>
            ) : (
              <span
                style={{
                  backgroundColor: "red",
                  width: "90%",
                  fontSize: "x-large",
                  borderRadius: "8px",
                }}
              >
                {message}
              </span>
            )}

            <div className="My-Private">
              <div className="img-title">
                <div className="Private-img">
                <img src={image&&image
                }  style={{width:"52px", height:"52px", borderRadius:"26px"}}/>
                </div>
                <div className="Private-Title">{covertUserInfoToJson.nameUser}</div>
               
              </div>
               <svg
                  onClick={() => {
                    navigate("setting");
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  class="bi bi-gear"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                  <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
                </svg>
            </div>
          </div>
        )}
        <div
          className="Right-Side"
          style={show ? { width: "80%" } : { width: "100%" }}
        >
          <div
            style={
              header?{
                paddingLeft: "5px",
                textAlign:" left",
                width: "100%",
                height: "6%",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#3d3939",
                fontSize: "x-large"
              }: {
                color: "#A1E533",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }
            }
            className="Header"
          >
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "start",
                width: "fit-content",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill={!onTheme ? "#A1E553" : "#E333E5"}
                class="bi bi-arrow-left"
                viewBox="0 0 16 16"
                className="show1"
                onClick={() => {
                  setshow(!show);
                }}
              >
                {show ? (
                  <path
                    fill-rule="evenodd"
                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                  />
                ) : (
                  <path
                    fill-rule="evenodd"
                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                  />
                )}
              </svg>
            </div>
            {header ? header : <span style={!onTheme ? {color:"#A1E553"} : {color:"#E333E5"}}>Select Coach To Start Chating</span>}
          </div>
          {start&&<> <div ref={revarse} className="message">
          {allMessages?.map((ele, i) => (

<div
  style={i === 0 ?{
    display: "flex",
    width: "100%",
    marginBottom: "10px",
    marginTop: "10px",
    paddingLeft:"10px",
    gap: "10px",
  } : {
    display: "flex",
    width: "100%",
    marginTop:"10px",
    marginBottom:"10px",
    borderTop:"1px solid #303030",
    paddingTop:"10px",
    paddingLeft:"10px",
    gap: "10px",
  }}
>
  <img
    src={ele.image}
    style={{
      width: "52px",
      height: "52px",
      borderRadius: "26px",
    }}
  />
  <div style={{ width: "90%" }}>
    <h5
      style={{
        textAlign: "start",
        margin:"0"
      }}
    >
      {ele.name}
    </h5>
    <h6  style={{
        textAlign: "start",
        color: "gray",
        fontSize: "small",
        margin:"0"
      }}>{timeOfMessage(ele.created_at)}</h6>
    <div
      style={{
        width: "90%",
        borderRadius: "4px",
        textAlign: "start",
        padding: "5px 0px",
        display:"flex",
        flexDirection:"column"
      }}
    >
      <div style={{marginBottom:"5px"}}>{ele.message}</div>
      {ele.image_message && <img style={{width:"50%",borderRadius:"8px", marginTop:"4px"}} src={ele.image_message}/>}
    </div>
  </div>
</div>
))}
          </div>
          <div className="Input-Button">
                  <textarea
                  style={{width:"100%", height:"60%", maxHeight:"70%", minHeight:"60%", borderRadius:"4px"}}
                    onChange={(e) => {
                      setInputMessage(e.target.value);
                    }}
                    value={inputMessage}
                    type="text"
                    id="inputPassword5"
                    aria-describedby="passwordHelpBlock"
                  />
                <div className="Buttons">
                  <div className="left">
                  <button onClick={handleImageClick} className='btn-gym-chat' style={{backgroundColor:"#404040", color:"white",paddingBottom:"4px"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                    </svg>
                  </button>
                    <input 
                      className='btn-gym-chat' 
                      style={{display:"none"}} 
                      ref={fileInputRef}
                      type='file'
                      accept='image/jpeg, image/jpg'
                      onChange={uploadImage}/>
                  </div>
                  <div className="right">
                    {!messageLoading ? 
                    <Button style={!onTheme ? {backgroundColor : "#A1E553"}:{backgroundColor :"#E333E5"}}
                    onClick={() => {
                      if (inputMessage) {
                        setImageMessage("")
                        setInputMessage("");
                        sendMessage();
                      }
                    }}
                  >
                    Send
                  </Button>
                    : 
                    <Button
                      style={!onTheme ? {cursor:"not-allowed",backgroundColor : "#A1E553"} : {backgroundColor :"#E333E5", cursor:"not-allowed"}}
                    >
                      Loading...
                    </Button>
                    }
                    
                  </div>
                </div>
              </div></>}
         
        </div>
      </div>
    </>
  );
};

export default CoachPrivate;
