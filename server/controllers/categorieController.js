const { Op, NOW } = require("sequelize");
const Categorie = require("../models/Categorie");
const Activite = require("../models/Activite");

// Get single categorie by Activite
exports.getCategoriebyActivite = async (req, res, next) => {
  let id_activite = req.params.id;
  const categorie = await Categorie.findAll({
    where: { id_activite: id_activite },
  });
 res.json(categorie)

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
    let { categorie, horaire, prix, jour, id_activite } = req.body;
   
    const newCategorie = await Categorie.create({
      categorie: categorie,
      horaire: horaire,
      prix: prix,
      jour: jour,
      id_activite: id_activite,
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
      categorie.jour = req.body.jour;
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
