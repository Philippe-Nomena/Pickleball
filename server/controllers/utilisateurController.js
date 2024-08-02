// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { Op } = require("sequelize");
// const Utilisateur = require("../models/Utilisateur");

// // Get all users
// exports.getAllUsers = async (req, res, next) => {
//   const users = await Utilisateur.findAll();
//   res.json(users);
// };

// // Get a specific user by ID
// exports.getUsers = async (req, res, next) => {
//   const id = req.params.id;
//   let users = await Utilisateur.findOne({
//     where: { id: id },
//   });
//   res.json(users);
// };

// // Delete a user by ID
// exports.deleteUser = async (req, res, next) => {
//   let users = await Utilisateur.destroy({
//     where: { id: req.params.id },
//   });
//   if (users) {
//     res.status(200).send("Suppression avec succès");
//   }
// };

// // Create a new user
// exports.createUsers = async (req, res, next) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.motdepasse, 10);
//     let newuser = await Utilisateur.create({
//       nom: req.body.nom,
//       username: req.body.username,
//       motdepasse: hashedPassword,
//     });
//     if (newuser) {
//       return res.status(200).send("Ajout avec succès");
//     }
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

// // Update a user by ID
// exports.updateUser = async (req, res, next) => {
//   try {
//     let users = await Utilisateur.findOne({
//       where: { id: req.params.id },
//     });

//     users.nom = req.body.nom;
//     users.username = req.body.username;
//     if (req.body.motdepasse) {
//       users.motdepasse = await bcrypt.hash(req.body.motdepasse, 10);
//     }

//     let userUpdate = await users.save();
//     if (userUpdate) {
//       return res.status(200).send("Mise à jour avec succès");
//     } else {
//       return res.status(400).send("Il y a une erreur sur la mise à jour");
//     }
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

// // Login
// exports.login = async (req, res, next) => {
//   try {
//     let result = false;
//     const liste = await Utilisateur.findAll();

//     let user;
//     for (let v of liste) {
//       if (v.username === req.body.username) {
//         const match = await bcrypt.compare(req.body.motdepasse, v.motdepasse);
//         if (match) {
//           result = true;
//           user = v;
//           break;
//         }
//       }
//     }

//     if (result) {
//       const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1h" });
//       return res.json({ result: true, token: token });
//     } else {
//       return res.json({ result: false });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(400).send(error.message);
//   }
// };

// // Verify JWT Token
// exports.verifyToken = (req, res, next) => {
//   try {
//     const decoded = jwt.verify(req.body.token, "secret");
//     console.log(decoded);
//     const userId = decoded.id;
//     return res.json({ iduser: userId });
//   } catch (error) {
//     console.error("Erreur lors de la vérification du token :", error);
//     return res.status(401).send("Token invalide");
//   }
// };
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
require("dotenv").config();

const Utilisateur = require("../models/Utilisateur");
const { encrypt, decrypt } = require("../utils/cryptoUtil");

// Get all users
exports.getAllUsers = async (req, res, next) => {
  const users = await Utilisateur.findAll();
  const decryptedUsers = users.map((user) => {
    user.nom = decrypt({ iv: user.iv, encryptedData: user.nom });
    return user;
  });
  res.json(decryptedUsers);
};

// Get a specific user by ID
exports.getUsers = async (req, res, next) => {
  const id = req.params.id;
  let user = await Utilisateur.findOne({
    where: { id: id },
  });
  user.nom = decrypt({ iv: user.iv, encryptedData: user.nom });
  res.json(user);
};

// Delete a user by ID
exports.deleteUser = async (req, res, next) => {
  let users = await Utilisateur.destroy({
    where: { id: req.params.id },
  });
  if (users) {
    res.status(200).send("Suppression avec succès");
  }
};

// Create a new user
exports.createUsers = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.motdepasse, 10);
    const encryptedNom = encrypt(req.body.nom);
    let newUser = await Utilisateur.create({
      nom: encryptedNom.encryptedData,
      iv: encryptedNom.iv,
      username: req.body.username,
      motdepasse: hashedPassword,
    });
    if (newUser) {
      return res.status(200).send("Ajout avec succès");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Update a user by ID
exports.updateUser = async (req, res, next) => {
  try {
    let user = await Utilisateur.findOne({
      where: { id: req.params.id },
    });

    if (req.body.nom) {
      const encryptedNom = encrypt(req.body.nom);
      user.nom = encryptedNom.encryptedData;
      user.iv = encryptedNom.iv;
    }
    if (req.body.username) {
      user.username = req.body.username;
    }
    if (req.body.motdepasse) {
      user.motdepasse = await bcrypt.hash(req.body.motdepasse, 10);
    }

    let userUpdate = await user.save();
    if (userUpdate) {
      return res.status(200).send("Mise à jour avec succès");
    } else {
      return res.status(400).send("Il y a une erreur sur la mise à jour");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    let result = false;
    const liste = await Utilisateur.findAll();

    let user;
    for (let v of liste) {
      if (v.username === req.body.username) {
        const match = await bcrypt.compare(req.body.motdepasse, v.motdepasse);
        if (match) {
          result = true;
          user = v;
          break;
        }
      }
    }

    if (result) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({ result: true, token: token });
    } else {
      return res.json({ result: false });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

// Verify JWT Token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Erreur lors de la vérification du token :", error);
    return res.status(401).send("Token invalide");
  }
};
