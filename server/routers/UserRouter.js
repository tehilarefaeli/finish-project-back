const { Router } = require('express');
const { mysqlConnection } = require('../sql/sql');
const mysql = require('node-mysql');

const userRouter = Router();

userRouter.get('/getUsersExist/:email/:password', (req, res) => {
    const email = req.params.email;
    const password = req.params.password;
    const sql = `SELECT * FROM mydb.users WHERE email = '${email}'AND password = '${password}';`;
    mysqlConnection.query(sql, [email, password], (err, rows) => {
        if (!err)
            res.send(rows);

        else
            console.log(err);
    })
})

userRouter.post('/RegisterUser', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const age = req.body.age;
    const name = req.body.name;

    const sql = `INSERT INTO mydb.users (email, password, age, name) VALUES ('${email}', '${password}', '${age}', ${name});`;
    mysqlConnection.query(sql, [email, password, age, name], (err) => {
        if (!err)
            res.send('POST User details successfully');
        else
            console.log(err);
    })
})




module.exports = userRouter;