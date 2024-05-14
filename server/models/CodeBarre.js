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
    type: Sequelize.STRING,
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
    console.log("Creation du table codebarre avec succes!");
  })
  .catch((error) => {
    console.error("creation du table codebarre echoue :", error);
  });

module.exports = CodeBarre;
