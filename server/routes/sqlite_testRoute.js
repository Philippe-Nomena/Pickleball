const express = require("express");
const router = express.Router();
const Sqlite_testController = require("../controllers/Sqlite_testController");

router.post("/", Sqlite_testController.createSqlite_test);
router.post("/sync", Sqlite_testController.createSqlite_testSync);
router.get("/", Sqlite_testController.getAllSqlite_test);

router.delete("/:id", Sqlite_testController.deleteSqlite_test);
router.put("/:id", Sqlite_testController.updateSqlite_test);

module.exports = router;
