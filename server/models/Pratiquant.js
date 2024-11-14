// const Sequelize = require("sequelize");
// const database = require("../utils/database");
// const Pratiquants = database.define("pratiquants", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     primaryKey: true,
//     autoIncrement: true,
//   },

//   session: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },

//   nom: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },

//   sexe: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },

//   naissance: {
//     type: Sequelize.DATEONLY,
//     allowNull: true,
//   },
//   payement: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   consigne: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   carte_fede: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   etiquete: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   courriel: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   adresse: {
//     type: Sequelize.STRING(30),
//     allowNull: false,
//   },
//   telephone: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   tel_urgence: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   activite: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   categorie: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   evaluation: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   mode_payement: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   carte_payement: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   groupe: {
//     type: Sequelize.JSON,
//     allowNull: true,
//   },
// });

// database
//   .sync()
//   .then(() => {
//     console.log("Creation du table pratiquants avec succes!");
//   })
//   .catch((error) => {
//     console.error("creation du table pratiquants echoue :", error);
//   });

// module.exports = Pratiquants;
const Sequelize = require("sequelize");
const database = require("../utils/database");
const Session = require("./Session");
const Activite = require("./Activite");
const Categorie = require("./Categorie");

const Pratiquant = database.define(
  "pratiquant",
  {
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
    sexe: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    naissance: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    payement: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    consigne: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    carte_fede: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    etiquete: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    courriel: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    adresse: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    telephone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tel_urgence: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    evaluation: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    mode_payement: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    carte_payement: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    groupe: {
      type: Sequelize.JSON,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);
Pratiquant.belongsTo(Session, {
  foreignKey: "id_session",
  as: "session",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Pratiquant.belongsTo(Activite, {
  foreignKey: "id_activite",
  as: "activite",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Pratiquant.belongsTo(Categorie, {
  foreignKey: "id_categorie",
  as: "categorie",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
database
  .sync()
  .then(() => console.log("Pratiquant table created successfully!"))
  .catch((error) => console.error("Failed to create Pratiquant table:", error));

module.exports = Pratiquant;
