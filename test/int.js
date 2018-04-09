/* eslint-env mocha */
const base64url = require("base64url");
const request = require("superagent");
const { expect } = require("chai");

const url = process.env["URL"];

describe("jwtdummy", () => {
  it("should serve a readme on /", async () => {
    let response = await request.get(url + "/");
    expect(response.ok).to.be.true;
    expect(response.type).to.equal("text/html");
    expect(response.text).to.contain("jwtdummy");
  });

  it("should serve public key on /.well-known/jwks.json", async () => {
    let response = await request.get(url + "/.well-known/jwks.json");
    expect(response.ok).to.be.true;
    expect(response.type).to.equal("application/json");
    let jwks = response.body;
    expect(jwks).to.have.property("keys");

    expect(jwks.keys.length).to.be.at.least(1);
    for (let key of jwks.keys) {
      expect(key.kty).to.equal("RSA");
      expect(key.use).to.equal("sig");
      expect(key.alg).to.equal("RS256");
      expect(key).to.have.property("kid");
      expect(key).to.have.property("n");
      expect(key).to.have.property("e");
    }
  });

  it("should generate a token on /token", async () => {
    let response = await request
      .post(url + "/token")
      .type("json")
      .send({ foo: 42, bar: 23 });

    expect(response.ok).to.be.true;
    expect(response.type).to.equal("text/plain");

    let [header, payload, signature] = response.text.split(".");
    header = JSON.parse(base64url.decode(header));
    payload = JSON.parse(base64url.decode(payload));

    expect(header.alg).to.equal("RS256");
    expect(header.typ).to.equal("JWT");
    expect(header.kid).to.exist;
    expect(payload.foo).to.equal(42);
    expect(payload.bar).to.equal(23);
    expect(payload.iat).to.exist;
    expect(payload.iss).to.exist;
    expect(signature).to.exist;
  });

  it("should generate a bare token on /token?bare", async () => {
    let response = await request
      .post(url + "/token")
      .query({ bare: "" })
      .type("json")
      .send({ foo: 42, bar: 23 });

    expect(response.ok).to.be.true;
    expect(response.type).to.equal("text/plain");

    let [header, payload, signature] = response.text.split(".");
    header = JSON.parse(base64url.decode(header));
    payload = JSON.parse(base64url.decode(payload));

    expect(header.alg).to.equal("RS256");
    expect(header.typ).to.equal("JWT");
    expect(header.kid).to.not.exist;
    expect(payload.foo).to.equal(42);
    expect(payload.bar).to.equal(23);
    expect(payload.iat).to.exist;
    expect(payload.iss).to.not.exist;
    expect(signature).to.exist;
  });

  it("should allow overriding iss", async () => {
    let response = await request
      .post(url + "/token")
      .type("json")
      .send({ foo: 42, bar: 23, iss: "custom iss value" });

    expect(response.ok).to.be.true;
    expect(response.type).to.equal("text/plain");

    let payload = response.text.split(".")[1];
    payload = JSON.parse(base64url.decode(payload));

    expect(payload.iss).to.equal("custom iss value");
  });

  it("should play nice with x-www-form-urlencoded", async () => {
    let response = await request
      .post(url + "/token")
      .type("form")
      .send(JSON.stringify({ foo: 42, bar: 23 }));

    expect(response.ok).to.be.true;
    expect(response.type).to.equal("text/plain");

    let [header, payload, signature] = response.text.split(".");
    header = JSON.parse(base64url.decode(header));
    payload = JSON.parse(base64url.decode(payload));

    expect(header.alg).to.equal("RS256");
    expect(header.typ).to.equal("JWT");
    expect(payload.foo).to.equal(42);
    expect(payload.bar).to.equal(23);
    expect(payload.iat).to.exist;
    expect(signature).to.exist;
  });
});
