const jwt = require("jsonwebtoken");

function fixUrlEncoding(req, res, next) {
  if (req.is("urlencoded")) {
    // curl defaults to application/x-www-form-urlencoded
    // be nice and assume the user meant the right thing
    console.log(
      "You sent application/x-www-form-urlencoded, trying to fix it for you"
    );
    req.body = JSON.parse(Object.keys(req.body)[0]);
  }
  next();
}

function signPayload(req, res) {
  const privateKey = req.app.get("privateKey");
  const payload = req.body;
  const opts = getSignOpts(req);

  console.log("Signing %o with %o", payload, opts);
  const token = jwt.sign(payload, privateKey, opts);

  res.set("Content-Type", "text/plain");
  res.send(token);
}

function getSignOpts(req) {
  let opts = { algorithm: "RS256" };
  if (typeof req.query.bare == "undefined") {
    if (typeof req.body.iss == "undefined") {
      opts.issuer = iss(req);
    }
    opts.keyid = req.app.get("kid");
  }
  return opts;
}

function iss(req) {
  if (process.env.ISSUER) {
    return process.env.ISSUER;
  }
  const host = req.get("X-Forwarded-Host") || req.get("Host");
  return `${req.protocol}://${host}/`;
}

module.exports = [fixUrlEncoding, signPayload];
