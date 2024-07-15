const { Op } = require("sequelize");
const bwipjs = require("bwip-js");
const path = require("path");
const fs = require("fs");

const Pratiquants = require("../models/pratiquants");

exports.getAllPratiquants = async (req, res, next) => {
  try {
    const pratiquants = await Pratiquants.findAll();

    const updatedPratiquants = pratiquants.map((pratiquant) => {
      const idString = pratiquant.id.toString().padStart(2, "0");
      const fileName = `barcode_${idString}.png`;
      const barcodeUrl = `${req.protocol}://${req.get("host")}/barcodes/${fileName}`;
      return { ...pratiquant.toJSON(), barcodeUrl };
    });

    res.json(updatedPratiquants);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
exports.getAllPratiquantsEte = async (req, res, next) => {
  const pratiquants = await Pratiquants.findAll({
    where: {
      session: "Ete",
    },
  });
  res.json(pratiquants);
};
exports.getAllPratiquantsHiver = async (req, res, next) => {
  const pratiquants = await Pratiquants.findAll({
    where: {
      session: "Hiver",
    },
  });
  res.json(pratiquants);
};
exports.getAllPratiquantsAutomne = async (req, res, next) => {
  const pratiquants = await Pratiquants.findAll({
    where: {
      session: "Automne",
    },
  });
  res.json(pratiquants);
};
exports.getPratiquantsEte = async (req, res, next) => {
  const id = req.params.id;
  try {
    let pratiquants = await Pratiquants.findOne({
      where: {
        id: id,
        session: "Ete",
      },
    });

    res.json(pratiquants);
  } catch (error) {
    res.status(500).send({
      message: "Vous n'êtes pas inscrit dans la liste de pratiquants été",
      error: error.message,
    });
  }
};

exports.getPratiquantsHiver = async (req, res, next) => {
  const id = req.params.id;
  let pratiquants = await Pratiquants.findOne({
    where: {
      id: id,
      session: "Hiver",
    },
  });
  res.json(pratiquants);
};
exports.getPratiquantsAutomne = async (req, res, next) => {
  const id = req.params.id;
  let pratiquants = await Pratiquants.findOne({
    where: {
      id: id,
      session: "Automne",
    },
  });
  res.json(pratiquants);
};
exports.deletePratiquants = async (req, res, next) => {
  try {
    const id = req.params.id;
    const pratiquants = await Pratiquants.findOne({
      where: {
        id: id,
      },
    });

    if (!pratiquants) {
      return res.status(404).send("Pratiquant non trouvé");
    }

    await Pratiquants.destroy({
      where: {
        id: id,
      },
    });

    const fileName = `barcode_${id}.png`;
    const filePath = path.join(__dirname, "..", "barcodes", fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).send("Suppression avec succès");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
function saveBarcodeImage(barcode, fileName) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "..", "barcodes", fileName);
    fs.writeFile(filePath, barcode, "binary", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(filePath);
      }
    });
  });
}

const formatBarcodeId = (id) => {
  if (id.length === 1) {
    return `0${id}`;
  }
  return id;
};
exports.createPratiquants = async (req, res, next) => {
  try {
    const {
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
      activite,
      categorie,
      evaluation,
      mode_payement,
      carte_payement,
      groupe,
    } = req.body;

    // Check if the email is already registered
    const isAvailableEmail = await Pratiquants.findOne({
      where: { courriel },
    });

    if (isAvailableEmail) {
      return res.status(400).send("Cet email est déjà enregistré");
    }

    // Create a new practitioner
    const newPratiquants = await Pratiquants.create({
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
      activite,
      categorie,
      evaluation,
      mode_payement,
      carte_payement,
      groupe,
    });

    if (newPratiquants) {
      let idString = newPratiquants.id.toString();
      idString = formatBarcodeId(idString);

      // Generate barcode using bwipjs
      bwipjs.toBuffer(
        {
          bcid: "code39",
          text: idString,
          scale: 3,
          includetext: false,
          backgroundcolor: "ffffff",
        },
        async function (err, png) {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .send("Erreur lors de la génération du code-barres");
          } else {
            try {
              const fileName = `barcode_${idString}.png`;
              const savedPath = await saveBarcodeImage(png, fileName);
              // const barcodeUrl = `${req.protocol}://${req.get("host")}/barcodes/${fileName}`;

              return res.status(200).send({
                pratiquant: newPratiquants,
                barcodePath: savedPath,
                // barcodeUrl: barcodeUrl,
                message: "Pratiquant ajouté avec succès",
              });
            } catch (error) {
              console.error(error);
              return res
                .status(500)
                .send("Erreur lors de la sauvegarde du code-barres");
            }
          }
        }
      );
    } else {
      return res.status(400).send("Erreur lors de l'ajout du pratiquant");
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Une erreur est survenue lors de la création du pratiquant");
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
    pratiquants.activite = req.body.activite;
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
