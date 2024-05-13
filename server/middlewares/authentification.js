const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const accessToken =
    req.body.accessToken ||
    req.query.accessToken ||
    req.headers["authorization"];
  if (!accessToken) {
    return res
      .status(400)
      .send("vous devez connecter pour aller dans cette page");
  }
  try {
    const decode = jwt.verify(accessToken);
    req.id = decode.id;
  } catch (error) {
    return res.status(400).send("invalide de token");
  }
  return next();
};

module.exports = {
  verifyToken,
};
