const mysql = require("mysql");

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "Ym987654321!",
  database: "mydb",
});

module.exports = {
  mysqlConnection,
};
