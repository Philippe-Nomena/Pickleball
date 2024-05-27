// models/Categorie.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

class Categorie extends Model {}

Categorie.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Categorie",
  }
);

module.exports = Categorie;
