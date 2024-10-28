const Sequelize = require("sequelize");
const database = require("../utils/database");

const Compagny = database.define(
  "compagnyes",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    compagnie: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Compagny;
