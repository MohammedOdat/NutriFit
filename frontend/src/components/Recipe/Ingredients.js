import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Engredient.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
const Ingredients = () => {
  const { id } = useParams();
  const [ingredient, setIngredient] = useState(null);
  const [onTheme, setOnTheme] = useState(false);
  const [isFlip, setIsFlip] = useState(false);
  const navigate = useNavigate();

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
    if(state.theme === "female"){
      setOnTheme(true);
    }else{
      setOnTheme(false);
    }
  },[state.theme]);

  useEffect(() => {
    rendering();
  }, []);
  const rendering = () => {
    axios
      .get(
        `https://api.edamam.com/api/recipes/v2/${id}?type=public&app_id=3cfe5e06&app_key=28c3a03ea304f6aaa97589f1f1bd8877`
      )
      .then((result) => {
        setIngredient(result.data.recipe);
      })
      .catch((err) => {
      });
  };
  return (
    <div className="ingredient-page">
      <div className="name-recipe">
        <h3>{ingredient?.label}</h3>
      </div>
      <div className="contenter-content">
        <div className="img-some-info">
          <div>
            <img style={{borderRadius:"4px", marginTop:"10%"}} src={ingredient?.image}/>
          </div>
          
          <div className="info-recipe">
            <h6><span style={!onTheme ? {color : "#A1E553"} : {color: "#E333E5"}}>Calories:</span> {Math.floor(ingredient?.calories)} Calories</h6>
            <h6><span style={!onTheme ? {color : "#A1E553"} : {color: "#E333E5"}}>Meal:</span> {ingredient?.mealType}</h6>
            <h6><span style={!onTheme ? {color : "#A1E553"} : {color: "#E333E5"}}>Cuisine:</span> {ingredient?.cuisineType}</h6>
            <h6><span style={!onTheme ? {color : "#A1E553"} : {color: "#E333E5"}}>Dish:</span> {ingredient?.dishType}</h6>
            <lu>
              <span style={!onTheme ? {color : "#A1E553"} : {color: "#E333E5"}}>Diet Labels:</span>
            {ingredient && ingredient.dietLabels.map((e,i)=>
              <li>{e}</li>
            )}
            </lu>
          </div>
          
        </div>

        <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                    <h3 style={!onTheme ? {color: "#A1E553"} : {color: "#E333E5"}}>Nutrition Value</h3>
                    <div style={{height:"90%", marginTop:"2%", fontSize:"18px"}}>
                      <ul className="ul-list">
                        {ingredient?.digest.map((e,i)=>{
                          return <li >{e.label}: {e.total}{e.unit}</li>
                        })}
                      </ul>
                    </div>
                </div>

                <div className="flip-card-back">
                    <h3 style={!onTheme ? {color: "#A1E553"} : {color: "#E333E5"}}>Ingredients</h3>
                    <div style={{height:"90%", marginTop:"2%", fontSize:"18px"}}>
                      <ul className="ul-list">
                        {ingredient?.ingredients.map((e,i)=>{
                          return <li >
                            {e.text}, 
                            <span style={!onTheme ? {color : "#A1E553"} : {color: "#E333E5"}}> Quantity: </span>
                            {e.quantity},
                            <span style={!onTheme ? {color : "#A1E553"} : {color: "#E333E5"}}> Weight: </span> {e.weight}g</li>
                        })}
                      </ul>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Ingredients;
