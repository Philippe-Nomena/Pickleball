const Session = require("../models/Session");

require("dotenv").config();

// Get all activities
exports.getAllSession = async (req, res, next) => {
  try {
    // const compagnieId = req.user.compagnieId;

    const sessions = await Session.findAll({});

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error retrieving sessions:", error);
    res
      .status(500)
      .json({ message: "Error retrieving sessions", error: error.message });
  }
};
