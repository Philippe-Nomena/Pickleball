const express = require("express");
const router = express.Router();
const { verifyToken } = require("../controllers/utilisateurController");

const CategorieController = require("../controllers/categorieController");

router.post("/", verifyToken, CategorieController.createCategorie);
router.get("/", verifyToken, CategorieController.getAllCategorie);
router.get(
  "/byactivite/:id",
  verifyToken,
  CategorieController.getCategoriebyActivite
);
router.delete("/:id", verifyToken, CategorieController.deleteCategorie);
router.put("/:id", verifyToken, CategorieController.updateCategorie);

module.exports = router;
