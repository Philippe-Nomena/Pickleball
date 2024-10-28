const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const Activite = require("../models/Activite");
const Categorie = require("../models/Categorie");
require("dotenv").config();

// Get all activities
exports.getAllActivite = async (req, res, next) => {
  try {
    const compagnieId = req.user.compagnieId;

    const activities = await Activite.findAll({
      where: { id_compagnie: compagnieId },
    });

    const activitiesWithImageURL = activities.map((activity) => {
      return {
        id: activity.id,
        nom: activity.nom,
        imagePath: activity.imagePath,
        imageURL: `/uploads/${activity.imagePath}`,
        id_compagnie: activity.id_compagnie,
      };
    });

    res.status(200).json(activitiesWithImageURL);
  } catch (error) {
    console.error("Error retrieving activities:", error);
    res
      .status(500)
      .json({ message: "Error retrieving activities", error: error.message });
  }
};

// Get single activity by ID
exports.getActivite = async (req, res, next) => {
  try {
    const compagnieId = req.user.compagnieId;

    const id = req.params.id;
    const activity = await Activite.findOne({ where: { id } });
    if (activity) {
      const activityWithImageURL = {
        id: activity.id,
        nom: activity.nom,
        imagePath: activity.imagePath,
        id_compagnie: compagnieId,

        imageURL: `/uploads/${activity.imagePath}`,
      };
      res.status(200).json(activityWithImageURL);
    } else {
      res.status(404).json({ message: "Activity not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving activity", error: error.message });
  }
};

// Create a new activity
exports.createActivite = async (req, res, next) => {
  try {
    const compagnieId = req.user.compagnieId;

    const { nom } = req.body;
    const imagePath = req.file.filename;
    const imageURL = `/uploads/${imagePath}`;

    const newActivity = await Activite.create({
      nom,
      imagePath,
      id_compagnie: compagnieId,
    });
    if (newActivity) {
      res
        .status(201)
        .json({ message: "Ajout avec succès", activity: { nom, imageURL } });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating activity", error: error.message });
  }
};

// Update an activity by ID
exports.updateActivite = async (req, res) => {
  try {
    const compagnieId = req.user.compagnieId;

    const { nom } = req.body;
    const imagePath = req.file ? req.file.filename : undefined;

    const activity = await Activite.findOne({ where: { id: req.params.id } });
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    const updatedData = { nom, id_compagnie: compagnieId };
    if (imagePath) {
      updatedData.imagePath = imagePath;
    }

    await activity.update(updatedData);

    const updatedActivity = {
      id: activity.id,
      nom: updatedData.nom,
      id_compagnie: updatedData.id_compagnie,
      imagePath: updatedData.imagePath || activity.imagePath,
      imageURL: `/uploads/${updatedData.imagePath || activity.imagePath}`,
    };

    res.status(200).json(updatedActivity);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

// Delete an activity by ID

exports.deleteActivite = async (req, res, next) => {
  try {
    const activite = await Activite.findByPk(req.params.id);
    const imagePath = activite.imagePath;

    if (imagePath) {
      const imageFullPath = path.join(__dirname, "..", "uploads", imagePath);
      fs.unlinkSync(imageFullPath);
    }

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
