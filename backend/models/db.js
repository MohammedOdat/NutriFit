const { Pool } = require("pg");
console.log(process.env.SECRET);
const connectionString = process.env.DB_URL;




const pool = new Pool({

  connectionString,
});

pool.connect((err, pool) => {
  if (err) {
    console.error("Pool error: ", err.message, err.stack);
    return;
  }
  console.error("Pool connected on: ", pool.user);
});
module.exports = pool;

const createTable = () => {
  pool
    .query(`
    CREATE TABLE roles (
      id SERIAL NOT NULL,
      role VARCHAR(255) NOT NULL,
      PRIMARY KEY (id)
  );
  CREATE TABLE permissions (
      id SERIAL NOT NULL,
      permission VARCHAR(255) NOT NULL,
      PRIMARY KEY (id)
      );
  
  CREATE TABLE role_permission (
      id SERIAL NOT NULL,
      role_id INT,
      permission_id INT,
      FOREIGN KEY (role_id ) REFERENCES roles (id),
      FOREIGN KEY (permission_id) REFERENCES permissions (id),
      PRIMARY KEY (id)
  );
  
  
  CREATE TABLE users(
      id SERIAL NOT NULL,
      firstName VARCHAR(255),
      lastName VARCHAR(255),
      age INT,
      private SMALLINT DEFAULT 0,
      gender VARCHAR(255),
      image VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      role_id INT,
      FOREIGN KEY (role_id) REFERENCES roles(id),
      is_deleted SMALLINT DEFAULT 0,
      PRIMARY KEY (id),
      created_at TIMESTAMP DEFAULT NOW()
  );
  
  
  CREATE TABLE user_info (
      id SERIAL NOT NULL,
      weight VARCHAR(255),
      height VARCHAR(255),
      goal VARCHAR(255),
      user_id INT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      is_deleted SMALLINT DEFAULT 0,
      PRIMARY KEY (id)
  );
  
  CREATE TABLE gyms(
      id SERIAL NOT NULL,
      name VARCHAR(255),
      description TEXT,
      image VARCHAR(255),
      owner_id INT,
      FOREIGN KEY (owner_id) REFERENCES users(id),
      is_deleted SMALLINT DEFAULT 0,
      PRIMARY KEY (id)
  );
  CREATE TABLE gym_plan(
      id_plan SERIAL NOT NULL PRIMARY KEY,
      name_plan VARCHAR(255),
      description_plan TEXT,
      numOfMonth_plan INT,
      price_plan INT,
      gym_id INT,
      FOREIGN KEY (gym_id) REFERENCES gyms(id),
      is_deleted SMALLINT DEFAULT 0
  );
  CREATE TABLE coach_plan(
      id SERIAL NOT NULL PRIMARY KEY,
      name VARCHAR(255),
      description TEXT,
      numOfMonth INT,
      price INT,
      coach_id INT,
      FOREIGN KEY (coach_id) REFERENCES users(id),
      is_deleted SMALLINT DEFAULT 0
  );
  CREATE TABLE gym_user(
      id SERIAL NOT NULL,
      user_id INT,
      gym_id INT,
      plan_id INT,
      endSub TIMESTAMP DEFAULT NULL,
      created_at_plan TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (gym_id) REFERENCES gyms(id),
      FOREIGN KEY (plan_id) REFERENCES gym_plan(id),
      is_deleted SMALLINT DEFAULT 0,
      PRIMARY KEY (id)
  );
  
  CREATE TABLE gym_coach(
     id SERIAL NOT NULL,
      coach_id INT,
      gym_id INT,
      FOREIGN KEY (coach_id) REFERENCES users(id),
      FOREIGN KEY (gym_id) REFERENCES gyms(id),
      is_deleted SMALLINT DEFAULT 0,
      PRIMARY KEY (id)
  );
  
  CREATE TABLE room_user(
      id SERIAL NOT NULL,
      plan_id INT,
      user_id INT,
      coach_id INT,
      endSub TIMESTAMP DEFAULT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (coach_id) REFERENCES users(id),
      FOREIGN KEY (plan_id) REFERENCES coach_plan(id),
      is_deleted SMALLINT DEFAULT 0,
      PRIMARY KEY (id),
      created_at TIMESTAMP DEFAULT NOW()
  );
    `
    )
    .then((result) => {
      console.log("result", result);
    })
    .catch((err) => {
      console.log(err);
    });
};


const insertData = () => {
  pool
    .query(`
    INSERT INTO roles(role) VALUES ('USER');
    INSERT INTO roles(role) VALUES ('COACH');
    INSERT INTO roles(role) VALUES ('ADMIN');
    
    
    
    INSERT INTO users(firstName, lastName, age, email, password,role_id) VALUES ('Yousef', 'Abuaqel', 23, 'usfaql@gmail.com', '1234@', 2);
    INSERT INTO users(firstName, lastName, age, email, password,role_id) VALUES ('Mohammed', 'Odat', 26, 'mohammed@gmail.com', '1234@', 1);
    INSERT INTO users(firstName, lastName, age, email, password,role_id) VALUES ('Hamzeh', 'Odeh', 25, 'hamzeh@gmail.com', '1234@', 3);
    `
    )
    .then((result) => {
      console.log("result", result);
    })
    .catch((err) => {
      console.log(err);
    });
};

  //createTable();
  //insertData();