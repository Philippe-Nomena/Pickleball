const express = require("express");
const router = express.Router();

const PresenceController = require("../controllers/presenceController");

router.post("/", PresenceController.createPresence);
router.get("/", PresenceController.getAllPresence);
router.get("/bydate", PresenceController.getAllPresenceDate);
router.get("/bypratiquant/:id", PresenceController.getPresencebyPratiquant);
router.delete("/:id", PresenceController.deletePresence);
router.put("/:id", PresenceController.updatePresence);

module.exports = router;
