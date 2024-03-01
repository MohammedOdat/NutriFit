const pool = require("../models/db");
const PrivateMessagesModel=require('../models/PrivateMessage')
const activePrivate=(req,res)=>{
  const coach_id=req.token.userId
  const value=[coach_id]
  const query=`UPDATE users SET private=1 WHERE id=$1 RETURNING *;`
  pool.query(query,value).then((result)=>{
    res.status(201).json({
      success:true,
      message:`You'r Private Is Active Now`,
      result :result.rows
    })
  })   .catch((err) => {
    res.status(500).json({
      success: false,
      message: "Server error",
      err
    });
  });
}
const disActivePrivate=(req,res)=>{
  const coach_id=req.token.userId
  const value=[coach_id]
  const query=`UPDATE users SET private=0 WHERE id=$1 RETURNING *;`
  pool.query(query,value).then((result)=>{
    res.status(201).json({
      success:true,
      message:`You'r Private Is DisActive Now`,
      result :result.rows[0]
    })
  })   .catch((err) => {
    res.status(500).json({
      success: false,
      message: "Server error",
      err
    });
  });
}
const getAllCoachsAreOpenPrivate=(req,res)=>{ ///////////////////////
  const query=`SELECT * FROM users WHERE private=1`
  pool.query(query).then((result)=>{
    if(!result.rows.length){
      res.status(404).json({
        success:false,
        message:'No Coach Are Open The Private'
      })
    }else{
       res.status(201).json({
      success:true,
      message:'All Coachs Are Open the Private',
      coachs:result.rows
    })
    }
   
  }).catch((err) => {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  });
}
const createNewPlane = (req, res) => {

  const coach_id = req.token.userId;
  const { name, description, price, numOfMonth } = req.body;
  
  const value = [name, description, price, numOfMonth, coach_id];
  const query = `INSERT INTO coach_plan (name,description,price,numOfMonth,coach_id) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
  const query_1=`SELECT * FROM coach_plan WHERE coach_id=$1`
  pool.query(query_1,[coach_id]).then((result)=>{
    if(result.rows.length<3){
       pool
    .query(query, value)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Plane created successfully",
        Plan: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error Query",
        err
      });
    });
    }else{
      res.status(201).json({
        success: false,
        message: "You Can't Add More Than 3 Plans",
      })
    }
  }).catch((err) => {
    res.status(500).json({
      success: false,
      message: "Server error query_1",
      err
    });
  });

 
};
const getAllPlanByCoachId =(req,res)=>{
  const coach_id=req.params.coachid;
  const value=[coach_id];
  const query=`SELECT * FROM coach_plan 
  WHERE coach_id=$1
ORDER BY price ASC; `
  pool.query(query,value).then((result)=>{
    if(result.rows.length){
      res.status(201).json({
        success:true,
        message:`All Plans For Coach_id=${coach_id}`,
        plans:result.rows
      })
    }else{
      res.status(404).json({
        success:false,
        message:`NO Plans For Coach_id=${coach_id} Yet`
      })
    }
  }) .catch((err) => {
    res.status(500).json({
      success: false,
      message: "Server error",
      err
    });
  });

}
const AddUserToPrivate = (req, res) => {
  const { plan_id, coach_id} = req.body;
  const user_id =req.token.userId;
  const value = [plan_id, coach_id, user_id];
  pool.query(`SELECT * FROM coach_plan WHERE id=$1`, [plan_id]).then((result) => {
    const numOfMonth = result.rows[0].numofmonth;
    const endSub = `CURRENT_TIMESTAMP + INTERVAL '${numOfMonth} months'`;
    const query = `INSERT INTO room_user (plan_id, coach_id, user_id, endSub) 
    VALUES ($1, $2, $3,${endSub}) 
    RETURNING *;`;
    const query_1=`SELECT user_id FROM room_user 
    WHERE user_id=$1 AND plan_id=$2`
    pool.query(query_1,[user_id, plan_id]).then((result)=>{
  if(result.rows.length){
    res.status(201).json({
      success : false,
      message : `The User Already Exist In This Plan`
  })
  }else{
    pool
      .query(query, value)
      .then((result) => {
        res.status(201).json({
          success: true,
          message: "User Add successfully",
          user: result.rows,
        });
      })
  }
    }).catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          err
        });
      });
    
  }).catch((err) => {
    res.status(500).json({
      success: false,
      message: "Server error Search Plan",
      err
    });
  });

};
const getAllUserByPlanId=(req,res)=>{
  const plan_id=req.params.idplan;
  const value=[plan_id];
  const query=`SELECT room_user.user_id, users.firstName, room_user.endSub
  FROM room_user
  JOIN users ON room_user.user_id = users.id
  WHERE room_user.plan_id = $1;
  `
  pool.query(query,value).then((result)=>{
    if(result.rows.length){
      res.status(201).json({
        success:true,
        message:`All Users IN Plan_id=${plan_id}`,
        users:result.rows,
        countUser : result.rows.length
      })
    }else{
      res.status(404).json({
        success:false,
        message:`NO Users IN Plan_id=${plan_id} Yet`
      })
    }
  }) .catch((err) => {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  });
}
const removeUserFromPrivate = (req, res) => {
  const {user_id,coach_id} = req.body;
  const value = [user_id,coach_id];
  const query = `UPDATE room_user SET is_deleted=1 WHERE user_id=$1 AND coach_id=$2`;
  pool
    .query(query, value)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "User Deleted successfully",
        user: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err
      });
    });
};
const getAllUserByCoachId=(req,res)=>{
  const coach_id=req.token.userId
  const value=[coach_id]
  const query=`SELECT room_user.user_id,room_user.coach_id,room_user.endsub, users.firstName,users.lastName,room_user.plan_id, room_user.endSub,
  coach_plan.name
  FROM room_user
  JOIN users ON room_user.user_id = users.id
  JOIN coach_plan ON room_user.plan_id=coach_plan.id
  WHERE room_user.coach_id =$1 AND room_user.is_deleted=0;
  `
  pool.query(query,value).then((result)=>{
    if(!result.rows.length){
      res.status(201).json({
        success:false,
        message:"There Is No User Yet"
      })
    }else{
      res.status(201).json({
        success:true,
        message:`All User For Coach_Id=${coach_id}`,
        users:result.rows
      })
    }
  }) .catch((err) => {
    res.status(500).json({
      success: false,
      message: "Server error",
      err
    });
  });
}

const getAllCoachesByUserId=(req,res)=>{
  const user_id=req.token.userId
  const value=[user_id]
  const query=`SELECT room_user.* , users.firstname ,users.lastname,user_info.image FROM  users
  JOIN room_user ON room_user.coach_id=users.id
  JOIN user_info ON user_info.user_id=users.id
  WHERE room_user.user_id=$1 AND room_user.is_deleted =0`
  pool.query(query,value).then((result)=>{
    if(result.rows.length){
      res.status(201).json({
        success:true,
        message:"All Coach By User",
        coachs:result.rows
      })
    }else{
      res.status(201).json({
        success:true,
        message:"You are not registered with any coach ",
     })
  }
}).catch((err) => {
  res.status(500).json({
    success: false,
    message: "Server error",
    err
  });
});
}

const filterCoachs = (req,res)=>{
  const {userId} = req.token;
  const query1 = `SELECT users.*,user_info.image
  FROM users
  JOIN user_info ON user_info.user_id=users.id
  WHERE private = 1`
  const query2 = `SELECT room_user.* , users.firstname ,users.lastname FROM room_user 
  JOIN users ON room_user.coach_id=users.id
  WHERE room_user.user_id=$1 AND room_user.is_deleted =0`;
  let result1;
  const coachs=[]
  let finalCoach
  pool.query(query1).then((result) => {
    if(result.rows.length){
      
      result1 = result.rows;
      // result1.map((ele,i)=>{
      //   coachs.push(ele.id)
      // })

      pool.query(query2, [userId]).then((result2) => {
        // result = result2.rows;
        result2.rows.map((ele,i)=>{
             coachs.push(ele.coach_id)})
      finalCoach= result1.filter((ele,i)=>{
       return !coachs.includes(ele.id)
       
      })
        res.status(201).json({
          success:true,
          message:"All Coachs Opened Private",
          coachs:finalCoach
        })
      }).catch((err) => {
        res.status(500).json({
          success:true,
          message:"Server Error",
          error : err.message
        });
      });
    }
  }).catch((err) => {
    res.status(500).json({
      success:true,
      message:"Server Error",
      error : err.message
    })
  });
}
const updatePlanByName=(req,res)=>{
  const {name,description,numOfMonth,price}=req.body
  const value=[name,description||null,numOfMonth||null,price||null]
  const query=`UPDATE coach_plan SET description=COALESCE($2,description) , numOfMonth=COALESCE($3,numOfMonth),price=COALESCE($4,price) WHERE name=$1 RETURNING *;`
  pool.query(query,value).then((result=>{
    res.status(201).json({
      success:true,
      message:`${name} Plan Updated Successfully`,
      plan:result.rows
      
    })
  })).catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err
      });
    });
}
const removePlanByName=(req,res)=>{
  const {name} =req.body
  const query=`DELETE FROM coach_plan WHERE name=$1`
  pool.query(query,[name]).then((result)=>{
    res.status(200).json({
      success:true,
      message:`${name} plan Deleted Successfully`
    })

  }).catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err
      });
    });
}
const getPlanById=(req,res)=>{
const id=req.params.plan_id
const value=[id]
const query=`SELECT coach_plan.* ,users.firstname ,users.lastname FROM coach_plan 
JOIN users ON coach_plan.coach_id=users.id
WHERE coach_plan.id=$1 `
pool.query(query,value).then((result)=>{
  res.status(201).json({
    success:true,
    message:`all information about Plan With Id =${id}`,
    plan:result.rows[0]
  })
}).catch((err) => {
  res.status(500).json({
    success: false,
    message: "Server error",
    err
  });
});
}

const getMessageByPrivate = (req,res)=>{
  const {coach_id, user_id} = req.params;

  PrivateMessagesModel.findOne({coach_id,user_id}).then((result) => {
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
  createNewPlane,
  AddUserToPrivate,
  removeUserFromPrivate,
  getAllPlanByCoachId,
  getAllUserByPlanId,
  activePrivate,
  disActivePrivate,
  getAllCoachsAreOpenPrivate,
  getAllUserByCoachId,
  getAllCoachesByUserId,
  updatePlanByName,
  removePlanByName,
  getPlanById,
  getMessageByPrivate,
  filterCoachs
};
