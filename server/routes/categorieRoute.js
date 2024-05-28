const express = require("express");
const router = express.Router();

const CategorieController = require("../controllers/CategorieController");

router.post("/", CategorieController.createCategorie);
router.get("/byactivite/:id", CategorieController.getCategoriebyActivite);
router.delete("/:id", CategorieController.deleteCategorie);
router.put("/:id", CategorieController.updateCategorie);

module.exports = router;