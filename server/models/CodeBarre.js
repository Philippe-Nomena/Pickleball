const Sequelize = require("sequelize");
const database = require("../utils/database");
const Utilisateur = require("../models/Utilisateur");

const CodeBarre = database.define("codebarre", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  iduser: {
    type: Sequelize.INTEGER, 
    allowNull: false,
    references: {
      model: Utilisateur,
      key: "id",
    },
  },
});

CodeBarre.belongsTo(Utilisateur, { foreignKey: "iduser" });

database
  .sync()
  .then(() => {
    console.log("Création de la table codebarre avec succès!");
  })
  .catch((error) => {
    console.error("La création de la table codebarre a échoué :", error);
  });

module.exports = CodeBarre;
