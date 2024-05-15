const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');

const Activite = require("../models/Activite");

exports.getAllActivite = async (req, res, next) => {
  const users = await Activite.findAll();

  res.json(users);
};

exports.getActivite = async (req, res, next) => {
  const id = req.params.id;
  let users = await Activite.findOne({
    where: {
      id: id,
    },
  });
  res.json(users);
};

exports.deleteActivite = async (req, res, next) => {
  let users = await Activite.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (users) {
    res.status(200).send("supppression avec succes");
  }
};

exports.createActivite = async (req, res, next) => {
  try {
    let newuser = await Activite.create({
      nom: req.body.nom,
    });
    if (newuser) {
      return res.status(200).send("Ajout avec succées");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updateActivite = async (req, res, next) => {
  try {
    let users = await Activite.findOne({
      where: {
        id: req.params.id,
      },
    });

    users.nom = req.body.nom;

    let userUpdate = await users.save();
    if (userUpdate) {
      return res.status(200).send("mise à jour avec succes");
    } else {
      return res.status(400).send("il y a une erreur sur le mise à jour");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};
