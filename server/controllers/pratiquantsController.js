const { Op } = require("sequelize");

const Pratiquants = require("../models/pratiquants");

exports.getAllPratiquants = async (req, res, next) => {
  const pratiquants = await Pratiquants.findAll();

  res.json(pratiquants);
};

exports.getPratiquants = async (req, res, next) => {
  const id = req.params.id;
  let pratiquants = await Pratiquants.findOne({
    where: {
      id: id,
    },
  });
  res.json(pratiquants);
};

exports.deletePratiquants = async (req, res, next) => {
  let pratiquants = await Pratiquants.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (pratiquants) {
    res.status(200).send("supppression avec succes");
  }
};

exports.createPratiquants = async (req, res, next) => {
  try {
    let {
      session,
      nom,
      sexe,
      naissance,
      payement,
      consigne,
      carte_fede,
      etiquete,
      courriel,
      adresse,
      telephone,
      tel_urgence,
      categorie,
      evaluation,
      mode_payement,
      carte_payement,
      groupe,
    } = req.body;

    let isAvalableEmail = await Pratiquants.findOne({
      where: { courriel: courriel },
    });
    if (isAvalableEmail) {
      return res.status(400).send("cet email est déjà enregistré");
    }

    let newPratiquants = await Pratiquants.create({
      session: session,
      nom: nom,
      sexe: sexe,
      naissance: naissance,
      payement: payement,
      consigne: consigne,
      carte_fede: carte_fede,
      etiquete: etiquete,
      courriel: courriel,
      adresse: adresse,
      telephone: telephone,
      tel_urgence: tel_urgence,
      categorie: categorie,
      evaluation: evaluation,
      mode_payement: mode_payement,
      carte_payement: carte_payement,
      groupe: groupe,
    });
    if (newPratiquants) {
      return res.status(400).send("Ajout avec succées");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updatePratiquants = async (req, res, next) => {
  try {
    let pratiquants = await Pratiquants.findOne({
      where: {
        id: req.params.id,
      },
    });

    (pratiquants.session = req.body.session),
      (pratiquants.nom = req.body.nom),
      (pratiquants.sexe = req.body.sexe);
    pratiquants.naissance = req.body.naissance;
    pratiquants.payement = req.body.payement;
    pratiquants.consigne = req.body.consigne;
    pratiquants.carte_fede = req.body.carte_fede;
    pratiquants.etiquete = req.body.etiquete;
    pratiquants.courriel = req.body.courriel;
    pratiquants.adresse = req.body.adresse;
    pratiquants.telephone = req.body.telephone;
    pratiquants.tel_urgence = req.body.tel_urgence;
    pratiquants.categorie = req.body.categorie;
    pratiquants.evaluation = req.body.evaluation;
    pratiquants.mode_payement = req.body.mode_payement;
    pratiquants.carte_payement = req.body.carte_payement;
    pratiquants.groupe = req.body.groupe;
    let pratiquantsUpdate = await pratiquants.save();
    if (pratiquantsUpdate) {
      return res.status(200).send("mise à jour avec succes");
    } else {
      return res.status(400).send("il y a une erreur sur le mise à jour");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};
