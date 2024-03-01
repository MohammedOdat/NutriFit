const pool = require("../models/db");
const messagesModel = require('../models/GymMesseges');

const createGym = (req,res)=>{
    const userId = req.token.userId;
    const {name, description} = req.body;
    const image = "http://res.cloudinary.com/dvztsuedi/image/upload/v1708816631/adpmvtgi7dl1qjh0pgpm.jpg"
    const provider = [name, description,image, userId];
    pool.query(`SELECT * FROM gyms WHERE owner_id = $1 AND is_deleted = 0`, [userId]).then((result) => {
        if(result.rows.length > 3){
            res.status(403).json({
                success:false,
                message : `You can't Create more 3 Gym`
            })
        }else{
            pool.query(`INSERT INTO gyms (name , description, image, owner_id) VALUES ($1, $2, $3, $4)`, provider).then((result) => {
                res.status(201).json({
                    success : true,
                    message : "Gym created successfully",
                    gym : result.rows
                })
            }).catch((err) => {
                res.status(500).json({
                    success : false,
                    message : "Server error",
                    error : err.message
                })
            });
        }
    }).catch((err) => {
        
    });
}

const updateGym = (req,res)=>{
    const gymId = req.params.gymid;
    const {name,description, image}=req.body
    const value=[name, description||null, image || null, gymId];
    pool.query(`UPDATE gyms SET name=COALESCE($1,name), description=COALESCE($2,description), image=COALESCE($3, image) WHERE gyms.id=$4 RETURNING *`,value).then((result=>{
        res.status(201).json({
            success:true,
            message:`${name} Gym Updated Successfully`,
            gym:result.rows  
        })
        })).catch((err) => {
            res.status(500).json({
              success: false,
              message: "Server error",
              err
            });
          });
}
const getAllGym = (req, res)=>{
    let finalGym=[];
    let large=[];
    let smale=[];
    pool.query(`SELECT * FROM gyms WHERE gyms.owner_id != $1  AND gyms.is_deleted = 0`, [req.token.userId]).then((result) => {
        large=result.rows
        pool.query(`SELECT * FROM gym_user 
        INNER JOIN gyms ON gym_user.gym_id = gyms.id 
        WHERE gym_user.user_id = $1 
        AND gyms.owner_id != $1 AND gym_user.is_deleted=0`,[req.token.userId]).then((result1)=>{
            if(result1.rows.length===0){

                pool.query(`SELECT * FROM gym_coach
                INNER JOIN gyms ON gym_coach.gym_id = gyms.id 
                WHERE gym_coach.coach_id = $1 
                AND gym_coach.is_deleted=0 AND gyms.owner_id != $1`,[req.token.userId]).then((result2)=>
                {
            result2.rows.map((ele,i)=>{
                smale.push(ele.gym_id)
            })
           finalGym= large.filter((ele,i)=>{
                return !smale.includes(ele.id)
            })
           
            res.status(200).json({
            success : true,
            message : `All Gym`,
            gym : finalGym
            })
            }).catch((err)=>{
                    res.status(500).json({
                        success : false,
                        message : "Server error",
                        error : err.message
            })
            })

            }else{
                result1.rows.map((ele,i)=>{
                    smale.push(ele.gym_id)
                })
               finalGym= large.filter((ele,i)=>{
                    return !smale.includes(ele.id)
                })
               
                res.status(200).json({
                success : true,
                message : `All Gym`,
                gym : finalGym
            })
            }
       
       
        }).catch((err)=>{
            res.status(500).json({
                success : false,
                message : "Server error",
                error : err.message
        })
    })
       
    }).catch((err) => {
        res.status(500).json({
            success : false,
            message : "Server error",
            error : err.message })
        })
}

const getGymByGymId = (req,res)=>{
    const {gymId} = req.params;
    pool.query(`SELECT name, description, image, owner_id FROM gyms WHERE gyms.id = $1 AND is_deleted = 0`,[gymId]).then((result) => {
        res.status(200).json({
            success: true,
            message : `This Data For Gym :${result.rows[0].name}`,
            oneGym : result.rows[0]
        })
    }).catch((err) => {
        res.status(500).json({
            success : false,
            message : `Server Error`,
            error : err.message
        })
    });
}

const getGymByOwner = (req,res)=>{
    const userId = req.params.ownerId;
    pool.query(`SELECT * FROM gyms WHERE owner_id = $1 AND is_deleted = 0`, [userId]).then((result)=>{
        if(result.rows.length === 0){
            return res.status(200).json({
                success : true,
                message : `The User Does not have Gym`
            })
        }
        res.status(200).json({
            success : true,
            message : `All Gym By Owner`,
            result : result.rows
        })
    }).catch((err)=>{
        res.status(500).json({
            success : false,
            message : `Server Error`,
            error : err
        })
    })
}

const createPlan = (req,res)=>{
    const gymId = req.params.gymid;
    const {name, description, numOfMonth, price} = req.body;
    const provider = [name,description, numOfMonth,price, gymId];
    pool.query(`SELECT * FROM gym_plan WHERE gym_id = $1`, [gymId]).then((result) => {
        if(result.rows.length >= 3){
            res.status(201).json({
                success : true,
                message : `Can't Create more Plan`
            })
        }else{
            pool.query(`INSERT INTO gym_plan (name_plan ,description_plan, numOfMonth_plan ,price_plan, gym_id) VALUES ($1,$2,$3,$4,$5) RETURNING *`,provider).then((result)=>{
                res.status(201).json({
                    success : true,
                    message : `Created Plan For Gym Successfully`,
                    plan : result.rows
                })
            }).catch((err)=>{
                res.status(500).json({
                    success : false,
                    message : `Server error`,
                    erorr : err.message
                })
            });
        }
        
    }).catch((err) => {
        res.status(500).json({
            success : false,
            message : `Server error`,
            erorr : err.message
        })
    });
    
}

const getPlanByGymId = (req,res) =>{
    const gymId = req.params.gymid;
    pool.query(`SELECT gyms.name, gyms.description, * FROM gym_plan INNER JOIN gyms ON gym_plan.gym_id = gyms.id WHERE gym_plan.gym_id = $1`,[gymId]).then((result) => {
        res.status(201).json({
            success : true,
            message : `All Plan For Gym`,
            plans : result.rows
        })
    }).catch((err) => {
        res.status(500).json({
            success : false,
            message : `Server Error`,
            error : err
        })
    });
}   

const getPlanById = (req, res)=>{
    const planId = req.params.planid;

    pool.query(`SELECT gyms.name, gyms.description, * FROM gym_plan INNER JOIN gyms ON gym_plan.gym_id = gyms.id WHERE gym_plan.id_plan = $1`,[planId]).then((result) => {
        res.status(200).json({
            success : true,
            message : `Plan ${result.rows[0].name_plan}`,
            plan : result.rows[0]
        })
    }).catch((err) => {
        res.status(500).json({
            success: false,
            message : `Server Error`,
            error : err.message
        })
    });
}

const updatePlanById = (req,res)=>{
    const planId = req.params.planid;
    const {name,description, numOfMonth, price} = req.body;
    const value=[name ,description||null, numOfMonth || null, price || null, planId];
    pool.query(`UPDATE gym_plan SET name_plan=$1, description_plan=COALESCE($2,description_plan), numOfMonth_plan=COALESCE($3,numOfMonth_plan), price_plan=COALESCE($4,price_plan) WHERE gym_plan.id_plan=$5 RETURNING *`,value).then((result=>{
        res.status(201).json({
            success:true,
            message:`Plan Updated Successfully`,
            gym:result.rows  
        })
        })).catch((err) => {
            res.status(500).json({
              success: false,
              message: "Server error",
              error : err.message
            });
          });
}
const addNewUserInGym = (req,res)=>{
    const {gymId, planId, numOfMonth , userId} = req.body;
    const endSub = `CURRENT_TIMESTAMP + INTERVAL '${numOfMonth} months'`;
    const providerS = [userId, gymId, planId];

    pool.query(`SELECT * FROM gym_user WHERE gym_id = $1`, [gymId]).then((result) => {
        if(result.rows.length === 0){
            pool.query(`INSERT INTO gym_user(user_id, gym_id, plan_id, endSub) VALUES ($1,$2,$3,${endSub}) RETURNING *`, providerS).then((result) => {
                res.status(201).json({
                    success : true,
                    message : "User Add Successfully In Gym",
                    result : result.rows
                })
            }).catch((err) => {
                res.status(500).json({
                    success : false,
                    message : `Server error`,
                    error : err.message
                });
            });
        }else
        if(result.rows.length >= 50){
            res.status(201).json({
                success : true,
                message : `Max User`
            });
        }else{
            pool.query(`SELECT user_id FROM gym_user WHERE user_id = $1`,[userId]).then((result)=>{
                if(result.rows.length !== 0 ){
                    res.status(201).json({
                        success : true,
                        message : `The User Already Exist in Gym`
                    });
                    
                }else{
                    pool.query(`SELECT coach_id FROM gym_coach WHERE coach_id = $1`, [userId]).then((result)=>{
                        if(result.rows.length !== 0){
                            res.status(201).json({
                                success : false,
                                message : `The User Already Exist Coach In Gym`
                            })
                        }else{
                            pool.query(`INSERT INTO gym_user(user_id, gym_id, plan_id, endSub) VALUES ($1,$2,$3,${endSub}) RETURNING *`, providerS).then((result) => {
                                res.status(201).json({
                                    success : true,
                                    message : "User Add Successfully In Gym",
                                    result : result.rows
                                })
                            }).catch((err) => {
                                res.status(500).json({
                                    success : false,
                                    message : `Server error`,
                                    error : err.message
                                });
                            });
                        }
                    })
        
                }
                
            })
        }
    }).catch((err) => {
        res.status(500).json({
            success : false,
            message : "Server Error",
            error : err.message
        })
    });
    

}

const downCoachToUser = (req,res)=>{
    const {gymid , userid , name_plan} = req.body;

    pool.query(`SELECT * FROM gym_plan WHERE gym_plan.name_plan = $1 AND gym_id = $2`, [name_plan, gymid]).then((plan) => {
        const endSub = `CURRENT_TIMESTAMP + INTERVAL '${plan.rows[0].numofmonth_plan} months'`;
        if(plan.rows.length){
            pool.query(`DELETE FROM gym_coach WHERE gym_coach.coach_id = $1 AND gym_coach.gym_id = $2`, [userid, gymid]).then((resultcoach) => {
                pool.query(`INSERT INTO gym_user(user_id, gym_id, plan_id, endSub) VALUES ($1,$2, ${plan.rows[0].id_plan}, ${endSub}) RETURNING *`, [userid, gymid]).then((result) => {
                    res.status(201).json({
                        success : true,
                        message : "User Add Successfully In Gym",
                        result : result.rows
                    })
                }).catch((err) => {
                    res.status(500).json({
                        success : false,
                        message : `Server error`,
                        error : err.message
                    });
                });
            }).catch((err) => {
                res.status(500).json({
                    success : false,
                    message : `Server error`,
                    error : err.message
                });
            });
            
        }else{
            res.status(200).json({
                success : false,
                message : `This Plan not Exist`,
                plan : result.rows
            })
        }
        
    }).catch((err) => {
        res.status(500).json({
            success : false,
            message : `Server Error`,
            error : err
        })
    });
}

const getAllUserInGym = (req,res)=>{
    const {gymId} = req.params;
    const provider = [gymId]
    pool.query(`
    SELECT users.*, gym_plan.* , gym_user.*, user_info.image
    FROM gym_user 
    INNER JOIN users ON gym_user.user_id = users.id 
    INNER JOIN gym_plan ON gym_plan.id_plan = gym_user.plan_id 
    INNER JOIN user_info on user_info.user_id = gym_user.user_id
    WHERE gym_user.gym_id = $1 AND gym_user.is_deleted = 0`, provider).then((result) => {
        if(!result.rows.length){
            res.status(200).json({
                success : true,
                message : `No User In Gym`,
                users : result.rows
            });
        }else{
            res.status(200).json({
                success : true,
                message : `All User In Gym`,
                users : result.rows
            });
        }

    }).catch((err) => {
        res.status(500).json({
            success : false,
            message : `Error server`,
            err
        });
    });
}

const getAllGymByUserId = async (req,res) =>{
    const {userId} = req.params;
    pool.query(`SELECT * FROM gym_user 
    INNER JOIN gyms ON gym_user.gym_id = gyms.id 
    WHERE gym_user.user_id = $1 
    AND gyms.owner_id != $1`,[userId]).then((result) => {
        if(!result.rows.length){
            pool.query(`SELECT * FROM gym_coach
            INNER JOIN gyms ON gym_coach.gym_id = gyms.id 
            WHERE gym_coach.coach_id = $1 
            AND gyms.owner_id != $1`, [userId]).then((result) => {
                res.status(200).json({
                    success : true,
                    message :`All gyms in which the user is joined => ${userId}`,
                    gyms : result.rows
                })
            }).catch((err) => {
                res.status(500).json({
                    success : false,
                    message : `Server Error`,
                    error : err
                })
            });
        }else{
            res.status(200).json({
                success : true,
                message :`All gyms in which the user is joined => ${userId}`,
                gyms : result.rows
            })
        }
        
    }).catch((err) => {
        res.status(500).json({
            success : false,
            message : `Server Error`,
            error : err
        })
    });
}

const deleteUserInGym = async(req,res)=>{
    const userId = req.token.userId;
    const {gymId} = req.body;
    const provider = [gymId,userId];
    await pool.query(`UPDATE gym_user SET is_deleted =1 WHERE user_id = $2 AND gym_id = $1`, provider).then(async(result) => {
        res.status(201).json({
            success : true,
            message : `User Delete Successfully In Gym`,
            result : result
        });

        
    }).catch((err) => {
        res.status(500).json({
            success : false,
            message : `Server Error`,
            error : err.message
        });
    });
}


const addNewCoachInGym = (req,res) =>{
    const {gymId, coachId} = req.body;
    const provider = [gymId, coachId];
    pool.query(`DELETE FROM gym_user WHERE gym_user.user_id = $2 AND gym_user.gym_id = $1`,[gymId, coachId]).then((result) => {
        pool.query(`SELECT * FROM gym_coach WHERE coach_id = $2 AND gym_id = $1`, provider).then((result) => {
            if(!result.rows.length){
                pool.query(`INSERT INTO gym_coach (gym_id, coach_id) VALUES ($1,$2) RETURNING *`, provider).then((result) => {
                    res.status(201).json({
                        success : true,
                        message : `Coach Add Successfully In Gym`,
                        result : result.rows
                    });
                }).catch((err) => {
                    res.status(500).json({
                        success : false,
                        message : `Server Error`,
                        error : err.message
                    });
                });
            }else{
                res.status(200).json({
                    success: false,
                    message : 'The User Already in Coach'
                })
            }
        }).catch((err) => {
            res.status(500).json({
                success : false,
                message : `Server Error`,
                error : err.message
            });
        });

    }).catch((err) => {
        res.status(500).json({
            success : false,
            message : `Server Error`,
            error : err.message
        });
    });
}

const createRoomInGym = (req, res)=>{
    const gymId = req.params.gymid;
    const {name} = req.body;
    const provider = [name, gymId];
    pool.query(`INSERT INTO room_gym (name, gym_id) VALUES ($1,$2) RETURNING *`, provider).then((result) => {
        res.status(201).json({
            success : true,
            message : `Created Room Successfully`,
            room : result.rows
        })
    }).catch((err) => {
        res.status(500).json({
            success : false,
            message : `Server Error`,
            error : err
        })
    });
}

const getRoomByIdRoom = (req,res)=> {
    const {gymid, roomid} = req.params;
    const provider = [gymid, roomid];
    pool.query(`SELECT * FROM room_gym WHERE room_id = $2 AND gym_id = $1`, provider).then((result) => {
        res.status(201).json({
            success : true,
            message : `Room By Id : ${roomid} For Gym Id : ${gymid}`,
            room : result.rows
        })
    }).catch((err) => {
        res.status(500).json({
            success : false,
            message : `Server Error`,
            error : err
        })
    });
}

const getAllRoomByGymId = (req,res)=>{

}

const getAllCoachInGym = (req,res)=>{
    const {gymId} = req.params;
    const provider = [gymId];
    pool.query(`SELECT users.*, user_info.image, gym_coach.* FROM gym_coach 
    INNER JOIN users ON gym_coach.coach_id = users.id
    INNER JOIN user_info on user_info.user_id = gym_coach.coach_id
     WHERE gym_coach.gym_id = $1`, provider).then((result) => {
        res.status(200).json({
            success : true,
            message : `All Coach In Gym`,
            coachs : result.rows
        });
    }).catch((err) => {
        res.status(500).json({
            success : false,
            message : `Error server`,
            err
        });
    });
}

const deleteCoachInGym = async(req,res)=>{
    const coachId = req.token.userId;
    const {gymId} = req.body;
    const provider = [gymId,coachId];
    await pool.query(`UPDATE gym_coach SET is_deleted = 1 WHERE coach_id = $2 AND gym_id = $1`, provider).then(async(result) => {
        res.status(201).json({
            success : true,
            message : `Coach Delete Successfully In Gym`,
            result : result
        });

        
    }).catch((err) => {
        res.status(500).json({
            success : false,
            message : `Server Error`,
            error : err.message
        });
    });
}

const getMessageByPlanName = (req,res)=>{
    const {gym_id, plan_name} = req.params;

    messagesModel.findOne({gymId : gym_id, planName : plan_name}).then((result) => {
        res.status(200).json({
            success : true,
            messages : result.messages
        });
    }).catch((err) => {
        res.status(500).json({
            success : false,
            message : `Server Error`,
            error : err
        });
    });

}
module.exports = {
    createGym,
    addNewCoachInGym,
    addNewUserInGym,
    getAllGymByUserId,
    getAllGym,
    getAllUserInGym,
    getAllCoachInGym,
    deleteUserInGym,
    deleteCoachInGym,
    createPlan,
    getPlanByGymId,
    getPlanById,
    getGymByOwner,
    createRoomInGym,
    getRoomByIdRoom,
    getAllRoomByGymId,
    getGymByGymId,
    updateGym,
    updatePlanById,
    downCoachToUser,
    getMessageByPlanName
}


