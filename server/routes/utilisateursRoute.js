const express = require("express");
const router = express.Router();
const utilisateurController = require("../controllers/utilisateurController");

router.post("/", utilisateurController.createUsers);
router.post("/login", utilisateurController.login);
router.post("/verifytoken", utilisateurController.verifyToken);
router.get("/", utilisateurController.getAllUsers);
router.get("/:id", utilisateurController.getUsers);
router.delete("/:id", utilisateurController.deleteUser);
router.put("/:id", utilisateurController.updateUser);

module.exports = router;
