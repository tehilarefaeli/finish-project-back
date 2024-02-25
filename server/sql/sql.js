const mysql = require("mysql");

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "12345",
  database: "mydb",
});

module.exports = {
  mysqlConnection,
};
