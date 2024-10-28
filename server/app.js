// require("dotenv").config();
// const bodyParser = require("body-parser");
// const express = require("express");
// const https = require("https");
// const fs = require("fs");
// const http = require("http");
// const cors = require("cors");
// const path = require("path");

// const PratiquantsRoute = require("./routes/pratiquantsRoute");
// const UtilisateurRoute = require("./routes/utilisateursRoute");
// const AdminRoute = require("./routes/adminRoute");
// const CodeBarreRoute = require("./routes/codeBarreRoute");
// const ActiviteRoute = require("./routes/activiteRoute");
// const CategorieRoute = require("./routes/categorieRoute");
// const Sqlite_test = require("./routes/sqlite_testRoute");
// const PresenceRoute = require("./routes/presenceRoute");
// const app = express();

// // Load SSL key and certificate for the protocol https
// const sslOptions = {
//   key: fs.readFileSync("key.pem"),
//   cert: fs.readFileSync("cert.pem"),
// };

// // Middlewares
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
//   next();
// });
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/barcodes", express.static(path.join(__dirname, "barcodes")));
// app.use("/dataExcel", express.static(path.join(__dirname, "dataExcel")));

// // Routes
// app.use("/pratiquants", PratiquantsRoute);
// app.use("/utilisateur", UtilisateurRoute);
// app.use("/admin", AdminRoute);
// app.use("/codebarre", CodeBarreRoute);
// app.use("/activite", ActiviteRoute);
// app.use("/categorie", CategorieRoute);
// app.use("/sqlite_test", Sqlite_test);
// app.use("/presence", PresenceRoute);

// // Create an HTTPS server
// https.createServer(sslOptions, app).listen(process.env.APP_PORT, () => {
//   console.log("======================================");
//   console.log("  Serveur HTTPS avec succès sur le port", process.env.APP_PORT);
//   console.log("======================================");
// });

// // Redirect HTTP to HTTPS
// http
//   .createServer((req, res) => {
//     res.writeHead(301, {
//       Location: "https://" + req.headers["host"] + req.url,
//     });
//     res.end();
//   })
//   .listen(80);
require("dotenv").config();
const express = require("express");
const https = require("https");
const fs = require("fs");
const http = require("http");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const PratiquantsRoute = require("./routes/pratiquantsRoute");
const UtilisateurRoute = require("./routes/utilisateursRoute");
const AdminRoute = require("./routes/adminRoute");
// const CodeBarreRoute = require("./routes/codeBarreRoute");
const ActiviteRoute = require("./routes/activiteRoute");
const CategorieRoute = require("./routes/categorieRoute");
// const Sqlite_test = require("./routes/sqlite_testRoute");
const PresenceRoute = require("./routes/presenceRoute");
const SessionRoute = require("./routes/sessionRoute");

const app = express();

// Load SSL key and certificate for HTTPS
const sslOptions = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/barcodes", express.static(path.join(__dirname, "barcodes")));
app.use("/dataExcel", express.static(path.join(__dirname, "dataExcel")));

// Custom CORS Headers Middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Routes
app.use("/pratiquants", PratiquantsRoute);
app.use("/utilisateur", UtilisateurRoute);
app.use("/admin", AdminRoute);
app.use("/session", SessionRoute);
// app.use("/codebarre", CodeBarreRoute);
app.use("/activite", ActiviteRoute);
app.use("/categorie", CategorieRoute);
// app.use("/sqlite_test", Sqlite_test);
app.use("/presence", PresenceRoute);
app.get("/", (req, res) => {
  res.send("Hello from nodejs Server");
});
// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Une erreur s'est produite!", error: err.message });
});

// Create HTTPS server
http
  .createServer(
    // sslOptions,
    app
  )
  .listen(process.env.APP_PORT, () => {
    // http.createServer(app).listen(process.env.APP_PORT, () => {
    console.log("======================================");
    console.log(
      `Serveur HTTPS démarré avec succès sur le port ${process.env.APP_PORT}`
    );
    console.log("======================================");
  });

// Redirect HTTP to HTTPS
// http
//   .createServer((req, res) => {
//     res.writeHead(301, {
//       Location: `https://${req.headers.host}${req.url}`,
//     });
//     res.end();
//   })
//   .listen(80, () => {
//     console.log("Redirection HTTP vers HTTPS active sur le port 80");
//   });
