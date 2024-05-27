// const Sequelize = require("sequelize");
// const database = require("../utils/database");

// const Activite = database.define("activite", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   nom: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   }
// });

// database
//   .sync()
//   .then(() => {
//     console.log("Creation du table activite avec succes!");
//   })
//   .catch((error) => {
//     console.error("creation du table activite echoue :", error);
//   });

// module.exports = Activite;
// models/Activite.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Activite extends Model {}

Activite.init(
  {
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prix: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    horaire: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Activite",
  }
);

module.exports = Activite;
