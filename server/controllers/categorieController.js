const { Op, NOW } = require("sequelize");
const Categorie = require("../models/Categorie");
// const Activite = require("../models/Activite");

// Get single categorie by Activite
exports.getCategoriebyActivite = async (req, res, next) => {
  let id_activite = req.params.id;
  const categorie = await Categorie.findAll({
    where: { id_activite: id_activite },
  });
  res.json(categorie);
};
// Get all categorie
exports.getAllCategorie = async (req, res, next) => {
  const categorie = await Categorie.findAll();
  res.json(categorie);
};
// Delete an activity by ID
exports.deleteCategorie = async (req, res, next) => {
  try {
    const deleted = await Categorie.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(200).send("Suppression avec succès");
    } else {
      res.status(404).json({ message: "categorie not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting categorie", error: error.message });
  }
};

// Create a new categorie
exports.createCategorie = async (req, res, next) => {
  try {
    let {
      categorie,
      horaire,
      prix,
      jour,
      // nbjour,
      id_activite,
      datedebut,
      datefin,
    } = req.body;

    const newCategorie = await Categorie.create({
      categorie: categorie,
      horaire: horaire,
      prix: prix,
      jour: jour,
      // nbjour: nbjour,
      id_activite: id_activite,
      datedebut: datedebut,
      datefin: datefin,
    });

    if (newCategorie) {
      res.status(201).send("Ajout avec succès");
    }
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error creating categorie", error: error.message });
  }
};

// Update an activity by ID
exports.updateCategorie = async (req, res, next) => {
  try {
    const categorie = await Categorie.findOne({ where: { id: req.params.id } });
    if (categorie) {
      categorie.categorie = req.body.categorie;
      categorie.horaire = req.body.horaire;
      categorie.prix = req.body.prix;
      // categorie.nbjour = req.body.nbjour;
      categorie.jour = req.body.jour;
      categorie.datedebut = req.body.datedebut;
      categorie.datefin = req.body.datefin;
      await categorie.save();
      res.status(200).send("Mise à jour avec succès");
    } else {
      res.status(404).send("categorie not found");
    }
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error updating categorie", error: error.message });
  }
};
// const { Op, NOW } = require("sequelize");
// const Categorie = require("../models/Categorie");
// const { encrypt, decrypt } = require("../utils/cryptoUtil");

// // Get single categorie by Activite
// exports.getCategoriebyActivite = async (req, res, next) => {
//   let id_activite = req.params.id;
//   try {
//     const categories = await Categorie.findAll({
//       where: { id_activite: id_activite },
//     });
//     // Decrypt categories
//     const decryptedCategories = categories.map((categorie) => {
//       categorie.categorie = decrypt({
//         iv: categorie.iv,
//         encryptedData: categorie.categorie,
//       });
//       return categorie;
//     });
//     res.json(decryptedCategories);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error retrieving categories", error: error.message });
//   }
// };

// // Get all categorie
// exports.getAllCategorie = async (req, res, next) => {
//   try {
//     const categories = await Categorie.findAll();
//     // Decrypt categories
//     const decryptedCategories = categories.map((categorie) => {
//       categorie.categorie = decrypt({
//         iv: categorie.iv,
//         encryptedData: categorie.categorie,
//       });
//       return categorie;
//     });
//     res.json(decryptedCategories);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error retrieving categories", error: error.message });
//   }
// };

// // Delete a categorie by ID
// exports.deleteCategorie = async (req, res, next) => {
//   try {
//     const deleted = await Categorie.destroy({ where: { id: req.params.id } });
//     if (deleted) {
//       res.status(200).send("Suppression avec succès");
//     } else {
//       res.status(404).json({ message: "Categorie not found" });
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error deleting categorie", error: error.message });
//   }
// };

// // Create a new categorie
// exports.createCategorie = async (req, res, next) => {
//   try {
//     let { categorie, horaire, prix, jour, id_activite, datedebut, datefin } =
//       req.body;

//     // Encrypt the categorie field
//     const encryptedCategorie = encrypt(categorie);
//     const encryptedHoraire = encrypt(horaire);
//     const encryptedPrix = encrypt(prix);
//     const encryptedId_activite = encrypt(id_activite);
//     const encryptedDatedebut = encrypt(datedebut);
//     const encryptedDatefin = encrypt(datefin);
//     const newCategorie = await Categorie.create({
//       categorie: encryptedCategorie.encryptedData,
//       iv: encryptedCategorie.iv,
//       horaire: encryptedHoraire.encryptedData,
//       prix: encryptedPrix.encryptedData,
//       jour: jour,
//       id_activite: encryptedId_activite.encryptedData,
//       datedebut: encryptedDatedebut.encryptedData,
//       datefin: encryptedDatefin.encryptedData,
//     });

//     res.status(201).send("Ajout avec succès");
//   } catch (error) {
//     const { Op, NOW } = require("sequelize");
//     const Categorie = require("../models/Categorie");
//     const { encrypt, decrypt } = require("../utils/cryptoUtil");

//     // Get single categorie by Activite
//     exports.getCategoriebyActivite = async (req, res, next) => {
//       let id_activite = req.params.id;
//       try {
//         const categories = await Categorie.findAll({
//           where: { id_activite: id_activite },
//         });
//         // Decrypt categories
//         const decryptedCategories = categories.map((categorie) => {
//           return {
//             ...categorie.toJSON(),
//             categorie: decrypt({
//               iv: categorie.categorie_iv,
//               encryptedData: categorie.categorie,
//             }),
//             horaire: decrypt({
//               iv: categorie.horaire_iv,
//               encryptedData: categorie.horaire,
//             }),
//             prix: decrypt({
//               iv: categorie.prix_iv,
//               encryptedData: categorie.prix,
//             }),
//             datedebut: decrypt({
//               iv: categorie.datedebut_iv,
//               encryptedData: categorie.datedebut,
//             }),
//             datefin: decrypt({
//               iv: categorie.datefin_iv,
//               encryptedData: categorie.datefin,
//             }),
//           };
//         });
//         res.json(decryptedCategories);
//       } catch (error) {
//         res.status(500).json({
//           message: "Error retrieving categories",
//           error: error.message,
//         });
//       }
//     };

//     // Get all categorie
//     exports.getAllCategorie = async (req, res, next) => {
//       try {
//         const categories = await Categorie.findAll();
//         // Decrypt categories
//         const decryptedCategories = categories.map((categorie) => {
//           return {
//             ...categorie.toJSON(),
//             categorie: decrypt({
//               iv: categorie.categorie_iv,
//               encryptedData: categorie.categorie,
//             }),
//             horaire: decrypt({
//               iv: categorie.horaire_iv,
//               encryptedData: categorie.horaire,
//             }),
//             prix: decrypt({
//               iv: categorie.prix_iv,
//               encryptedData: categorie.prix,
//             }),
//             datedebut: decrypt({
//               iv: categorie.datedebut_iv,
//               encryptedData: categorie.datedebut,
//             }),
//             datefin: decrypt({
//               iv: categorie.datefin_iv,
//               encryptedData: categorie.datefin,
//             }),
//           };
//         });
//         res.json(decryptedCategories);
//       } catch (error) {
//         res.status(500).json({
//           message: "Error retrieving categories",
//           error: error.message,
//         });
//       }
//     };

//     // Delete a categorie by ID
//     exports.deleteCategorie = async (req, res, next) => {
//       try {
//         const deleted = await Categorie.destroy({
//           where: { id: req.params.id },
//         });
//         if (deleted) {
//           res.status(200).send("Suppression avec succès");
//         } else {
//           res.status(404).json({ message: "Categorie not found" });
//         }
//       } catch (error) {
//         res
//           .status(500)
//           .json({ message: "Error deleting categorie", error: error.message });
//       }
//     };

//     // Create a new categorie
//     exports.createCategorie = async (req, res, next) => {
//       try {
//         let {
//           categorie,
//           horaire,
//           prix,
//           jour,
//           id_activite,
//           datedebut,
//           datefin,
//         } = req.body;

//         // Encrypt the fields
//         const encryptedCategorie = encrypt(categorie);
//         const encryptedHoraire = encrypt(horaire);
//         const encryptedPrix = encrypt(prix.toString()); // Convert to string for encryption
//         const encryptedDatedebut = encrypt(datedebut);
//         const encryptedDatefin = encrypt(datefin);

//         const newCategorie = await Categorie.create({
//           categorie: encryptedCategorie.encryptedData,
//           categorie_iv: encryptedCategorie.iv,
//           horaire: encryptedHoraire.encryptedData,
//           horaire_iv: encryptedHoraire.iv,
//           prix: encryptedPrix.encryptedData,
//           prix_iv: encryptedPrix.iv,
//           jour: jour,
//           id_activite: id_activite, // Assuming id_activite is not encrypted
//           datedebut: encryptedDatedebut.encryptedData,
//           datedebut_iv: encryptedDatedebut.iv,
//           datefin: encryptedDatefin.encryptedData,
//           datefin_iv: encryptedDatefin.iv,
//         });

//         res.status(201).send("Ajout avec succès");
//       } catch (error) {
//         res
//           .status(400)
//           .send({ message: "Error creating categorie", error: error.message });
//       }
//     };

//     // Update a categorie by ID
//     exports.updateCategorie = async (req, res, next) => {
//       try {
//         const categorie = await Categorie.findOne({
//           where: { id: req.params.id },
//         });
//         if (categorie) {
//           const {
//             categorie: newCategorie,
//             horaire,
//             prix,
//             jour,
//             datedebut,
//             datefin,
//           } = req.body;

//           // Encrypt the fields
//           const encryptedCategorie = encrypt(newCategorie);
//           const encryptedHoraire = encrypt(horaire);
//           const encryptedPrix = encrypt(prix.toString()); // Convert to string for encryption
//           const encryptedDatedebut = encrypt(datedebut);
//           const encryptedDatefin = encrypt(datefin);

//           // Update the categorie
//           categorie.categorie = encryptedCategorie.encryptedData;
//           categorie.categorie_iv = encryptedCategorie.iv;
//           categorie.horaire = encryptedHoraire.encryptedData;
//           categorie.horaire_iv = encryptedHoraire.iv;
//           categorie.prix = encryptedPrix.encryptedData;
//           categorie.prix_iv = encryptedPrix.iv;
//           categorie.jour = jour;
//           categorie.datedebut = encryptedDatedebut.encryptedData;
//           categorie.datedebut_iv = encryptedDatedebut.iv;
//           categorie.datefin = encryptedDatefin.encryptedData;
//           categorie.datefin_iv = encryptedDatefin.iv;

//           await categorie.save();
//           res.status(200).send("Mise à jour avec succès");
//         } else {
//           res.status(404).send("Categorie not found");
//         }
//       } catch (error) {
//         res
//           .status(400)
//           .send({ message: "Error updating categorie", error: error.message });
//       }
//     };

//     res
//       .status(400)
//       .send({ message: "Error creating categorie", error: error.message });
//   }
// };

// // Update a categorie by ID
// exports.updateCategorie = async (req, res, next) => {
//   try {
//     const categorie = await Categorie.findOne({ where: { id: req.params.id } });
//     if (categorie) {
//       const {
//         categorie: newCategorie,
//         horaire,
//         prix,
//         jour,
//         datedebut,
//         datefin,
//       } = req.body;

//       const encryptedCategorie = encrypt(newCategorie);

//       categorie.categorie = encryptedCategorie.encryptedData;
//       categorie.iv = encryptedCategorie.iv;
//       categorie.horaire = horaire;
//       categorie.prix = prix;
//       categorie.jour = jour;
//       categorie.datedebut = datedebut;
//       categorie.datefin = datefin;

//       await categorie.save();
//       res.status(200).send("Mise à jour avec succès");
//     } else {
//       res.status(404).send("Categorie not found");
//     }
//   } catch (error) {
//     res
//       .status(400)
//       .send({ message: "Error updating categorie", error: error.message });
//   }
// };
