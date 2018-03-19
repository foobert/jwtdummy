const jwt = require("jsonwebtoken");

module.exports = function(req, res) {
  if (req.get("Content-Type") !== "application/json") {
    res.sendStatus(415);
    return;
  }

  const privateKey = req.app.get("privateKey");
  const payload = req.body;

  console.log("Signing " + JSON.stringify(payload));
  const token = jwt.sign(payload, privateKey, { algorithm: "RS256" });
  res.set("Content-Type", "text/plain");
  res.send(token);
};
