const Sequelize = require("sequelize");
const database = require("../utils/database");

const Activite = database.define("activite", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

database
  .sync()
  .then(() => {
    console.log("Creation du table activite avec succes!");
  })
  .catch((error) => {
    console.error("creation du table activite echoue :", error);
  });

module.exports = Activite;
