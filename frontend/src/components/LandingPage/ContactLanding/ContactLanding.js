import React from 'react'
import './style.css'
import contact_us from '../../assets/contact_us.png'
function ContactLanding() {
  return (
    <div className='contact-landing-main'>
      <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
      <h2 style={{color:"#A1E553", textAlign:"center", fontSize:"32px"}}>Contact Us</h2>

      </div>
   
    <div className='contact-landing'>
          
      <div className='contener-contact-form'>
        <div style={{display:"flex", flexDirection:"column", width:"100%", justifyContent:"center", alignItems:"center"}}>

          <h6 style={{width:"50%", textAlign:"center"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquam, orci ac tincidunt molestie, nunc libero sollicitudin elit</h6>
          <div style={{width:"50%", display:"flex", alignSelf:"center", justifyContent:"space-between"}}>
          <button className='btn-contact'>
              VIA Ticket
            </button>
            <button className='btn-contact'>
              VIA Call
            </button>
          </div>
        </div>

        <div className='contener-input'>
          <input className='contact-inp' placeholder='Name'/>
          <input className='contact-inp' placeholder='Email'/>
          <textarea className='message-input' placeholder='Message'/>
          <button className='btn-contact' style={{width:"100%", backgroundColor: "#A1E553"}}>Send</button>
        </div>
      </div>

      <div className='contener-image'>
        <img style={{width:"70%"}} src={contact_us}/>
      </div>
    </div>
    </div>
  )
}

export default ContactLanding
