require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const database = new Sequelize(
  process.env.MYSQL_DB,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);
database
  .authenticate()
  .then(() => {
    console.log("Connection  BD avec succes.");
  })
  .catch((error) => {
    console.error("Connection  BD échoue: ", error);
  });
module.exports = database;
