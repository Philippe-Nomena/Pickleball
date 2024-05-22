const { Op } = require("sequelize");
const Activite = require("../models/Activite");

// Get all activities
exports.getAllActivite = async (req, res, next) => {
  try {
    const activities = await Activite.findAll();
    res.status(200).json(activities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving activities", error: error.message });
  }
};

// Get single activity by ID
exports.getActivite = async (req, res, next) => {
  try {
    const id = req.params.id;
    const activity = await Activite.findOne({ where: { id } });
    if (activity) {
      res.status(200).json(activity);
    } else {
      res.status(404).json({ message: "Activity not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving activity", error: error.message });
  }
};

// Delete an activity by ID
exports.deleteActivite = async (req, res, next) => {
  try {
    const deleted = await Activite.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(200).send("Suppression avec succès");
    } else {
      res.status(404).json({ message: "Activity not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting activity", error: error.message });
  }
};

// Create a new activity
exports.createActivite = async (req, res, next) => {
  try {
    const newActivity = await Activite.create({ nom: req.body.nom });
    res.status(201).send("Ajout avec succès");
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error creating activity", error: error.message });
  }
};

// Update an activity by ID
exports.updateActivite = async (req, res, next) => {
  try {
    const activity = await Activite.findOne({ where: { id: req.params.id } });
    if (activity) {
      activity.nom = req.body.nom;
      await activity.save();
      res.status(200).send("Mise à jour avec succès");
    } else {
      res.status(404).send("Activity not found");
    }
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error updating activity", error: error.message });
  }
};
