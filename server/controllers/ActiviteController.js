const { Op } = require("sequelize");
// const Activite = require("../models/Activite");

// // Get all activities
// exports.getAllActivite = async (req, res, next) => {
//   try {
//     const activities = await Activite.findAll();
//     res.status(200).json(activities);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error retrieving activities", error: error.message });
//   }
// };

// // Get single activity by ID
// exports.getActivite = async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const activity = await Activite.findOne({ where: { id } });
//     if (activity) {
//       res.status(200).json(activity);
//     } else {
//       res.status(404).json({ message: "Activity not found" });
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error retrieving activity", error: error.message });
//   }
// };

// // Delete an activity by ID
// exports.deleteActivite = async (req, res, next) => {
//   try {
//     const deleted = await Activite.destroy({ where: { id: req.params.id } });
//     if (deleted) {
//       res.status(200).send("Suppression avec succès");
//     } else {
//       res.status(404).json({ message: "Activity not found" });
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error deleting activity", error: error.message });
//   }
// };

// // Create a new activity
// exports.createActivite = async (req, res, next) => {
//   try {
//     const newActivity = await Activite.create({ nom: req.body.nom });
//     res.status(201).send("Ajout avec succès");
//   } catch (error) {
//     res
//       .status(400)
//       .send({ message: "Error creating activity", error: error.message });
//   }
// };

// // Update an activity by ID
// exports.updateActivite = async (req, res, next) => {
//   try {
//     const activity = await Activite.findOne({ where: { id: req.params.id } });
//     if (activity) {
//       activity.nom = req.body.nom;
//       await activity.save();
//       res.status(200).send("Mise à jour avec succès");
//     } else {
//       res.status(404).send("Activity not found");
//     }
//   } catch (error) {
//     res
//       .status(400)
//       .send({ message: "Error updating activity", error: error.message });
//   }
// };
// controllers/activiteController.js
const Activite = require("../models/Activite");
const Categorie = require("../models/Categorie");

exports.getAllActivite = async (req, res) => {
  try {
    const activities = await Activite.findAll();
    res.status(200).json(activities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving activities", error: error.message });
  }
};

exports.getActivite = async (req, res) => {
  try {
    const activity = await Activite.findOne({ where: { id: req.params.id } });
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

exports.deleteActivite = async (req, res) => {
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

exports.createActivite = async (req, res) => {
  const { nom, categories } = req.body;
  try {
    const newActivity = await Activite.create({ nom });
    if (categories && categories.length > 0) {
      const categoryPromises = categories.map(async (categoryName) => {
        let category = await Categorie.findOne({
          where: { name: categoryName },
        });
        if (!category) {
          category = await Categorie.create({ name: categoryName });
        }
        return category;
      });
      const categoryInstances = await Promise.all(categoryPromises);
      await newActivity.addCategories(categoryInstances);
    }
    res.status(201).send("Ajout avec succès");
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error creating activity", error: error.message });
  }
};

exports.updateActivite = async (req, res) => {
  const { nom, categories } = req.body;
  try {
    const activity = await Activite.findOne({ where: { id: req.params.id } });
    if (activity) {
      activity.nom = nom;
      await activity.save();
      if (categories && categories.length > 0) {
        const categoryPromises = categories.map(async (categoryName) => {
          let category = await Categorie.findOne({
            where: { name: categoryName },
          });
          if (!category) {
            category = await Categorie.create({ name: categoryName });
          }
          return category;
        });
        const categoryInstances = await Promise.all(categoryPromises);
        await activity.setCategories(categoryInstances);
      }
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
