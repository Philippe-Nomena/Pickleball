const Sequelize = require("sequelize");
const database = require("../utils/database");
const Activite = require("../models/Activite");

const Categorie = database.define("categorie", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  // iv: {
  //   type: Sequelize.STRING,
  //   allowNull: false,
  // },
  categorie: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  horaire: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  prix: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  jour: {
    type: Sequelize.JSON,
    allowNull: false,
  },

  datedebut: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
  datefin: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
});

Categorie.belongsTo(Activite, {
  foreignKey: "id_activite",
  as: "activite",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

database
  .sync()
  .then(() => {
    console.log("Creation du table categorie avec succes!");
  })
  .catch((error) => {
    console.error("creation du table categorie echoue :", error);
  });

module.exports = Categorie;
