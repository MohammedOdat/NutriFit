import React from 'react'
import{useState,useEffect} from 'react'
import './Login.css'
import { GoogleLogin } from "@react-oauth/google";
import { decodeToken } from "react-jwt";
import {useNavigate} from 'react-router-dom';
import axios from 'axios'
import { UseDispatch,useDispatch,useSelector } from 'react-redux'
import { setLogin,setUserId, setActivePrivate,setRole } from '../Redux/Reducers/Auth/index';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import logo from '../assets/pngwing.com.png'
const Login = () => {
  const navigate = useNavigate();
    const dispatch = useDispatch()

    
    const [onTheme, setOnTheme] = useState(false);
    const state = useSelector((state)=>{
    return{
        isLoggedIn : state.auth.isLoggedIn,
        role:state.auth.role,
        theme : state.auth.theme
      }
    });
  
    useEffect(()=>{
      if(state.theme === "female"){
        setOnTheme(true);
      }else{
        setOnTheme(false);
      }
    },[state.theme]);


    const [email ,setEmail] = useState("")
     
    const [password,setPassword]=useState("")

    const [message, setMessage] = useState("");

    const [success, setSuccess] = useState(null)
    const responseMessage = (response) => {
      const user = decodeToken(response.credential);
      axios
        .post("http://localhost:5000/users/register", {
          firstName: user.given_name,
          lastName: user.family_name,
          email: user.email,
          password: user.sub,
          gender:"male",
          role_id: "2",
        })
        .then((result) => {
          axios
            .post("http://localhost:5000/users/login", {
              email: user.email,
              password: user.sub,
            })
            .then((result) => {
              dispatch(setLogin(result?.data));
              dispatch(setUserId(result.data.userId));
              dispatch(setActivePrivate(result.data.private));
              setMessage("");
              localStorage.setItem("token",result.data.token);
              localStorage.setItem("userId",result.data.userId);
              localStorage.setItem("userInfo", JSON.stringify({
                  nameUser : result.data.userInfo.firstname + " "+ result.data.userInfo.lastname,
                  email : result.data.userInfo.email,
                  gender : result.data.userInfo.gender,
                  private : result.data.userInfo.private,
                  image : result.data.userInfo.image,
                  role : result.data.userInfo.role_id
                }))
                navigate('/home')
            })
            .catch((err) => {
              setSuccess(false)
              setMessage(err.response.data);
            });
        })
        .catch((err) => {
          if (err.response.data.message === "The email already exists") {
            axios
              .post("http://localhost:5000/users/login", {
                email: user.email,
                password: user.sub,
              })
              .then((result) => {
                dispatch(setLogin(result?.data));
                dispatch(setUserId(result.data.userId));
                dispatch(setActivePrivate(result.data.private));
                setMessage("");
                localStorage.setItem("token",result.data.token);
                localStorage.setItem("userId",result.data.userId);
                localStorage.setItem("userInfo", JSON.stringify({
                    nameUser : result.data.userInfo.firstname + " "+ result.data.userInfo.lastname,
                    email : result.data.userInfo.email,
                    gender : result.data.userInfo.gender,
                    private : result.data.userInfo.private,
                    image : result.data.userInfo.image,
                    role : result.data.userInfo.role_id
                  }))
                  navigate('/home')
              })
              .catch((err) => {
                setSuccess(false)
                setMessage(err.response.data);
              });
          }
        });
    };
    const errorMessage = (error) => {
    };


    const login = ()=>{

          if(!email || !password){
            setMessage("Conn't Send Empty Data")
          }else{
            axios.post("http://localhost:5000/users/login", {
              email,
              password,
            }).then((result)=>{
              dispatch(setLogin(result?.data));
              dispatch(setUserId(result.data.userId));
              dispatch(setActivePrivate(result.data.private));
              setMessage("");
              localStorage.setItem("token",result.data.token);
              localStorage.setItem("userId",result.data.userId);
              localStorage.setItem("userInfo", JSON.stringify({
                  nameUser : result.data.userInfo.firstname + " "+ result.data.userInfo.lastname,
                  email : result.data.userInfo.email,
                  gender : result.data.userInfo.gender,
                  private : result.data.userInfo.private,
                  image : result.data.userInfo.image,
                  role : result.data.userInfo.role_id
                }));
              navigate('/home');
            }).catch((error)=>{
              setSuccess(false)
              setMessage(error.message);
            })
          }
        
       
        }
    

  return (
    <div className='login-Page'>
       <div className="Left-Image">
        <img className="image" src={logo} />
      </div>

      <div className="Right-Inputs">
        <div className='continer-form-login'>
        <h1 className="Title">Login</h1>
        <div className="Email">
          <Form.Label>Email:</Form.Label>
          <Form.Control onChange={(e)=>{
            setEmail(e.target.value)
          }}
            type="email"
            style={{ backgroundColor: "#1e1e1e", border: "0", color: "white" }}
          />
        </div>
        <div className="Password">
          <Form.Label>Password:</Form.Label>
          <Form.Control onChange={(e)=>{
            setPassword(e.target.value)
          }}
            type="password"
            style={{ backgroundColor: "#1e1e1e", border: "0", color: "white" }}
          />
        </div>
        <button className="button-login" style={!onTheme? {backgroundColor:"A1E533"} : {backgroundColor:"#e333e5"}} onClick={()=>{
        login()
      }} >Login</button>
      <div style={{ alignSelf: "center" }}>
        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
      </div>
      <span style={{cursor:"default" , textAlign:"start"}}>
        don't have an account?  <span style={ !onTheme? {color:"#A1E533" , cursor:"pointer", textAlign:"start"} : {color:"#e333e5" , cursor:"pointer", textAlign:"start"}}  onClick={()=>{
          navigate("/register")
        }}>Sign Up</span>
        </span>
           <div  className={success?message && 'SuccessMessage' : message && "ErrorMessage"} style={{padding: "5px"}}><span style={{visibility:"hidden"}}>:</span>{message}</div>
    
        

        </div>

      </div>
      

      
     

    </div>
    





      



        

      
    
    

  )
}

export default Login
