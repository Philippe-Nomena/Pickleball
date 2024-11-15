const { Op, NOW, and } = require("sequelize");
const Presence = require("../models/Presence");
const Activite = require("../models/Activite");
const moment = require("moment");
const Categorie = require("../models/Categorie");
const Pratiquant = require("../models/Pratiquant");
// const Pratiquants = require("../models/pratiquants");
// Get single presence by Pratiquants
exports.getPresencebyPratiquant = async (req, res, next) => {
  let id_pratiquant = req.params.id;
  const compagnieId = req.user.compagnieId;

  const presence = await Presence.findAll({
    where: {
      id_pratiquant: id_pratiquant,
    },
    include: [
      {
        model: Activite,
        as: "activite",
        where: { id_compagnie: compagnieId },
      },
      {
        model: Categorie,
        as: "categorie",
        attributes: ["categorie"],
      },
      {
        model: Pratiquant,
        as: "pratiquant",
        attributes: ["nom"],
      },
    ],
    attributes: ["present", "jour"],
  });

  res.json(presence);
};

// Get all presence

exports.getAllPresence = async (req, res, next) => {
  try {
    const compagnieId = req.user.compagnieId;

    const presence = await Presence.findAll({
      where: { present: true },
      include: [
        {
          model: Activite,
          as: "activite",
          where: { id_compagnie: compagnieId },
        },
        {
          model: Pratiquant,
          as: "pratiquant",
          attributes: ["nom"],
        },
      ],
    });

    res.status(200).json(presence);
  } catch (error) {
    console.error("Error retrieving presence records:", error);
    res.status(500).json({
      message: "Error retrieving presence records",
      error: error.message,
    });
  }
};

const validateDate = (date) => {
  if (!date) {
    return { valid: false, message: "La date est requise" };
  }

  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    return { valid: false, message: "Format de date invalide" };
  }

  return { valid: true };
};

exports.getAllPresenceDate = async (req, res, next) => {
  try {
    const date = req.query.date;
    const validation = validateDate(date);
    const compagnieId = req.user.compagnieId;

    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const startDate = moment(date).startOf("day").toDate();
    const endDate = moment(date).endOf("day").toDate();

    const presence = await Presence.findAll({
      where: {
        jour: {
          [Op.between]: [startDate, endDate],
        },
        present: true,
      },
      include: [
        {
          model: Activite,
          as: "activite",
          where: { id_compagnie: compagnieId },
        },
        { model: Pratiquant, as: "pratiquant", attributes: ["nom"] },
      ],
    });

    res.json(presence);
  } catch (error) {
    console.error("Erreur lors de la récupération des présences : ", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: "Erreur lors de la récupération des présences",
      error: error.message,
    });
  }
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
    let {
      nom,
      id_session,
      id_activite,
      id_categorie,
      jour,
      id_pratiquant,
      datedebut,
      datefin,
    } = req.body;

    const newPresence = await Presence.create({
      nom: nom,
      id_session: id_session,
      id_activite: id_activite,
      id_categorie: id_categorie,
      jour: jour,
      id_pratiquant: id_pratiquant,
      datedebut: datedebut,
      datefin: datefin,
      present: false,
      absence: true,
    });

    if (newPresence) {
      res.status(201).send("Ajout avec succès");
    } else {
      res.status(400).send({ message: "Échec de l'ajout de la présence" });
    }
  } catch (error) {
    console.error("Erreur lors de la création de la présence :", error);
    res.status(400).send({
      message: "Erreur lors de la création de la présence",
      error: error.message,
    });
  }
};

// Update an activity by ID
exports.updatePresence = async (req, res, next) => {
  try {
    const presence = await Presence.findOne({
      where: { id_pratiquant: req.params.id, jour: req.body.jour },
    });
    if (presence) {
      if (presence.present === true) {
        return res
          .status(400)
          .send("Présence déjà enregistrée pour cette date");
      }

      presence.nom = req.body.nom;
      presence.id_activite = req.body.id_activite;
      presence.id_categorie = req.body.id_categorie;
      presence.id_session = req.body.id_session;
      presence.present = true;
      presence.absence = false;

      await presence.save();
      res.status(200).send("Ajout de pointage réussi avec succès");
    } else {
      res.status(404).send("Présence non trouvée pour cette date");
    }
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error updating presence", error: error.message });
  }
};
