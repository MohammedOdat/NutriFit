import React from 'react'
import "./style.css"
import { useNavigate } from 'react-router-dom'
function NotFound() {
  const navigate=useNavigate()
  return (
    <div className='contener-not-found'>
      <div style={{fontSize:"38px"}}>Oops!</div>
      <div style={{fontSize:"24px"}}>We can't seem to find the page you're looking for.</div>
      <p>Error code: 404</p>
      <div style={{padding:"10px"}}>
      <button style={{padding:"10px", border:"0", borderRadius:"4px",background:"#A1E533",fontWeight:"bold"}} onClick={()=>{
        navigate('/home')
      }}>Return Home</button>
      </div>
      
    </div>
  )
}

export default NotFound
