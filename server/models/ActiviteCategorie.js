// models/ActiviteCategorie.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const Activite = require("./Activite");
const Categorie = require("./Categorie");

class ActiviteCategorie extends Model {}

ActiviteCategorie.init(
  {
    ActiviteId: {
      type: DataTypes.INTEGER,
      references: {
        model: Activite,
        key: "id",
      },
    },
    CategorieId: {
      type: DataTypes.INTEGER,
      references: {
        model: Categorie,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "ActiviteCategorie",
  }
);

Activite.belongsToMany(Categorie, { through: ActiviteCategorie });
Categorie.belongsToMany(Activite, { through: ActiviteCategorie });

module.exports = ActiviteCategorie;
