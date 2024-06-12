const Sequelize = require("sequelize");
const database = require("../utils/database");

const Sqlite_test = database.define("sqlite_test", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

database
  .sync()
  .then(() => {
    console.log("Creation du table Sqlite_test avec succes!");
  })
  .catch((error) => {
    console.error("creation du table Sqlite_test echoue :", error);
  });

module.exports = Sqlite_test;
