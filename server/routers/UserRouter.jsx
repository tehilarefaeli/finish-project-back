const { Router } = require('express');
const { mysqlConnection } = require('../sql/sql');
const mysql = require('node-mysql');

const userRouter = Router();

 userRouter.get('/getUsers', (req, res) => {
 mysqlConnection.query('SELECT userName,country,language,email,permission  FROM users', (err, rows) => {
        if (!err)
           res.send(rows);
       else
            console.log(err);
   })
})

module.exports = userRouter;
