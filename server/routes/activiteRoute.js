const express = require("express");
const router = express.Router();

const ActiviteController = require("../controllers/ActiviteController");

router.post("/", upload.single("image"), ActiviteController.createActivite);
router.get("/", ActiviteController.getAllActivite);
router.get("/:id", ActiviteController.getActivite);
router.delete("/:id", ActiviteController.deleteActivite);
router.put("/:id", ActiviteController.updateActivite);

module.exports = router;
