const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");

router.post("/", AdminController.createUsers);
router.post("/login", AdminController.login);
router.post("/verifytoken", AdminController.verifyToken);
router.get("/", AdminController.getAllUsera);
router.get("/:id", AdminController.getUsers);
router.delete("/:id", AdminController.deleteUser);
router.put("/:id", AdminController.updateUser);

module.exports = router;