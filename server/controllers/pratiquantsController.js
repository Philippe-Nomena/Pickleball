const { Op } = require("sequelize");
const bwipjs = require("bwip-js");
const path = require("path");
const fs = require("fs");
const util = require("util");
const ExcelJS = require("exceljs");
const Pratiquants = require("../models/Pratiquant");
const Session = require("../models/Session");
const Activite = require("../models/Activite");

const Categorie = require("../models/Categorie");
const readFile = util.promisify(fs.readFile);
exports.getAllPratiquants = async (req, res, next) => {
  try {
    const pratiquants = await Pratiquants.findAll({
      include: [
        {
          model: Activite,
          as: "activite",
          where: {
            id_compagnie: compagnieId,
          },
        },
      ],
    });

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

const generateExcelFile = async (pratiquants, req, session) => {
  try {
    const fileName = `pratiquants_${session.toLowerCase()}.xlsx`;
    const filePath = path.join(__dirname, "..", "dataExcel", fileName);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Pratiquants Ete");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Session", key: "session", width: 30 },
      { header: "Nom Complet", key: "nom", width: 50 },
      { header: "Sexe", key: "sexe", width: 10 },
      { header: "Date de naissance", key: "naissance", width: 30 },
      { header: "Payement", key: "payement", width: 30 },
      { header: "Consigne", key: "consigne", width: 30 },
      { header: "Carte federation", key: "carte_fede", width: 30 },
      { header: "Etiquete", key: "etiquete", width: 30 },
      { header: "Email", key: "courriel", width: 50 },
      { header: "Adresse du pratiquant", key: "adresse", width: 50 },
      { header: "Telephone", key: "telephone", width: 30 },
      { header: "Telephone d'urgence", key: "tel_urgence", width: 30 },
      { header: "Activite choisit", key: "activite", width: 30 },
      { header: "Categorie choisit", key: "categorie", width: 30 },
      { header: "Evaluation", key: "evaluation", width: 30 },
      { header: "Mode de payement", key: "mode_payement", width: 30 },
      { header: "Carte de payement", key: "carte_payement", width: 30 },
      { header: "Groupe", key: "groupe", width: 50 },
      { header: "Barcode", key: "barcode", width: 20 },
    ];

    for (const pratiquant of pratiquants) {
      const row = worksheet.addRow(pratiquant);

      const barcodeFileName = path.basename(pratiquant.barcodeUrl);
      const barcodeFilePath = path.join(
        __dirname,
        "..",
        "barcodes",
        barcodeFileName
      );

      try {
        const imageBuffer = await readFile(barcodeFilePath);

        const imageId = workbook.addImage({
          buffer: imageBuffer,
          extension: "png",
        });

        worksheet.addImage(imageId, {
          tl: { col: worksheet.columns.length - 1, row: row.number - 1 },
          ext: { width: 200, height: 80 },
        });

        row.height = 83;
      } catch (error) {
        console.error(
          `Failed to add barcode image for pratiquant ${pratiquant.id}:`,
          error
        );
      }
    }

    await workbook.xlsx.writeFile(filePath);

    console.log("Excel file generated at:", filePath);

    return `${req.protocol}://${req.get("host")}/dataExcel/${fileName}`;
  } catch (error) {
    console.error("Error generating Excel file:", error);
    throw new Error("Failed to generate Excel file");
  }
};

const getAllPratiquantsBySession = async (req, res, next, sessionName) => {
  try {
    const compagnieId = req.user.compagnieId;

    const includeOptions = [
      {
        model: Activite,
        as: "activite",
        where: {
          id_compagnie: compagnieId,
        },
      },
    ];

    if (sessionName) {
      includeOptions.push({
        model: Session,
        as: "session",
        where: {
          nom: sessionName,
        },
      });
    }

    // Fetch pratiquants with the required includes
    const pratiquants = await Pratiquants.findAll({ include: includeOptions });

    // Map and add barcode URL
    const updatedPratiquants = pratiquants.map((pratiquant) => {
      const pratiquantPlain = pratiquant.get({ plain: true });
      const idString = pratiquantPlain.id.toString().padStart(2, "0");
      const fileName = `barcode_${idString}.png`;
      const barcodeUrl = `${req.protocol}://${req.get("host")}/barcodes/${fileName}`;
      return { ...pratiquantPlain, barcodeUrl };
    });

    // Generate Excel file
    const downloadUrl = await generateExcelFile(
      updatedPratiquants,
      req,
      sessionName || "Ete"
    );
    if (!downloadUrl) {
      throw new Error("Failed to generate download URL");
    }

    // Send response
    res.json({
      pratiquants: updatedPratiquants,
      downloadUrl: downloadUrl,
    });
  } catch (error) {
    console.error(
      `Error in getAllPratiquantsBySession (${sessionName || "Ete"}):`,
      error
    );
    res.status(500).json({
      message: "An error occurred while processing the request",
      error: error.message,
    });
  }
};

// Specific session handlers
exports.getAllPratiquantsEte = (req, res, next) => {
  getAllPratiquantsBySession(req, res, next, null);
};

exports.getAllPratiquantsHiver = (req, res, next) => {
  getAllPratiquantsBySession(req, res, next, "Hiver");
};

exports.getAllPratiquantsAutomne = (req, res, next) => {
  getAllPratiquantsBySession(req, res, next, "Automne");
};
exports.getAllPratiquantsPrintemps = (req, res, next) => {
  getAllPratiquantsBySession(req, res, next, "Printemps");
};
exports.getPratiquantsEte = async (req, res, next) => {
  const id = req.params.id;
  try {
    let pratiquants = await Pratiquants.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Session,
          as: "session",
          attributes: ["nom"],
        },
        {
          model: Activite,
          as: "activite",
          attributes: ["nom"],
        },
        {
          model: Categorie,
          as: "categorie",
          attributes: ["categorie"],
        },
      ],
    });

    res.json(pratiquants);
  } catch (error) {
    res.status(500).send({
      message: "Vous n'êtes pas inscrit dans la liste de pratiquants été",
      error: error.message,
    });
  }
};

exports.getPratiquantsbySelected = async (req, res, next) => {
  const { activiteId } = req.params;

  try {
    const pratiquants = await Pratiquants.findAll({
      include: [
        {
          model: Activite,
          as: "activite",
          where: {
            id: activiteId,
          },
        },
      ],
    });
    if (!pratiquants) {
      return res
        .status(404)
        .json({ message: "No pratiquants found for this activite." });
    }

    return res.status(200).json(pratiquants);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getPratiquantsHiver = async (req, res, next) => {
  const id = req.params.id;
  let pratiquants = await Pratiquants.findOne({
    where: {
      id: id,
    },
    include: {
      model: Session,
      as: "session",
      where: {
        nom: "Hiver",
      },
    },
  });
  res.json(pratiquants);
};
exports.getPratiquantsAutomne = async (req, res, next) => {
  const id = req.params.id;
  let pratiquants = await Pratiquants.findOne({
    where: {
      id: id,
    },
    include: {
      model: Session,
      as: "session",
      where: {
        nom: "Automne",
      },
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
      id_session,
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
      id_activite,
      id_categorie,
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
      id_session,
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
      id_activite,
      id_categorie,
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

    (pratiquants.id_session = req.body.id_session),
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
    pratiquants.id_activite = req.body.id_activite;
    pratiquants.id_categorie = req.body.id_categorie;
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
