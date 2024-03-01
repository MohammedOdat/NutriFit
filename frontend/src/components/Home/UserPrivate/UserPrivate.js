import React, { useEffect, useRef, useState } from "react";
import "./UserPrivate.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import socketInit from "../../Gym/socket.server";
import Spinner from "react-bootstrap/Spinner";
const UserPrivate = () => {
  const revarse = useRef(null);

  const navigate = useNavigate();
  const userInfo = localStorage.getItem("userInfo");
  const covertUserInfoToJson = JSON.parse(userInfo);
  const { token, userId,theme } = useSelector((state) => {
    return {
      token: state.auth.token,
      userId: state.auth.userId,
      theme : state.auth.theme
    };
  });
  const [onTheme, setOnTheme] = useState(false);
  const [image, setImage] = useState("");
  const [start, setStart] = useState(false);
  const [show, setshow] = useState(true);
  const [coachs, setCoachs] = useState([]);
  const [header, setHeader] = useState("");
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  //-----------------------------------------------------------
  const [toId, setToId] = useState("");
  const [from, setFrom] = useState("");
  const [clearInput, setClearInput] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [allMessages, setAllMessages] = useState([]);

  
  const [imageMessage , setImageMessage] = useState(null);
  const [messageLoading,setMessageLoading] = useState(false)
  const fileInputRef = useRef(null);
  useEffect(()=>{
    if(theme === "female"){
      setOnTheme(true);
    }else{
      setOnTheme(false);
    }
  },[theme]);
  useEffect(()=>{
    
    if (revarse.current) {
      revarse.current.scrollTop = revarse.current.scrollHeight;
    }
   },[allMessages?.length]);


  useEffect(()=>{
    setAllMessages([])
    axios.get(`http://localhost:5000/coachs/message/${from}/${userId}`,{headers:{
      Authorization:`Bearer ${token}`
    }}).then((result)=>{
      setAllMessages(result.data.messages)
    }).catch((error)=>{
      console.log(error);
    })
  },[from])

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/info/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setImage(result.data.info.image);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    socket?.on("connect", () => {
      console.log(true);
    });

    return () => {
      socket?.close();
      socket?.removeAllListeners();
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("messagePrivate", reviMessage);
    return () => {
      socket?.off("messagePrivate", reviMessage);
    };
  }, [allMessages]);

  const reviMessage = (data) => {
    console.log(data);
    setAllMessages((prevMessages) => [...prevMessages, data]);
  };

  const sendMessage = () => {
    socket?.emit("messagePrivate", {
      room: userId,
      from: from,
      message: inputMessage,
      name: covertUserInfoToJson.nameUser,
      image,
      image_message : imageMessage,
      created_at : new Date()
    });
  };

  const disconnectServer = () => {
    socket?.disconnect();
  };

  const getAllCoachs = () => {
    axios
      .get(`http://localhost:5000/coachs/coach`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        if (result.data.success) {
          console.log(result.data.coachs);
          setCoachs(result.data.coachs);
          setSuccess(result.data.success);
          setUserLoading(false);
        } else {
          setSuccess(result.data.success);
          setMessage(result.data.message);
          setUserLoading(false);
        }
      })
      .catch((error) => {
        setSuccess(false);
        setMessage(error.response.data.message);
        setUserLoading(false);
      });
  };
  useEffect(() => {
    getAllCoachs();
  }, []);

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

  return (
    <>
      {" "}
      <div className="Coach-Private-Page">
        {show && (
          <div className="Left-Side">
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
            ) : success ? (
              <div className="User-List">
                {coachs?.map((user, i) => (
                
                  <>  <div
                    className="User-Name"
                    style={header===`${user.firstname} ${user.lastname}`?!onTheme?{backgroundColor:"#A1E553",color:"#101010"}:{backgroundColor:"#E333E5",color:"#101010"}:{backgroundColor:"transparent"}}
                    onClick={() => {
                      setToId(userId);
                      setFrom(user.coach_id)
                      setSocket(
                        socketInit({
                          user_id: userId,
                          token: token,
                          room: userId,
                        })
                      );
                      setHeader(`${user.firstname} ${user.lastname}`);
                      setStart(true);
                    }}
                  >
                    # {user.firstname} {user.lastname}
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
                  <img
                    src={image && image}
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "26px",
                    }}
                  />
                </div>
                <div className="Private-Title">
                  {covertUserInfoToJson.nameUser}
                </div>
              </div>

              <svg
                onClick={() => {
                  navigate("/home");
                }}
                className="icon"
                style={{ cursor: "pointer" }}
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="red"
                class="bi bi-box-arrow-right"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                />
                <path
                  fill-rule="evenodd"
                  d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                />
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
            {header ? header : <span  style={
          !onTheme?{color:"#A1E335"}:{color:"#E333E5"}}>Select Coach To Start Chating</span>}
          </div>
          {start && (
            <>
              <div ref={revarse} className="message">
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
                      paddingLeft:"10px"
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
                      <h6
                        style={{
                          textAlign: "start",
                          color: "gray",
                          fontSize: "small",
                          paddingLeft: "5px",
                          margin:"0"
                        }}
                      >
                        {ele.name}
                      </h6>
                      <div
                        style={{
                          width: "90%",
                          borderRadius: "4px",
                          textAlign: "start",
                          padding: "5px 10px",
                          gap:"10px",
                          display:"flex",
                          flexDirection:"column"
                        }}
                      >
                        <div>{ele.message}</div>
                        {ele.image_message && <img style={{width:"50%",borderRadius:"8px", marginTop:"4px"}} src={ele.image_message}/>}
                      </div>
                      <h6  style={{
                          textAlign: "start",
                          color: "gray",
                          fontSize: "small",
                          paddingLeft: "5px",
                          margin:"0"
                        }}>{timeOfMessage(ele.created_at)}</h6>
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
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserPrivate;
