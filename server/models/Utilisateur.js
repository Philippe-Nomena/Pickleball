const Sequelize = require("sequelize");
const database = require("../utils/database");
const Utilisateur = database.define("utilisateur", {
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
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  motdepasse: {
    type: Sequelize.STRING,
    allowNull: true,
  }
});

database
  .sync()
  .then(() => {
    console.log("Creation du table utilisateur avec succes!");
  })
  .catch((error) => {
    console.error("creation du table utilisateur echoue :", error);
  });

module.exports = Utilisateur;
