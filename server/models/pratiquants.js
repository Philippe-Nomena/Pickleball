const Sequelize = require("sequelize");
const database = require("../utils/database");
const Pratiquants = database.define("pratiquants", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },

  session: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  nom: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  sexe: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  naissance: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
  payement: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  consigne: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  carte_fede: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  etiquete: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  courriel: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  adresse: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  telephone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  tel_urgence: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  activite: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  categorie: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  evaluation: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  mode_payement: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  carte_payement: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  groupe: {
    type: Sequelize.JSON,
    allowNull: true,
  },
});

database
  .sync()
  .then(() => {
    console.log("Creation du table pratiquants avec succes!");
  })
  .catch((error) => {
    console.error("creation du table pratiquants echoue :", error);
  });

module.exports = Pratiquants;
