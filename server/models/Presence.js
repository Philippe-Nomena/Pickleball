const Sequelize = require("sequelize");
const database = require("../utils/database");
const Pratiquants = require("../models/pratiquants");
const Presence = database.define("presence", {
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
  session: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  activite: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  jour: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  present: {
    type: Sequelize.BOOLEAN,
    default: false,
  },
});
Presence.belongsTo(Pratiquants, {
  foreignKey: "id_pratiquant",
  as: "pratiquant",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

database
  .sync()
  .then(() => {
    console.log("Creation du table Presence avec succes!");
  })
  .catch((error) => {
    console.error("creation du table Presence echoue :", error);
  });

module.exports = Presence;
