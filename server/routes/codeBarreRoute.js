const express = require("express");
const router = express.Router();
const CodeBarreController = require("../controllers/codeBarreController");

router.post("/", CodeBarreController.createCodeBarre);
router.get("/", CodeBarreController.getAllCode);
router.get("/:id", CodeBarreController.getCodeById);
router.delete("/:id", CodeBarreController.deleteCode);
router.put("/:id", CodeBarreController.updateCodeBarre);

module.exports = router;