const jwt = require("jsonwebtoken");

module.exports = function(req, res) {
  const privateKey = req.app.get("privateKey");
  let payload = req.body;

  if (req.is("urlencoded")) {
    // curl defaults to application/x-www-form-urlencoded
    // be nice and assume the user meant the right thing
    console.log(
      "You sent application/x-www-form-urlencoded, trying to fix it for you"
    );
    payload = JSON.parse(Object.keys(req.body)[0]);
  }

  console.log("Signing " + JSON.stringify(payload));
  const token = jwt.sign(payload, privateKey, { algorithm: "RS256" });
  res.set("Content-Type", "text/plain");
  res.send(token);
};
