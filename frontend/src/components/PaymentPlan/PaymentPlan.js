import React, { useEffect, useState } from 'react'
import './style.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { useSelector } from 'react-redux';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
function PaymentPlan() {
    const navigate = useNavigate();
    const {gymid, planid} = useParams();
    const [numberCard, setNumberCard] = useState(null);
    const [nameOnCard, setNameOnCard] = useState(null);
    const [expirationDate, setExpirationDate] = useState(null);
    const [cVV, setCVV] = useState(null);
    const [dataPlanForInvoice, setDataPlanForInvoice] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [onTheme, setOnTheme] = useState(false);
    const state = useSelector((state)=>{
        return{
            theme : state.auth.theme,
        userId : state.auth.userId,
        token : state.auth.token
        }
      })
    const config = {
        headers: { Authorization: `Bearer ${state.token}` }
    }

    useEffect(()=>{
        if(state.theme === "female"){
          setOnTheme(true);
        }else{
          setOnTheme(false);
        }
      },[state.theme]);
    useEffect(()=>{
        axios.get(`http://localhost:5000/gyms/plan/${planid}/select`, config).then((result) => {
            setDataPlanForInvoice(result.data.plan);
            setTotalPrice(Number(result.data.plan.price_plan)+0.48)
        }).catch((err) => {
            
        });
       
    },[])
    const handlePay = ()=>{
        if(numberCard && nameOnCard && expirationDate && cVV){
            axios.post(`http://localhost:5000/gyms/gym/user`, 
            {gymId : gymid, planId : planid, numOfMonth : dataPlanForInvoice.numofmonth_plan, userId: state.userId},
            config).then((result) => {
                navigate(`/gym/${gymid}`);
            }).catch((err) => {
            });
            
        }else{
        }
    }
      return (
        <div className='contener-payment'>
            <div className='invoice'>
                <h2 style={{textAlign:"center"}}>Invoice</h2>
                <div className='inv'>
                <h6>Name Gym:</h6>
                <h6>{dataPlanForInvoice && dataPlanForInvoice.name}</h6>
                </div>
                <div className='inv'>
                    <h6>Name Plan:</h6>
                <h6>{dataPlanForInvoice && dataPlanForInvoice.name_plan}</h6></div>
                <div className='inv'>
                    <h6>Month:</h6>
                    <h6>{dataPlanForInvoice && dataPlanForInvoice.numofmonth_plan}</h6>
                </div>
                <div className='inv'>
                    <h6>Price:</h6>
                    <h6>${dataPlanForInvoice && dataPlanForInvoice.price_plan}</h6>
                </div>
                <div style={{borderBottom:"1px solid gray"}}></div>
                <div className='inv'>
                    <h6>TAX:</h6>
                    <h6>$0.48</h6>
                </div>
                <div className='inv'>
                    <h6>Total Price:</h6>
                    <h6>${totalPrice}</h6>
                </div>
                <div style={{borderBottom:"1px solid gray"}}></div>
            </div>
            <div className='form-pay'>
                <div style={{width:"50%"}}>
                    <p className='text-card'>Name On Card:</p>
                    <input className='input-card' type='text' placeholder='Name On Card' onChange={(e)=>{
                        setNameOnCard(e.target.value);
                    }}/>
                </div>
                <div style={{width:"50%"}}>
                    <p className='text-card'>Card Number</p>
                    <input className='input-card' type='number' placeholder='1234-5678-9012-3456' onChange={(e)=>{
                        setNumberCard(e.target.value);
                    }}/>
                </div>
                
                
                <div style={{display:"flex", width:"50%", justifyContent:"space-between"}}>
                <div style={{width:"50%"}}>
                    <p className='text'>Expiration Date</p>
                    <input className='c' placeholder='MM/YY'  onChange={(e)=>{
                        setExpirationDate(e.target.value);
                    }}/>
                </div>
                    
                <div style={{width:"50%"}}>
                    <p className='text'>CVV</p>
                    <input className='d' type='number' placeholder='CCV' onChange={(e)=>{
                        setCVV(e.target.value);
                    }}/>
                </div>
                </div>
                <button className='pay-btn' style={
          !onTheme?{backgroundColor:"#A1E335"}:{backgroundColor:"#E333E5"}} onClick={handlePay}>Pay Now</button>
            </div>
            
        </div>
      );
};

export default PaymentPlan
