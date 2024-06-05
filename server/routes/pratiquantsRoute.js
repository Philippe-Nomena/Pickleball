const express = require("express");
const router = express.Router();
const pratiquantsController = require("../controllers/pratiquantsController");

router.post("/", pratiquantsController.createPratiquants);
router.get("/", pratiquantsController.getAllPratiquants);
router.get("/ete", pratiquantsController.getAllPratiquantsEte);
router.get("/hiver", pratiquantsController.getAllPratiquantsHiver);
router.get("/automne", pratiquantsController.getAllPratiquantsAutomne);
router.get("/:id", pratiquantsController.getPratiquants);
router.delete("/:id", pratiquantsController.deletePratiquants);
router.put("/:id", pratiquantsController.updatePratiquants);

module.exports = router;
