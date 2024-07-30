const multer = require("multer");
const path = require("path");
const fs = require("fs");

const excelFolderPath = path.join(__dirname, "..", "dataExcel");
if (!fs.existsSync(excelFolderPath)) {
  fs.mkdirSync(excelFolderPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, excelFolderPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const dataExcel = multer({ storage: storage });

module.exports = dataExcel;
