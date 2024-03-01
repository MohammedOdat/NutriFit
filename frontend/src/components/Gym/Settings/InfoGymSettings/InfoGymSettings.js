import React, { useEffect, useRef, useState } from 'react'
import './InfoGymSettings.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
function InfoGymSettings() {
    const navigate = useNavigate();
    const {gymid} = useParams();
    const [dataGym, setDataGym] = useState(null);
    const [dataPlan, setDataPlan] = useState(null);
    const [dataLitePlan, setDataLitePlan] = useState(null);
    const [dataGoldPlan, setDataGoldPlan] = useState(null);
    const [dataLProPlan, setDataProPlan] = useState(null);
    const [nameGym , setNameGym] = useState(null);
    const [descriptionGym, setDescriptionGym] = useState(null);

    const [pricePlanLite, setPricePlanLite] = useState(null);
    const [monthSupLite, setMonthSupLite] = useState(null);
    const [descPlanLite, setDescPlanLite] = useState(null);

    
    const [pricePlanGold, setPricePlanGold] = useState(null);
    const [monthSupGold, setMonthSupGold] = useState(null);
    const [descPlanGold, setDescPlanGold] = useState(null);

    
    const [pricePlanPro, setPricePlanPro] = useState(null);
    const [monthSupPro, setMonthSupPro] = useState(null);
    const [descPlanPro, setDescPlanPro] = useState(null);


    const [showAlert, setShowAlert] = useState(false);


    const fileInputRef = useRef(null);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
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
    
    useEffect(()=>{
        if(state.theme === "female"){
          setOnTheme(true);
        }else{
          setOnTheme(false);
        }
      },[state.theme]);
    useEffect(() => {
      if (showAlert) {
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    }, [showAlert]);


    const uploadImage = async(e) => {
	    const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'yk50quwt');
        formData.append("cloud_name", "dorpys3di");
        await fetch('https://api.cloudinary.com/v1_1/dvztsuedi/image/upload', {
          method: 'post',
          body: formData,
        }).then((result)=> result.json()).then((data) => {
            setImageUrl(data.url);
            console.log("URL Image =>", data.url);
        }).catch((err) => {
        console.log(err);
        });
    };

    const handleImageClick = () => {
            fileInputRef.current.click();
    };
  return (
    <div className='info-body'>
        <div className='contener-info-gym-settings'>
            <div className='continer-image-gym-settings'>
                <img className='image-gym-settings' src={imageUrl ? imageUrl : dataGym?.image} 
                onClick={handleImageClick}/>
                <input
                type='file'
                accept='image/jpeg, image/jpg'
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={uploadImage}
            />
            </div>
            
            <div className='name-desc-gym-settings'>
                <textarea className='info-gym-textarea' defaultValue={dataGym && dataGym.name} onChange={(e)=>{
                    setNameGym(e.target.value);
                }}/>
                <textarea className='desc-gym-settings info-gym-textarea' defaultValue={dataGym && dataGym.description} onChange={(e)=>{
                    setDescriptionGym(e.target.value);
                }}/>
            </div>
        </div>

        <div className='continer-plan-settings'>
        
        <div className='lite-plan plan-settings'>
            <div className='name-price-month-plan-settings'>
                <h4 className='name-plan-settings'>Lite</h4>
                <h5 className='price-plan-settings' >Price $<input className='price-plan-settings-input' defaultValue={dataLitePlan && dataLitePlan.price_plan} onChange={(e)=>{
                    setPricePlanLite(e.target.value);
                }}/></h5>
                <h5 className='month-plan-settings'>per <input className='price-plan-settings-input' defaultValue={dataLitePlan && dataLitePlan.numofmonth_plan} onChange={(e)=>{
                    setMonthSupLite(e.target.value);
                }}/> Month</h5>
            </div>

            <div className='description-plan-settings'>
                <textarea className='textarea-desc' defaultValue={dataLitePlan && dataLitePlan.description_plan} onChange={(e)=>{
                    setDescPlanLite(e.target.value);
                }}/>
            </div>

        </div>
        <div className='gold-plan plan-settings'>
            <div className='name-price-month-plan-settings'>
                <h4 className='name-plan-settings'>Gold</h4>
                <h5 className='price-plan-settings' >Price $<input className='price-plan-settings-input' defaultValue={dataGoldPlan && dataGoldPlan.price_plan} onChange={(e)=>{
                    setPricePlanGold(e.target.value);
                }}/></h5>
                <h5 className='month-plan-settings'>per <input className='price-plan-settings-input' defaultValue={dataGoldPlan && dataGoldPlan.numofmonth_plan} onChange={(e)=>{
                    setMonthSupGold(e.target.value);
                }}/> Month</h5>
            </div>

            <div className='description-plan-settings'>
            <textarea className='textarea-desc' defaultValue={dataGoldPlan && dataGoldPlan.description_plan} onChange={(e)=>{
                setDescPlanGold(e.target.value);
            }}/>
            </div>

        </div>
        <div className='premium-plan plan-settings'>
            <div className='name-price-month-plan-settings'>
                <h4 className='name-plan-settings'>Premium</h4>
                <h5 className='price-plan-settings' >Price $<input className='price-plan-settings-input' defaultValue={dataLProPlan && dataLProPlan.price_plan} onChange={(e)=>{
                    setPricePlanPro(e.target.value);
                }}/></h5>
                <h5 className='month-plan-settings'>per <input className='price-plan-settings-input' defaultValue={dataLProPlan && dataLProPlan.numofmonth_plan} onChange={(e)=>{
                    setMonthSupPro(e.target.value);
                }}/> Month</h5>
            </div>

            <div className='description-plan-settings'>
            <textarea className='textarea-desc' defaultValue={dataLProPlan && dataLProPlan.description_plan} onChange={(e)=>{
                setDescPlanPro(e.target.value)
            }}/>
            </div>
            
        </div>

        </div>

        <div style={{height:"5%"}}>
            <button style={!onTheme ? {width:"50%", border:"0", backgroundColor:"#A1E533", borderRadius:"4px", padding:"4px"} : {width:"50%", border:"0", backgroundColor:"#E333E5", borderRadius:"4px", padding:"4px"}} onClick={()=>{
                if(nameGym || descriptionGym || imageUrl){
                axios.put(`http://localhost:5000/gyms/${gymid}`, {name : nameGym, description : descriptionGym, image : imageUrl}, config).then((result) => {
                    setNameGym(null);
                    setDescriptionGym(null);
                    setShowAlert(true);

                }).catch((err) => {
                    console.log(err);
                });
                }

                if (!dataLitePlan && pricePlanLite && monthSupLite && descPlanLite) {
                    axios.post(`http://localhost:5000/gyms/${gymid}/plan/create`,
                        { name: "Lite", description: descPlanLite, numOfMonth: monthSupLite, price: pricePlanLite },
                        config)
                        .then(() => {
                            setShowAlert(true);
                            setDataLitePlan(true);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else if (dataLitePlan && (pricePlanLite || monthSupLite || descPlanLite)) {
                    axios.put(`http://localhost:5000/gyms/plan/${dataLitePlan.id_plan}/update`,
                        { name: 'Lite', description: descPlanLite, numOfMonth: monthSupLite, price: pricePlanLite },
                        config)
                        .then(() => {
                            setShowAlert(true);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            
                if (!dataGoldPlan && pricePlanGold && monthSupGold && descPlanGold) {
                    axios.post(`http://localhost:5000/gyms/${gymid}/plan/create`,
                        { name: "Gold", description: descPlanGold, numOfMonth: monthSupGold, price: pricePlanGold },
                        config)
                        .then(() => {
                            setShowAlert(true);
                            setDataGoldPlan(true);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else if (dataGoldPlan && (pricePlanGold || monthSupGold || descPlanGold)) {
                    axios.put(`http://localhost:5000/gyms/plan/${dataGoldPlan.id_plan}/update`,
                        { name: 'Gold', description: descPlanGold, numOfMonth: monthSupGold, price: pricePlanGold },
                        config)
                        .then(() => {
                            setShowAlert(true);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            
                if (!dataLProPlan && pricePlanPro && monthSupPro && descPlanPro) {
                    axios.post(`http://localhost:5000/gyms/${gymid}/plan/create`,
                        { name: "Premium", description: descPlanPro, numOfMonth: monthSupPro, price: pricePlanPro },
                        config)
                        .then(() => {
                            setShowAlert(true);
                            setDataProPlan(true);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else if (dataLProPlan && (pricePlanPro || monthSupPro || descPlanPro)) {
                    axios.put(`http://localhost:5000/gyms/plan/${dataLProPlan.id_plan}/update`,
                        { name: 'Premium', description: descPlanPro, numOfMonth: monthSupPro, price: pricePlanPro },
                        config)
                        .then(() => {
                            setShowAlert(true);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }

            }}>Save Change</button>
        </div>
    
    {showAlert && (
        <div style={{width:"fit-content",backgroundColor:"green", 
        borderRadius:"4px",
        padding:"10px", height:"fit-content", position: "fixed", bottom:"4%", right:"2%"}}>
          Successfully Updated
        </div>
      )}
    </div>
  )
}
export default InfoGymSettings
