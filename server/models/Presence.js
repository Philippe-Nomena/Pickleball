// const Sequelize = require("sequelize");
// const database = require("../utils/database");
// const Pratiquants = require("../models/pratiquants");
// const Presence = database.define("presence", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   nom: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   session: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   activite: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   categorie: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   jour: {
//     type: Sequelize.DATEONLY,
//     allowNull: true,
//   },
//   present: {
//     type: Sequelize.BOOLEAN,
//     default: false,
//   },
//   absence: {
//     type: Sequelize.BOOLEAN,
//     default: true,
//   },
// });
// Presence.belongsTo(Pratiquants, {
//   foreignKey: "id_pratiquant",
//   as: "pratiquant",
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// });

// database
//   .sync()
//   .then(() => {
//     console.log("Creation du table Presence avec succes!");
//   })
//   .catch((error) => {
//     console.error("creation du table Presence echoue :", error);
//   });

// module.exports = Presence;
const Sequelize = require("sequelize");
const database = require("../utils/database");
const Activite = require("./Activite");
const Pratiquant = require("./Pratiquant");
const Categorie = require("./Categorie");
const Session = require("./Session");

const Presence = database.define(
  "presence",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    jour: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    present: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    absence: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

Presence.belongsTo(Session, {
  foreignKey: "id_session",
  as: "session",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Presence.belongsTo(Activite, {
  foreignKey: "id_activite",
  as: "activite",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Presence.belongsTo(Categorie, {
  foreignKey: "id_categorie",
  as: "categorie",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Presence.belongsTo(Pratiquant, {
  foreignKey: "id_pratiquant",
  as: "pratiquant",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Presence;
