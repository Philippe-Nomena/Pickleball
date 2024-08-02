const express = require("express");
const router = express.Router();

const PresenceController = require("../controllers/presenceController");
const { verifyToken } = require("../controllers/utilisateurController");
router.post("/", verifyToken, PresenceController.createPresence);
router.get("/", verifyToken, PresenceController.getAllPresence);
router.get("/bydate", verifyToken, PresenceController.getAllPresenceDate);
router.get(
  "/bypratiquant/:id",
  verifyToken,
  PresenceController.getPresencebyPratiquant
);
router.delete("/:id", PresenceController.deletePresence);
router.put("/:id", verifyToken, PresenceController.updatePresence);

module.exports = router;
