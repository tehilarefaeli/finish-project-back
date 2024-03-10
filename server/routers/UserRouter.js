const { Router } = require("express");
const express = require("express");

const app = express();

const { mysqlConnection } = require("../sql/sql");

const userRouter = Router();

userRouter.get("/getUsersExist/:email/:password", (req, res) => {
  const email = req.params.email;
  const password = req.params.password;
  const sql = `SELECT * FROM mydb.users WHERE email = '${email}'AND password = '${password}';`;
  mysqlConnection.query(sql, [email, password], (err, rows) => {
    if (!err) res.send(`Email: ${email}, Password: ${password}`);
    else console.log(err);
  });
});

userRouter.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  if (!name || !email || !password) {
    return res.status(400).send({ message: 'Please fill all inputs' });
  }

  const sql = `INSERT INTO users (email, password, name) VALUES ( ?, ?, ?);`;
  mysqlConnection.query(sql, [email, password, name], (err) => {
    if (!err) res.send("POST User details successfully");
    else {
      console.log(err);
      res.status(400).send({ message: err.message });
    }
  });
});

userRouter.post("/login", (req, res) => {
  console.log(req.body);
  mysqlConnection.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [req.body.email, req.body.password],
    (err, rows) => {
      if (!err) {
        const user = rows[0];
        if (!user) {
          return res.status(401).send("Invalid credentials");
        } else {
          return res.json(user);
        }
      }
      res.send(err);
    }
  );
  //
});

userRouter.get("/getUsers", (req, res) => {
  mysqlConnection.query(
    "SELECT userName,country,language,email,permission  FROM users",
    (err, rows) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

module.exports = userRouter;
