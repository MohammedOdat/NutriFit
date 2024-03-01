import React, { useEffect, useState } from 'react'
import './style.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { useSelector } from 'react-redux';
const PaymentPrivatePlan = () => {
    const navigate = useNavigate();
    const {coachid, planid} = useParams();
    const [numberCard, setNumberCard] = useState(null);
    const [nameOnCard, setNameOnCard] = useState(null);
    const [expirationDate, setExpirationDate] = useState(null);
    const [cVV, setCVV] = useState(null);
    const [dataPlanForInvoice, setDataPlanForInvoice] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [success, setSuccess] = useState(null)
    const [message, setMessage] = useState("")
    const [onTheme, setOnTheme] = useState(false);
    const state = useSelector((state)=>{
        return{
        userId : state.auth.userId,
        token : state.auth.token,
        theme : state.auth.theme
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
        axios.get(`http://localhost:5000/coachs/plans/plan/${planid}`, config).then((result) => {
            setDataPlanForInvoice(result.data.plan);
            setTotalPrice(Number(result.data.plan.price)+0.48)
        }).catch((err) => {
            setSuccess(false);
            setMessage(err.response.data.message);
        });
    },[])
    const AddUserToPrivate=()=>{
        axios.post(`http://localhost:5000/coachs/user`,{coach_id:coachid,plan_id:planid},config
        ).then((result)=>{
             navigate(`/user/private`);
        }).catch((err)=>{
            setSuccess(false)
            setMessage("Something went Wrong Please Try Again")
        })
    }
    const handlePay = ()=>{
        if(numberCard && nameOnCard && expirationDate && cVV){
            AddUserToPrivate()
        }else{
            setSuccess(false)
            setMessage("please fill data")
        }
    }
      return (
        <div className='contener-payment'>
            <div className='invoice'>
                <h2 style={{textAlign:"center"}}>Invoice</h2>
                <div className='inv'>
                <h6>Coach Name:</h6>
                <h6>{dataPlanForInvoice && dataPlanForInvoice.firstname} {dataPlanForInvoice && dataPlanForInvoice.lastname}</h6>
                </div>
                <div className='inv'>
                    <h6>Plan Name:</h6>
                <h6>{dataPlanForInvoice && dataPlanForInvoice.name}</h6></div>
                <div className='inv'>
                    <h6>Month:</h6>
                    <h6>{dataPlanForInvoice && dataPlanForInvoice.numofmonth}</h6>
                </div>
                <div className='inv'>
                    <h6>Price:</h6>
                    <h6>${dataPlanForInvoice && dataPlanForInvoice.price}</h6>
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
                <button className='pay-btn'  style={
          !onTheme?{backgroundColor:"#A1E335"}:{backgroundColor:"#E333E5"}} onClick={handlePay}>Pay Now</button>
            </div>
            <div
        className={
          success ? message && "SuccessMessage" : message && "ErrorMessage"
        }
        style={{ padding: "5px" }}
      >
        <span style={{ visibility: "hidden" }}>:</span>
        {message}
      </div>
        </div>
      );
};
export default PaymentPrivatePlan