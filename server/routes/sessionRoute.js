const express = require("express");
const router = express.Router();
const SessionController = require("../controllers/SessionController");
const { verifyToken } = require("../controllers/utilisateurController");
router.get("/", verifyToken, SessionController.getAllSession);

module.exports = router;
