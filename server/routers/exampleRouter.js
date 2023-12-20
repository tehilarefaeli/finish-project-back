// const { Router } = require('express');
// const { mysqlConnection } = require('../sql/sql');
// const { use } = require('./servicesRouter');
// //const { checkEmail, signup } = require('../actions/actions');

// const userRouter = Router();


// //עובד מצוין חוץ מזה שצריך לערוך את כל הנתונים
// //איך לעשות שדות אפצינלים ז"א אני לא חייבת לערוך את הכל
// userRouter.put('/editaccount/:id', (req, res) => {
//     const { id } = req.params;
//     const { name, email, country, language, password } = req.body.body;
//     console.log(req.body);
//     const query = `UPDATE users SET userName='${name}',country='${country}',language='${language}',email='${email}',password='${password}'
//   WHERE id ='${id}'`
//     mysqlConnection.query(query, (err, result) => {
//         if (!err) {
//             if (result.affectedRows > 0) {
//                 res.send(result);
//             }
//             else
//                 res.send("failed to add students")
//         }
//         else
//             console.log(err);
//     })
// })

// userRouter.get('/getUsers', (req, res) => {
//     mysqlConnection.query('SELECT userName,country,language,email,permission  FROM users', (err, rows) => {
//         if (!err)
//             res.send(rows);
//         else
//             console.log(err);
//     })
// })






// userRouter.post('/signup', (req, res) => {
//     const { firstName, lastName, email, password } = req.body.body;
//     console.log(req.body);
//     const query = `SELECT * FROM users WHERE email = '${email}'`;
//     console.log(query);
//     mysqlConnection.query(query, (err, rows) => {
//         if (!err)
//             if (rows.length > 0)   //אם האימייל תקין
//                 res.send({ success: false, msg: "Email is already exists!" });
//             else {
//                 const singupQuery = `INSERT INTO users(userName,email,password,permission)VALUES('${firstName + ' ' + lastName}' ,'${email}','${password}',${3})`;
//                 mysqlConnection.query(singupQuery, (err, result) => {
//                     if (!err)
//                         res.send({ success: true, id: result.insertId, msg: "success" });
//                     else
//                         res.send(err);
//                 })
//             }

//         else
//             res.send({ success: false, msg: "Somthing is wrong!", err: err });
//     })
// })


// userRouter.get('/logIn/:email/:pass', (req, res) => {
//     const { email, pass } = req.params;
//     console.log(email, pass);
//     mysqlConnection.query(`SELECT * FROM users WHERE email ='${email}' and password='${pass}'`, (err, rows, fields) => {
//         if (!err) {
//             res.send(rows[0]);
//             console.groupCollapsed("its work");
//             console.groupCollapsed(email);
//             console.groupCollapsed(pass);
//         }
//         else
//             console.log(err);
//     })
// })

// //userRouter.get('/singin/:email/:password', (req, res) => {
// //const { email,password}=req.params;
// //const query=`SELECT * FROM users WHERE email = '${email}'`;
// //mysqlConnection.query(query,(err,rows)=>{
// //    if(!err)
// //})
// //}
// //)
// // userRouter.post('/signup', (req, res) => {
// //     const { firstName, lastName, email, password } = req.body;
// //     const validateEmail = checkEmail(email);
// //     if (validateEmail == false)
// //         res.send({ success: false, msg: "Email is already exists!" });
// //     else {
// //         console.log("arrived to signup");
// //         const result = signup(firstName, lastName, email, password);
// //         console.log(result);
// //         const { err, rows } = result;
// //         if (!err)
// //             res.send(rows);
// //         else
// //             res.send(err);
// //     }
// // }

// // )


// module.exports =
//     userRouter;