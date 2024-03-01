const pool = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { firstName, lastName, age, gender, email, password, role_id } =
    req.body;
  const Password = await bcrypt.hash(password, 7);
  const Email = email.toLowerCase();
  pool
    .query(
      `INSERT INTO users (firstName, lastName, age, gender, email, password, role_id) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [firstName, lastName, age, gender, Email, Password, role_id]
    )

    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Account created successfully",
      });
    })
    .catch((err) => {
      res.status(409).json({
        success: false,
        message: "The email already exists",
        err,
      });
    });
};

const login = (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const query = `SELECT * FROM users WHERE email = $1`;
  const data = [email.toLowerCase()];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length) {
        bcrypt.compare(password, result.rows[0].password, (err, response) => {
          if (err) res.json(err);
          if (response) {
            const payload = {
              userId: result.rows[0].id,
              role: result.rows[0].role_id,
            };
            const options = { expiresIn: "1d" };
            const secret = process.env.SECRET;
            const token = jwt.sign(payload, secret, options);
            if (token) {
              return res.status(200).json({
                token,
                success: true,
                message: `Valid login credentials`,
                userId:result.rows[0].id,
                private:result.rows[0].private,
                userInfo : result.rows[0],
                // userImage:result.rows[0].image
              });
            } else {
              throw Error;
            }
          } else {
            res.status(403).json({
              success: false,
              message: `The email doesn’t exist or the password you’ve entered is incorrect`,
            });
          }
        });
      } else throw Error;
    })
    .catch((err) => {
      res.status(403).json({
        success: false,
        message:
          "The email doesn’t exist or the password you’ve entered is incorrect",
        err,
      });
    });
};

const AddUserinfo = (req, res) => {
  const { weight, height, goal, image } = req.body;

  const user_id = req.token.userId;
  const value = [weight, height, goal, user_id, image];
  pool
    .query(`SELECT user_info.user_id  FROM user_info WHERE user_id=$1`, [
      user_id,
    ])
    .then((result) => {
      if (!result.rows.length) {
        pool
          .query(
            `INSERT INTO user_info (weight, height, goal,user_id,image) VALUES ($1,$2,$3,$4,$5) RETURNING*`,
            value
          )
          .then((result) => {
            res.status(200).json({
              success: true,
              message: "user_info created successfully",
              result: result.rows[0],
            });
          })
          .catch((err) => {
            res.status(500).json({
              success: false,
              message: "Server error",
              err: err,
            });
          });
      } else {
        res.status(201).json({
          success: false,
          message: "user have information ",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: error,
      });
    });
};

const getUserInfoByUserId = (req, res) => {
  const user_id = req.params.userId; 
  const value = [user_id];
  const query = `SELECT * FROM user_info INNER JOIN users On users.id=user_info.user_id WHERE user_id=$1`;
  pool
    .query(query, value)
    .then((result) => {
      if (result.rows.length) {
        res.status(201).json({
          success: true,
          message: `All Info For user_id=${user_id}`,
          info: result.rows[0],
        });
      } else {
        res.status(201).json({
          success: false,
          message: `No Info For User_id=${user_id}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};
const updateUserInfo = (req, res) => {
  const user_id = req.token.userId;
  const { height, weight, goal, image } = req.body;
  const value = [
    height || null,
    weight || null,
    goal || null,
    image || null,
    user_id,
  ];
  const query =
    "UPDATE user_info SET height=COALESCE($1,height) , weight=COALESCE($2,weight) , goal=COALESCE($3,goal), image=COALESCE($4,image) WHERE user_id=$5 RETURNING *";
  pool
    .query(query, value)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Update Successfully",
        updatedUserInfo: result.rows,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "server error ",
        err: err,
      });
    });
};

const getAllUsers = (req, res) => {
  pool
    .query(`SELECT * FROM users`)
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "No users found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "getting all users",
          data: result.rows,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    });
};

const getAllCoachs = (req, res) => {
  pool
    .query(
      `SELECT roles.role, users.firstname, users.lastname,users.firstname, users.age, users.gender
    FROM users 
    INNER JOIN roles
    ON users.role_id = roles.id 
    WHERE roles.role = 'COACH'`
    )
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Showing All Coaches",
        data: result.rows,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    });
};
module.exports = {
  register,
  login,
  getAllUsers,
  getAllCoachs,
  AddUserinfo,
  updateUserInfo,
  getUserInfoByUserId,
};
