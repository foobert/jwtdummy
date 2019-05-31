function iss(req) {
  if (process.env.ISSUER) {
    return process.env.ISSUER;
  }
  const host = req.get("X-Forwarded-Host") || req.get("Host");
  return `${req.protocol}://${host}/`;
}

module.exports = function(req, res) {
  const issuer = iss(req);
  res.send({
        issuer,
        "check_session_iframe": issuer + "/oidc/session_iframe.html",
        "end_session_endpoint": issuer + "/logout",
        "authorization_endpoint": issuer + "/oauth/authorize",
        "revocation_endpoint": issuer + "/oauth/revoke",
        "token_endpoint": issuer + "/oauth/token",
        "response_types_supported": ["id_token token", "id_token", "token", "code"],
        "response_modes_supported": ["fragment"],
        "jwks_uri": issuer + "/.well-known/jwks.json",
        "subject_types_supported": ["public"],
        "grant_types_supported": ["authorization_code", "implicit", "client_credentials", "refresh_token", "password"],
        "id_token_signing_alg_values_supported": ["RS256"]
  });
};
