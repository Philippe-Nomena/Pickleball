const crypto = require("crypto");

const key = crypto.randomBytes(32);

const iv = crypto.randomBytes(16);

console.log("Encryption Key:", key.toString("hex"));
console.log("Encryption IV:", iv.toString("hex"));
