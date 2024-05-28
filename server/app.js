require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");

const PratiquantsRoute = require("./routes/pratiquantsRoute");
const UtilisateurRoute = require("./routes/utilisateursRoute");
const AdminRoute = require("./routes/adminRoute");
const CodeBarreRoute = require("./routes/codeBarreRoute");
const ActiviteRoute = require("./routes/activiteRoute");
const CategorieRoute = require("./routes/categorieRoute");

// middlewares
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.use("/pratiquants", PratiquantsRoute);

app.use("/utilisateur", UtilisateurRoute);

app.use("/admin", AdminRoute);

app.use("/codebarre", CodeBarreRoute);

app.use("/activite", ActiviteRoute);

app.use("/categorie", CategorieRoute);

app.listen(process.env.APP_PORT, process.env.URL, () => {
  console.log("======================================");
  console.log("  serveur avec succes sur le port", process.env.APP_PORT);
  console.log("======================================");
});
