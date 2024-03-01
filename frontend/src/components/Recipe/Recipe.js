import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import axios from "axios";
import "./Recipe.css";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import chicken from '../assets/chicken.png';
import chocolate from '../assets/chocolate.png';
import fish from '../assets/fish.png';
import mango from '../assets/mango.png';
import meat  from '../assets/meat.png';
import rice from '../assets/rice.png';
import spaghetti from '../assets/spaghetti.png';


const Recipe = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [calorieRange, setCalorieRange] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [visibleItems, setVisibleItems] = useState(15);
  const [onTheme, setOnTheme] = useState(false);
  const { token,theme } = useSelector((state) => {
    return {
      token: state.auth.token,
      userId: state.auth.userId,
      theme : state.auth.theme
    };
  });
  useEffect(()=>{
    if(theme === "female"){
      setOnTheme(true);
    }else{
      setOnTheme(false);
    }
  },[theme]);
  const fetchRecipes = (query) => {
    axios
      .get(
        `https://api.edamam.com/search?q=${query}&app_id=8fe04fdd&app_key=71c0b5bf11e8df07b68092d65bde92da&from=0&to=${visibleItems}&calories=0-2000&health=alcohol-free`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      .then((response) => {
        setRecipes(response.data.hits);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderRecipes = (query) => {
    fetchRecipes(query);
  };

  useEffect(() => {
    fetchRecipes("");
  }, [visibleItems]);

  const handleShowMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 10);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    if (query.trim() === "") {
      setFilteredRecipes([]);
    } else {
      fetchRecipes(query);
    }
  };
  const handleDropdownChange = (from, to) => {
    const newArr = recipes.filter(
      (ele, i) => ele.recipe.calories >= from && ele.recipe.calories <= to
    );
    setFilteredRecipes(newArr);
    setIsDropdownOpen(false);
  };

  const gen = ()=>{
    const cardRecipe = [];

    {filteredRecipes?.length ? filteredRecipes.map((recipe, index) => (
      cardRecipe.push(
        <Col key={index} style={{ width:"fit-content"}}>
          <Card 
            style={{
              width: "18rem",
              height: "fit-content",
              display: "flex",
              border:"0"
            }}
            onClick={() => {
              const uri = recipe.recipe.uri.split("_");
              navigate(`/recipe/${uri[1]}/ingredients`);
            }}
          >
            <Card.Img
              variant="top"
              src={recipe.recipe.image}
              rounded
              className="image_card"
              style={{ height: "256px", objectFit:"fit", borderRadius:"4px 4px 0 0 "}}
            />
            <Card.Body
              style={{ color: "#272727", background: "#e9e9e9" }}
            >
              <Card.Title style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}> {recipe.recipe.label}</Card.Title>
              <Card.Text></Card.Text>
              
            </Card.Body>
            <div style={{ display: "flex", width: "100%" ,borderTop:"1px solid gray", borderBottom:"1px solid gray", marginBottom:"8px"}}>
                <div style={{ width: "50%", textAlign: "center" , borderRight:"1px solid gray",  margin:"4px" }}>
                  {
                    (recipe.recipe.calories = parseInt(recipe.recipe.calories)) + " CALORIES"
                  }
                  
                </div>
                <div style={{ width: "50%", textAlign: "center" , margin:"4px"}}>
                  {recipe.recipe.ingredients.length + " INGREDIENTS"}
                  
                </div>
              </div>
          </Card>
        </Col>
      )
      ))
      
    : recipes?.slice(0, visibleItems).map((recipe, index) => (
      cardRecipe.push(
        <Col key={index} style={{ width:"fit-content"}}>
          <Card 
            style={{
              width: "18rem",
              height: "fit-content",
              display: "flex",
              border:"0"
            }}
            onClick={() => {
              const uri = recipe.recipe.uri.split("_");
              navigate(`/recipe/${uri[1]}/ingredients`);
            }}
          >
            <Card.Img
              variant="top"
              src={recipe.recipe.image}
              rounded
              className="image_card"
              style={{ height: "256px", objectFit:"fit", borderRadius:"4px 4px 0 0 "}}
            />
            <Card.Body
              style={{ color: "#272727", background: "#e9e9e9" }}
            >
              <Card.Title style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}> {recipe.recipe.label}</Card.Title>
              <Card.Text></Card.Text>
              
            </Card.Body>
            <div style={{ display: "flex", width: "100%" ,borderTop:"1px solid gray", borderBottom:"1px solid gray", marginBottom:"8px"}}>
                <div style={{ width: "50%", textAlign: "center" , borderRight:"1px solid gray",  margin:"4px" }}>
                  {
                    (recipe.recipe.calories = parseInt(recipe.recipe.calories)) + " CALORIES"
                  }
                  
                </div>
                <div style={{ width: "50%", textAlign: "center" , margin:"4px"}}>
                  {recipe.recipe.ingredients.length + " INGREDIENTS"}
                  
                </div>
              </div>
          </Card>
        </Col>
      )
      ))}
      return <Row xs={1} md={10} className="g-2" style={{backgroundColor:"#101010", border:'0', display:"flex", justifyContent:"center"}}>{cardRecipe}</Row>
  }


  return (
    <div className="recipe">
        <div className="search_bar">
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={handleSearchChange}
            className="searchbar"
          />
          <Dropdown id="dropDown" >
            <Dropdown.Toggle  aria-expanded="false" variant="outline-secondary">
              {calorieRange ? `${calorieRange} Calories` : "Filter"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  setCalorieRange("");
                  handleDropdownChange(0, 99999999999);
                }}
              >
                No Filter
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setCalorieRange("0-200");
                  handleDropdownChange(0, 200);
                }}
              >
                0-200 Calories
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setCalorieRange("201-400");
                  handleDropdownChange(201, 400);
                }}
              >
                201-400 Calories
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setCalorieRange("401-600");
                  handleDropdownChange(401, 600);
                }}
              >
                401-600 Calories
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setCalorieRange("601-800");
                  handleDropdownChange(601, 800);
                }}
              >
                601-800 Calories
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setCalorieRange("801-1000");
                  handleDropdownChange(801, 1000);
                }}
              >
                801-1000 Calories
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="recipe_buttons">
          <button style={{border:"0", padding:"10px", borderRadius:"4px", fontWeight:"bold", display:"flex", gap:"4px"}} onClick={()=>{
            renderRecipes("chicken")

          }}>
           <img src={chicken} style={{width:"24px"}}/>
            <span>Chicken</span>
            </button>

          <button style={{border:"0", padding:"10px", borderRadius:"4px", fontWeight:"bold", display:"flex", gap:"4px"}} onClick={()=>{
            renderRecipes("mango")
          }}>
            <img src={mango} style={{width:"24px"}}/>
            <span>Mango</span>
            </button>

          <button style={{border:"0", padding:"10px", borderRadius:"4px", fontWeight:"bold", display:"flex", gap:"4px"}} onClick={()=>{
            renderRecipes("spaghetti")
          }}>
            <img src={spaghetti} style={{width:"24px"}}/>
            <span>Spaghetti</span>
            </button>


          <button style={{border:"0", padding:"10px", borderRadius:"4px", fontWeight:"bold", display:"flex", gap:"4px"}} onClick={()=>{
            renderRecipes("chocolate")
          }}>
            <img src={chocolate} style={{width:"24px"}}/>
            <span>Chocolate</span>
            </button>

          <button style={{border:"0", padding:"10px", borderRadius:"4px", fontWeight:"bold", display:"flex", gap:"4px"}} onClick={()=>{
            renderRecipes("fish")
          }}><img src={fish} style={{width:"24px"}}/>
            <span>Fish</span>
            </button>

          <button style={{border:"0", padding:"10px", borderRadius:"4px", fontWeight:"bold" , display:"flex", gap:"4px"}} onClick={()=>{
            renderRecipes("rice")
          }}><img src={rice} style={{width:"24px"}}/>
            <span>Rice</span></button>

          <button style={{border:"0", padding:"10px", borderRadius:"4px", fontWeight:"bold", display:"flex", gap:"4px"}} onClick={()=>{
            renderRecipes("meat")
          }}><img src={meat} style={{width:"24px"}}/>
            <span>Meat</span></button>

        </div>

        <div>
            <div>{gen()}</div>
            
        </div>

        {!calorieRange && <p onClick={handleShowMore} style={
          !onTheme?{color:"#A1E335"}:{color:"#E333E5"}} className="show">Show More....</p>}
        
    </div>
  );
};

export default Recipe;
