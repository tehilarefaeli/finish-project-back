// דף זה נועד לפונקציות מסובכות שלא בהכרח מבצעות API CALL 
// אלה מחשבות לודיקה 
// לדוגמה בפרויקט שלנו הפונקציות שיחשבו מוצרים למתכון או דרוג ואחכ את התוצאה שולחים ב API לריארט

// const nodemailer = require('nodemailer');
// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'tr.tt.pro@gmail.com',
//         pass: 'trttproject'
//     }
// });

// var mailOptions = {
//     from: '',
//     to: '',
//     subject: '',
//     text: '',
//     html: '',
// };

// var sendindUserMail = (from, subject, text) => {
//     mailOptions.from = from;
//     mailOptions.to = 'tr.tt.pro@gmail.com';
//     mailOptions.subject = subject;
//     mailOptions.text = text;
//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });
// }

// var sendingManagerMail = (to) => {
//     mailOptions.from = 'tr.tt.pro@gmail.com';
//     mailOptions.to = to;
//     mailOptions.subject = 'reset password';
//     //mailOptions.text = text;
//     mailOptions.html = "<html><body><span> enter new password:</span> <br/> <form> <input type='text'/><br/> <button type='submit'> send</button> </form><body></html>";

//     console.log('bygbfehfnjw', mailOptions);
//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });
// }


// const mail = {
//     sendindUserMail,
//     sendingManagerMail
// }

// module.exports = mail;