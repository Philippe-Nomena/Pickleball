const express = require("express");
const router = express.Router();
const pratiquantsController = require("../controllers/pratiquantsController");
const { verifyToken } = require("../controllers/utilisateurController");
router.post("/", pratiquantsController.createPratiquants);
router.get("/", verifyToken, pratiquantsController.getAllPratiquants);
router.get("/ete", verifyToken, pratiquantsController.getAllPratiquantsEte);
router.get(
  "/printemps",
  verifyToken,
  pratiquantsController.getAllPratiquantsPrintemps
);
router.get("/hiver", verifyToken, pratiquantsController.getAllPratiquantsHiver);
router.get(
  "/selected/:activiteId",
  verifyToken,
  pratiquantsController.getPratiquantsbySelected
);
router.get(
  "/automne",
  verifyToken,
  pratiquantsController.getAllPratiquantsAutomne
);
router.get("/ete/:id", verifyToken, pratiquantsController.getPratiquantsEte);
router.get(
  "/automne/:id",
  verifyToken,
  pratiquantsController.getPratiquantsAutomne
);
router.get(
  "/hiver/:id",
  verifyToken,
  pratiquantsController.getPratiquantsHiver
);
router.delete("/:id", verifyToken, pratiquantsController.deletePratiquants);
router.put("/:id", verifyToken, pratiquantsController.updatePratiquants);

module.exports = router;
