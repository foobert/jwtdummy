const fs = require("fs");
const NodeRSA = require("node-rsa");
const uuid = require("uuid/v4");

let privateKey = null;
let rsaKey = null;

try {
  privateKey = fs.readFileSync("private.key");
  rsaKey = new NodeRSA(privateKey);
  console.log("Using key from private.key file");
} catch (err) {
  console.log("Generating new private key");
  rsaKey = new NodeRSA({ b: 2048 });
  privateKey = rsaKey.exportKey("pkcs8");
  fs.writeFileSync("private.key", privateKey);
}

const kid = process.env.KEY_ID || uuid();
console.log("Using key id: " + kid);

module.exports = {
  rsaKey,
  privateKey,
  kid
};
