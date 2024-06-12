const express = require("express");
const router = express.Router();

const CategorieController = require("../controllers/categorieController");

router.post("/", CategorieController.createCategorie);
router.post("/", CategorieController.getAllCategorie);
router.get("/byactivite/:id", CategorieController.getCategoriebyActivite);
router.delete("/:id", CategorieController.deleteCategorie);
router.put("/:id", CategorieController.updateCategorie);

module.exports = router;
