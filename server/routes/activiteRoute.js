const express = require("express");
const router = express.Router();
const ActiviteController = require("../controllers/ActiviteController");
const upload = require("../middlewares/upload");
const { verifyToken } = require("../controllers/utilisateurController");
router.post(
  "/",
  verifyToken,
  upload.single("imagePath"),
  ActiviteController.createActivite
);
router.get("/", verifyToken, ActiviteController.getAllActivite);
router.get("/:id", verifyToken, ActiviteController.getActivite);
router.delete("/:id", verifyToken, ActiviteController.deleteActivite);
router.put(
  "/:id",
  verifyToken,
  upload.single("imagePath"),
  ActiviteController.updateActivite
);

module.exports = router;
