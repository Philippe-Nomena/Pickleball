const { Op } = require("sequelize");
const Sqlite_test = require("../models/sqlite_test");
require("dotenv").config();

// Get all sqlite_test
exports.getAllSqlite_test = async (req, res, next) => {
  try {
    const sqlite_test = await Sqlite_test.findAll();
    res.status(200).json(sqlite_test);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving sqlite_test", error: error.message });
  }
};

// Delete an sqlite_test by ID
exports.deleteSqlite_test = async (req, res, next) => {
  try {
    const deleted = await Sqlite_test.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(200).send("Suppression avec succès");
    } else {
      res.status(404).json({ message: "sqlite_test not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting sqlite_test", error: error.message });
  }
};

// Create a new sqlite_test
exports.createSqlite_test = async (req, res, next) => {
  try {
    const { name } = req.body;

    const newSqlite_test = await Sqlite_test.create({ name });
    if (newSqlite_test) {
      res.status(201).send("Ajout avec succès");
    }
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error creating sqlite_test", error: error.message });
  }
};
// Create a new sqlite_test after synchronise
exports.createSqlite_testSync = async (req, res, next) => {
  try {
    const { localData } = req.body;

    const newSqlite_test = await Sqlite_test.upsert({ localData });
    if (newSqlite_test) {
      res.status(201).send("Data synchroniser");
    }
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error creating sqlite_test", error: error.message });
  }
};
// Update an sqlite_test by ID
exports.updateSqlite_test = async (req, res) => {
  try {
    const { name } = req.body;

    const sqlite_test = await Sqlite_test.findOne({
      where: { id: req.params.id },
    });
    if (!sqlite_test) {
      return res.status(404).json({ error: "sqlite_test not found" });
    }
    await sqlite_test.update({ name });
    res.status(200).json(sqlite_test);
  } catch (error) {
    console.error("Error updating sqlite_test:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
