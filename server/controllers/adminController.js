const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');

const Admin = require("../models/Admin");

exports.getAllUsera = async (req, res, next) => {
  const users = await Admin.findAll();

  res.json(users);
};

exports.getUsers = async (req, res, next) => {
  const id = req.params.id;
  let users = await Admin.findOne({
    where: {
      id: id,
    },
  });
  res.json(users);
};

exports.deleteUser = async (req, res, next) => {
  let users = await Admin.destroy({
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
    let newuser = await Admin.create({
      nom: req.body.nom,
      username: req.body.username,
      motdepasse: req.body.motdepasse,
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
    let users = await Admin.findOne({
      where: {
        id: req.params.id,
      },
    });

    users.nom = req.body.nom;
    users.username = req.body.username;
    users.motdepasse = req.body.motdepasse;

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

exports.login = async (req, res, next) => {
  try {
    let result = false;
    const liste = await Admin.findAll();
    let thing;
    for (var v of liste) {
      if (
        v.username == req.body.username &&
        v.motdepasse == req.body.motdepasse
      ) {
        result = true;
        thing = v;
        break;
      }
    }
    if (result) {
        console.log(thing.id);
        const token = jwt.sign({ id: thing.id }, 'secret', { expiresIn: '1h' });
      return res.json({ result: result, token: token }); 
    } else {
      return res.json({ result }); 
    }
  } catch (error) {
    console.error(error); 
    res.status(400).send(error.message);
  }
};

exports.verifyToken = (req, res, next) => {
    try {
      const decoded = jwt.verify(req.body.token, 'secret');
      console.log(decoded);
      const userId = decoded.id; 
      return res.json({ idadmin: userId });
    } catch (error) {
      console.error('Erreur lors de la vérification du token :', error);
      return null;
    }
  };
