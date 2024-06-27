const { Op, NOW } = require("sequelize");
const Presence = require("../models/Presence");

// Get single presence by Pratiquants
exports.getPresencebyPratiquant = async (req, res, next) => {
  let id_pratiquant = req.params.id;
  const presence = await Presence.findAll({
    where: { id_pratiquant: id_pratiquant },
  });
  res.json(presence);
};
// Get all presence
exports.getAllPresence = async (req, res, next) => {
  const presence = await Presence.findAll();
  res.json(presence);
};
// Delete an activity by ID
exports.deletePresence = async (req, res, next) => {
  try {
    const deleted = await Presence.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(200).send("Suppression avec succès");
    } else {
      res.status(404).json({ message: "Presence not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Presence", error: error.message });
  }
};

// Create a new Presence
exports.createPresence = async (req, res, next) => {
  try {
    let { nom, session, activite, jour, id_pratiquant } = req.body;

    const newPresence = await Presence.create({
      nom: nom,
      session: session,
      activite: activite,
      jour: jour,
      id_pratiquant: id_pratiquant,
      present: true,
      absent: false,
    });

    if (newPresence) {
      res.status(201).send("Ajout avec succès");
    }
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error creating categorie", error: error.message });
  }
};

// Update an activity by ID
exports.updatePresence = async (req, res, next) => {
  try {
    const presence = await Presence.findOne({ where: { id: req.params.id } });
    if (presence) {
      presence.nom = req.body.nom;
      presence.activite = req.body.activite;
      presence.session = req.body.session;
      presence.jour = req.body.jour;
      await presence.save();
      res.status(200).send("Mise à jour avec succès");
    } else {
      res.status(404).send("Presence not found");
    }
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error updating presence", error: error.message });
  }
};
