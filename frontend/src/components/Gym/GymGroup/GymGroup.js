import React, {useRef, useEffect ,useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './style.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import socketInit from '../socket.server';


function GymGroup() {

    
    const {gymid} = useParams();
    const userInfo = localStorage.getItem("userInfo");
    const covertUserInfoToJson = JSON.parse(userInfo);
    const navigate = useNavigate();
    const reversChat = useRef(null);
    const [allCoachs, setAllCoachs] = useState(null);
    const [allUsers, setAllUsers] = useState(null);
    const [infoGym, setInfoGym] = useState(null);
    const [rooms, setRooms] = useState(null);
    const [roomSelected , setRoomSelected] = useState(null);
    const [isCoach, setIsCoach] = useState(false);

    const [roomLoading , setRoomLoading] = useState(true);
    const [coachLoading, setCoachLoading] = useState(true);
    const [userLoading,setUserLoading] = useState(true);
    const [infoGymLoading, setInfoGymLoading] = useState(true);

    const [onTheme, setOnTheme] = useState(false);
    const [userFilter, setUserFilter] = useState(null)
    const [room , setRoom] = useState("");
    const [from , setFrom] = useState("");
    const [clearInput, setClearInput] = useState("");
    const [message , setMessage] = useState("");

    const [socket, setSocket] = useState(null);

    const [imageMessage , setImageMessage] = useState(null);

    const [allMessages, setAllMessages] = useState([]);

    const [messageLoading,setMessageLoading] = useState(false)
    const fileInputRef = useRef(null);
    
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
        setAllMessages([]);
        axios.get(`http://localhost:5000/gyms/message/${gymid}/${roomSelected}`).then((result) => {
            console.log("messages DB =>",result);
            setAllMessages(result.data.messages)
        }).catch((err) => {
            console.log(err);
        });
    },[roomSelected]);

    useEffect(()=>{
      if(state.theme === "female"){
        setOnTheme(true);
      }else{
        setOnTheme(false);
      }
    },[state.theme]);
    

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
        const handleNewMessage = (data) => {
            setAllMessages(prevMessages => [...prevMessages, data]);
        };
        socket?.on("messageGym", handleNewMessage);
        console.log(allMessages);
        return()=>{
            socket?.off("messageGym", handleNewMessage);
        }
    },[allMessages]);


    const sendMessage = ()=>{
        socket?.emit("messageGym",{
            room : roomSelected, from : 7, message, name  : covertUserInfoToJson?.nameUser , image_message : imageMessage,image : infoGym?.image
        ,created_at : new Date()} );
    }

    const disconnectServer = ()=>{
        socket?.disconnect();      
    }

    useEffect(()=>{
        if(roomSelected){
            if(reversChat.current){
                reversChat.current.scrollTop = reversChat.current.scrollHeight;
            };
        }
    },[allMessages?.length])

    if(roomSelected){
        if(reversChat.current){
            reversChat.current.scrollTop = reversChat.current.scrollHeight;
        };
    }

    const config = {
        headers: { Authorization: `Bearer ${state.token}` }
    }
    
    useEffect(() => {
        axios.get(`http://localhost:5000/gyms/${gymid}/coach`, config)
            .then(coachResult => {
                setAllCoachs(coachResult.data.coachs);
                setCoachLoading(false);
                return axios.get(`http://localhost:5000/gyms/${gymid}/user`, config);
            })
            .then(userResult => {
                
                setAllUsers(userResult.data.users);
                console.log("userResult.data.users", userResult.data.users);
                setUserLoading(false);
                return axios.get(`http://localhost:5000/gyms/${gymid}`, config);
            })
            .then(gymResult => {
                setInfoGymLoading(false);
                setInfoGym(gymResult.data.oneGym);
                return axios.get(`http://localhost:5000/gyms/plan/${gymid}`, config);
            })
            .then(planResult => {
                setRooms(planResult.data.plans);
                setRoomLoading(false)
                
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    useEffect(()=>{
    if(infoGym?.owner_id === Number(state.userId)){
            setIsCoach(true);
    }
    for(let i = 0; i < allCoachs?.length; i++){
        if(allCoachs[i].coach_id === Number(state.userId)){
            return setIsCoach(true)
        }else{
            continue;
        }
    }
    },[roomLoading]);

    const generateChatGym = ()=>{
        const chatLite = [];
        for (let i = 0; i < allMessages?.length; i++) {
            const endDate = new Date(allMessages[i].created_at);
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
            let name = allMessages[i].name.split(' ')
            chatLite.push(
                <div style={ i === 0 ? {display:"flex", width:"100%" , gap:"10px"} : {display:"flex", width:"100%" , gap:"1px",borderTop:"1px solid #202020", marginTop:"10px", paddingTop:"10px"}}>
                    <img src={`${allMessages[i].image}`} style={{width:"52px", height:"52px", borderRadius:"26px"}}/>
                    <div style={{width:"90%"}}>
                    <div>
                    <h5 style={{textAlign:"start" , marginBottom:"0"}}>{infoGym.name}</h5>
                    <h6 style={{textAlign:"start", color:"gray", fontSize:"small", paddingLeft:"5px", marginBottom:"0"}}>{dateNow}</h6>
                    </div>
                    
                    <div style={{ width:"100%", borderRadius:"4px", textAlign:"start", padding:"5px 0px"}}> 
                    <div style={{marginBottom:"5px"}}>{allMessages[i].message}</div>
                    {allMessages[i].image_message && <img style={{width:"50%", borderRadius:"8px", marginTop:"4px"}} src={allMessages[i].image_message}/>}
                    </div>
                    <h6 style={{textAlign:"start", color:"gray", fontSize:"small", paddingLeft:"5px", margin:"0"}}>{name[0] + " " + name[1][0].toUpperCase()}.</h6>
                    
                    </div>
                </div>
            )
        }

        return chatLite;
        
    }

    const listCoachs = ()=>{
        const coachArr = [];
        if(!allCoachs || allCoachs?.length ===0){
            coachArr.push(
                <>
                <li style={{padding:"5px 15px 10px",color:"rgb(170,170,170,0.7)", cursor:"default"}}>There is no coach</li>
                </>
            )
        }
        for(let i = 0; i < allCoachs?.length ; i++){
            coachArr.push(
                        <>
                        <li  style={{padding:"5px 15px 0px", cursor:"default"}}> {allCoachs[i].firstname + " " + allCoachs[i].lastname}</li>
                        <div style={{borderBottom:"1px solid #373737", margin:"5px 20px"}}></div>
                        </>
            )
        }
        return coachArr;
    }

    useEffect(()=>{
        const filteredObjects = allUsers?.filter(obj => obj['name_plan'] === roomSelected);
        setUserFilter(filteredObjects)
    },[roomSelected])

    const listUsers = ()=>{
        const userArr = [];
        for(let i = 0; i < userFilter?.length ; i++){
            const endDate = new Date(userFilter[i].endsub);
            const now = new Date();
            const difference = endDate - now;

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));

            userArr.push(
                        <>
                        <li style={{padding:"5px 15px 0px", cursor:"default"}}>{`${userFilter[i].firstname} ${userFilter[i].lastname}`} <span style={{color:"#808080", fontSize:"13px"}}>(End After {days} Days)</span></li>
                        <div style={{borderBottom:"1px solid #373737", margin:"5px 20px"}}></div>
                        </>
            )
        }
        return userArr;
    }

    const listRoom = ()=>{
        const roomList = [];
        for(let i = 0; i < rooms?.length; i++){
            roomList.push(
                    <>
                    <li style={roomSelected === rooms[i].name_plan ? 
                    !onTheme ? {fontWeight:"bold", marginBottom:"5px", marginTop:"5px",marginRight:"5px", cursor:"pointer", backgroundColor:"#A1E533", color:"#101010", padding:"5px", borderRadius:"4px"} 
                    : {fontWeight:"bold", marginBottom:"5px", marginTop:"5px",marginRight:"5px", cursor:"pointer", backgroundColor:"#E333E5", color:"#101010", padding:"5px", borderRadius:"4px"} 
                    : {fontWeight:"bold", marginBottom:"5px", marginTop:"5px",padding:"5px", cursor:"pointer"}} onClick={()=>{
                        setRoomSelected(rooms[i].name_plan);
                        setSocket(socketInit({user_id : state.userId, token : state.token, room : rooms[i].name_plan}));
                    }}># {rooms[i].name_plan}</li>
                    <div style={{borderBottom:"1px solid #373737",margin:"5px 20px"}}></div>
                    </>
            )
        }
    return roomList;
    }
    
  return (
    <div className='body-group'>
        <div className='group-contener'>
            <div className='contener-room'>
                <div style={{height:"100%"}}>
                <h6 className='head' style={!onTheme?{color:"#A1E553", cursor:"pointer"}:{color:"#e333e5", cursor:"pointer"}} onClick={()=> setRoomSelected(null)}>Room</h6>
                <div style={roomLoading ? {height:"100%",display:"flex",flexDirection:"column", placeItems:"center",justifyContent:"center"} : {display:"none"}} >
                <Spinner animation="border" style={!onTheme ? {color:"#A1E533"} : {color:"#e333e5"}} />
                <label>Loading...</label>
                </div>
                {rooms?.length ? 
                <ul style={roomLoading ? {display:"none"} : {display:"block"}}>
                {listRoom()}
                </ul>
                :
                <div style={{width:"100%", height:"100%", textAlign:"center", display:"flex", justifyContent:"center", placeItems:"center"}} onClick={()=>{
                    navigate(`/${gymid}/settings`);
                }}>
                    <span>click to Create Plan</span>
                    </div>
                }
                
                </div>

                <div className='control-gym'>
                    {infoGymLoading ? 
                    <div style={{width:"100%", display:"flex", flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                    <Spinner animation="border" style={!onTheme ? {color:"#A1E533"} : {color:"#e333e5"}}  />
                    <label>Loading...</label>
                    </div>
                    :
                    <>
                                    <div style={{display:"flex", alignItems:"center", gap:"10px"}}> 
                    <img style={{width:"48px", height:"48px", borderRadius:"24px"}} src={infoGym?.image}/>
                    <h6>{infoGym?.name}</h6>
                </div>
                
                <div style={{display:"flex", gap:"10px",paddingRight:"10px"}}>
                    {infoGym?.owner_id === Number(state.userId) && 

                    <div onClick={()=>{
                        navigate(`/${gymid}/settings`);
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
                        </svg>
                    </div>
                    }

                    <div style={{display:"none"}} onClick={()=>{
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                        <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                        </svg>
                    </div>
                   
                </div>
                    </>
                    }
                

                
                </div>
            </div>

            <div className='contener-chat' style={!roomSelected ? {width : "80%", borderRight:"0"} : covertUserInfoToJson.role === 3 ? {width:"60%"} : {width:"80%", border:"0", height:"99%"}}>
                {!roomSelected ? <>
                <div style={!onTheme? {color:"#707070",fontWeight:"bold", alignItems:"center", justifyContent:"center",display:"flex", paddingLeft:"5px", textAlign:"center", padding:"1%", height:"100%"} 
                : {fontWeight:"bold", alignItems:"center", display:"flex", paddingLeft:"5px", textAlign:"start", padding:"1%" ,color:"#e333e5"}}>
                    <h6 style={{textAlign:"center"}}>Please Select Room To View Chat</h6>
                    </div>
                </> : <>
                    <div style={!onTheme?{ backgroundColor:"#A1E533", color:"#101010", fontWeight:"bold", alignItems:"center", display:"flex"} : {backgroundColor:"#e333e5", color:"#101010", fontWeight:"bold", alignItems:"center", display:"flex"}}>
                        <h6 style={{textAlign:"start", paddingLeft:"5px",fontWeight:"bold", margin:"0",padding:"1%"}}># {roomSelected}</h6>
                    </div>


                    <div ref={reversChat} style={isCoach? { backgroundColor:"#101010",height:"75%", alignItems:"center", display:"flex", flexDirection:"column", overflowY:"scroll", padding:"5px"} : { backgroundColor:"#101010",height:"90%", alignItems:"center", display:"flex", flexDirection:"column", overflowY:"scroll", padding:"5px"}}>
                    {generateChatGym()}
                    </div>
                    {isCoach ? 
                    <div style={{ backgroundColor:"#202020",height:"20%", alignItems:"center", display:"flex", justifyContent:"flex-end", flexDirection:"column", padding:"10px"}}>
                       
                        
                        <textarea style={{width:"95%", height:"70%", borderRadius:"4px"}} value={message} onChange={(e)=>{
                            setMessage(e.target.value);
                        }}/>
                        
                        <div style={{height:"30%", display:'flex',justifyContent:"space-between", width:"95%", alignItems:"center"}}>
                        <div style={{display:"flex", gap:"5px"}}>
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
                        {messageLoading ? 
                        <button className='btn-gym-chat' style={
                            !onTheme?{backgroundColor:"#A1E335"}:{backgroundColor:"#E333E5",cursor:"not-allowed"}}>Loading...</button>
                        :
                        <button className='btn-gym-chat'style={
                            !onTheme?{backgroundColor:"#A1E335"}:{backgroundColor:"#E333E5"}}  onClick={()=>{
                            if(message){
                                setImageMessage("")
                                sendMessage();
                                setMessage("");
                                
                            }
                                
                        }}>Send</button>
                        }
                        
                        </div>
                       
                        
                    </div>                
                    :
                    <div style={{backgroundColor:"#202020",height:"5%", alignItems:"center", display:"flex", justifyContent:"center", flexDirection:"column", padding:"10px", color:"#707070"}}>
                     Only certain people can post in this Room. 
                    </div>
                 }
                </>}
            </div>
            
            <div className='contener-member' style={roomSelected && covertUserInfoToJson.role === 3 ? {display:"block"} :{display:"none"}}>
                <div style={{height:"50%", display:"flex",flexDirection:"column"}}>
                    <h6 className='head' style={!onTheme?{color:"#A1E553"}:{color:"#e333e5"}}>Coach</h6>
                    <div style={coachLoading ? {height:"100%",display:"flex",flexDirection:"column", placeItems:"center",justifyContent:"center"} : {display:"none"}} >
                        <Spinner animation="border" style={!onTheme ? {color:"#A1E533"} : {color:"#e333e5"}}  />
                        <label>Loading...</label>
                    </div>
                    <div style={{overflowY:"scroll"}}>
                        <ul style={coachLoading ? {display:"none"} : {display:"block"}}>
                            {listCoachs()}
                        </ul>
                    </div>
                    
                
                </div>
                <div style={{height:"50%", display:"flex",flexDirection:"column"}}>
                    <h6 className='head' style={!onTheme?{color:"#A1E553"}:{color:"#e333e5"}}>User</h6>
                    <div style={userLoading ? {height:"100%",display:"flex", flexDirection:"column",placeItems:"center",justifyContent:"center"} : {display:"none"}} >
                        <Spinner animation="border" style={!onTheme ? {color:"#A1E533"} : {color:"#e333e5"}}  />
                        <label>Loading...</label>
                    </div>
                    <div style={{overflowY:"scroll"}}>
                        <ul style={userLoading ? {display:"none"} : {display:"block"}}>
                        {listUsers()}
                        </ul>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default GymGroup