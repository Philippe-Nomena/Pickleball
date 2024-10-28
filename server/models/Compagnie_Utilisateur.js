const Sequelize = require("sequelize");
const database = require("../utils/database");
const Utilisateur = require("./Utilisateur");
const Compagny = require("./Compagnie");

const Compagnie_Utilisateur = database.define(
  "compagnie_utilisateurs",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    motdepasse: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Compagnie_Utilisateur.belongsTo(Utilisateur, {
  foreignKey: "id_utilisateur",
  as: "utilisateur",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Compagnie_Utilisateur.belongsTo(Compagny, {
  foreignKey: "id_compagnie",
  as: "compagnyes",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Compagnie_Utilisateur;
