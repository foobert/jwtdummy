const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { rsaKey, privateKey, kid } = require("./lib/key");
app.set("rsaKey", rsaKey);
app.set("privateKey", privateKey);
app.set("kid", kid);

app.get("/", require("./lib/jwks"));
app.get("/.well-known/jwks.json", require("./lib/jwks"));
app.post("/token", require("./lib/openid"), require("./lib/sign"));

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
