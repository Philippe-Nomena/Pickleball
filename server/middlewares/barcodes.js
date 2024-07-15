const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Check if the barcodes folder exists, if not, create it
const barcodesFolderPath = path.join(__dirname, "..", "barcodes");
if (!fs.existsSync(barcodesFolderPath)) {
  fs.mkdirSync(barcodesFolderPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, barcodesFolderPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const barcodes = multer({ storage: storage });

module.exports = barcodes;
