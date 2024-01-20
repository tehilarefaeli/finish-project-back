const { mysqlConnection } = require('./server/sql/sql');
const express = require('express');
const app = express();
const port = 8080;
const RecipiesRouter = require('./server/routers/RecipiesRouter');
app.use('/recipies', RecipiesRouter);

const UserRouter = require('./server/routers/UserRouter');
app.use('/users', UserRouter);

//const cors = require('cors');
//const bodyparser = require('body-parser');

//app.use(bodyparser.json());


//app.use(cors());






/////////////

// דוגמה לשימוש בROUTE 
//כשמגדירים לאפפ להשתמש בראוטר בוחרים איזה ניווט יביא לדף של הראוטר
//  '/services/getServiceById

// app.use('/mail', mailRouter);
//Establish the server connection
//PORT ENVIRONMENT VARIABLE



// const hotelRouter = require('./server/routers/hotelRouter');
// app.use('/hotels', hotelRouter);

/////////////
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

mysqlConnection.connect((err) => {
  if (!err)
      console.log('Connection Established Successfully');
  else
      console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});



