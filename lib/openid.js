const jwt = require("jsonwebtoken");

function handleOpenId(req, res, next) {
  if (
    req.body.grant_type !== "client_credentials" ||
    req.body.scope !== "openid"
  ) {
    return next();
  }

  console.log("Issuing openid token");

  const now = Math.floor(new Date() / 1000);
  const payload = {
    at_hash: "UtWKZ-HbClAE1rarsqpw6g",
    acr: "urn:mace:incommon:iap:silver",
    aud: ["this-is-a-client-id"],
    azp: "this-is-a-client-id",
    iss: "https://172.18.0.1:9443/oauth2/token",
    exp: now + 3600,
    iat: now
  };
  const privateKey = req.app.get("privateKey");
  const token = jwt.sign(payload, privateKey, {
    algorithm: "RS256"
  });
  res.set("Content-Type", "application/json");
  res.send({
    access_token: "foobar",
    scope: "am_application_scope openid",
    id_token: token,
    token_type: "Bearer",
    expires_in: 3600
  });
}

module.exports = handleOpenId;
