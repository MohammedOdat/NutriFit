import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import './style.css'
import InfoGymSettings from './InfoGymSettings/InfoGymSettings';
import UserInGymSettings from './UserInGymSettings/UserInGymSettings';
import CoachInGymSettings from './CoachInGymSettings/CoachInGymSettings';
function Settings() {
    const {gymid} = useParams();

    const navigate = useNavigate();
    const [dataGym, setDataGym] = useState(null);
    const [dataPlan, setDataPlan] = useState(null);
    const [dataLitePlan, setDataLitePlan] = useState(null);
    const [dataGoldPlan, setDataGoldPlan] = useState(null);
    const [dataLProPlan, setDataProPlan] = useState(null);
    const [SelectedPage , setSelectedPage] = useState("InfoGym");

    const [onTheme, setOnTheme] = useState(false);


    const state = useSelector((state)=>{
        return{
        userId : state.auth.userId,
        token : state.auth.token
        }
    })

    const config = {
        headers: { Authorization: `Bearer ${state.token}` }
    }

    useEffect(()=>{
        axios.get(`http://localhost:5000/gyms/${gymid}`,config).then((result) => {
            setDataGym(result.data.oneGym);
            axios.get(`http://localhost:5000/gyms/plan/${gymid}`,config).then((resultPlan) => {
                resultPlan.data.plans.map((e,i)=>{
                    if(e.name_plan === 'Lite'){
                        setDataLitePlan(e);
                    }
                    if(e.name_plan === 'Gold'){
                        setDataGoldPlan(e);
                    }
                    if(e.name_plan === 'Premium'){
                        setDataProPlan(e);
                    }
                })
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
    },[])

  return (
    <div className='body-settings'>
        <div className='contener-settings'>

            <div className='list-contener'>
                <lu className="list-settings">
                    <li className='li-list-settings' style={SelectedPage === "InfoGym" ? {backgroundColor: "#404040", padding:"5px"} : {backgroundColor:"transparent", padding:"5px"}} onClick={()=>{
                        setSelectedPage("InfoGym")
                    }}>Info Gym</li>
                    <li className='li-list-settings' style={SelectedPage === "user" ? {backgroundColor: "#404040", padding:"5px"} : {backgroundColor:"transparent", padding:"5px"}} onClick={()=>{
                        setSelectedPage("user")
                    }}>User</li>
                    <li className='li-list-settings' style={SelectedPage === "coach" ? {backgroundColor: "#404040", padding:"5px"} : {backgroundColor:"transparent", padding:"5px"}} onClick={()=>{
                        setSelectedPage("coach")
                    }}>Coach</li>
                </lu>
            </div>

            <div className='contener-page'>
                {SelectedPage === "InfoGym" && <InfoGymSettings/>}
                {SelectedPage === "user" && <UserInGymSettings/>}
                {SelectedPage === "coach" && <CoachInGymSettings/>}
            </div>
        </div>
    </div>
  )
}

export default Settings
