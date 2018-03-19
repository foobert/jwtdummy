module.exports = function(req, res) {
  const rsaKey = req.app.get("rsaKey");
  const kid = req.app.get("kid");
  const exported = rsaKey.exportKey("components");

  let e = new Buffer(3);
  e.writeIntBE(exported.e, 0, 3);

  res.send({
    keys: [
      {
        kty: "RSA",
        use: "sig",
        kid: kid,
        alg: "RS256",
        n: exported.n.toString("base64"),
        e: e.toString("base64")
      }
    ]
  });
};
