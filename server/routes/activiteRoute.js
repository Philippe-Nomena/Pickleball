const express = require("express");
const router = express.Router();
const ActiviteController = require("../controllers/ActiviteController");
const upload = require("../middlewares/upload");

router.post("/", upload.single("image"), ActiviteController.createActivite);
router.get("/", ActiviteController.getAllActivite);
router.get("/:id", ActiviteController.getActivite);
router.delete("/:id", ActiviteController.deleteActivite);
router.put("/:id", upload.single("image"), ActiviteController.updateActivite);

module.exports = router;
