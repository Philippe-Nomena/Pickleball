const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

const CodeBarre = require("../models/CodeBarre");

exports.getAllUsera = async (req, res, next) => {
  const users = await CodeBarre.findAll();

  res.json(users);
};

exports.getUsers = async (req, res, next) => {
  const id = req.params.id;
  let users = await CodeBarre.findOne({
    where: {
      id: id,
    },
  });
  res.json(users);
};

exports.deleteUser = async (req, res, next) => {
  let users = await CodeBarre.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (users) {
    res.status(200).send("supppression avec succes");
  }
};

exports.createUsers = async (req, res, next) => {
  try {
    let newuser = await CodeBarre.create({
      iduser: req.body.iduser,
    });
    if (newuser) {
      return res.status(200).send("Ajout avec succées");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    let users = await CodeBarre.findOne({
      where: {
        id: req.params.id,
      },
    });

    users.iduser = req.body.iduser;

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
