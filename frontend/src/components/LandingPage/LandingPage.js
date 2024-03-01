import React from 'react'
import HomeLanding from './HomeLanding/HomeLanding'
import ServiceLanding from './ServiceLanding/ServiceLanding'
import ContactLanding from './ContactLanding/ContactLanding'
import "./style.css"
import Footer from './Footer/Footer'
function LandingPage() {
  return (
    <div className='continer-landing'>
        <HomeLanding/>
        <ServiceLanding/>
        <ContactLanding/>
        <Footer/>
    </div>
  )
}

export default LandingPage