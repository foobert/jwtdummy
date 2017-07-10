const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const NodeRSA = require('node-rsa');
const uuid = require('uuid/v4');

let privateKey = null;
let rsaKey = null;

try {
    privateKey = fs.readFileSync('private.key');
    rsaKey = new NodeRSA(privateKey);
    console.log('Using key from private.key file');
} catch (err) {
    console.log('Generating new private key');
    rsaKey = new NodeRSA({b: 2048})
    privateKey = rsaKey.exportKey('pkcs8');
    fs.writeFileSync('private.key', privateKey);
}

const kid = process.env.KEY_ID || uuid();
console.log('Using key id: ' + kid);

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.redirect('/.well-known/jwks.json');
});

app.get('/.well-known/jwks.json', (req, res) => {
    const exported = rsaKey.exportKey('components');

    let e = new Buffer(3);
    e.writeIntBE(exported.e, 0, 3);

    res.send({
        keys: [
            {
                kty: 'RSA',
                use: 'sig',
                kid: kid,
                alg: 'RS256',
                n: exported.n.toString('base64'),
                e: e.toString('base64'),
            },
        ],
    });
});

app.get('/token', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.status(405).send("Don't use GET - use POST!\n\ncurl -XPOST -H \"Content-Type: application/json\" -d '{\"foo\":\"bar\"}' http://localhost:3000/token");
});

app.post('/token', (req, res) => {
    if (req.query.grant_type === 'client_credentials' && req.query.scope === 'openid') {
        console.log('Issuing openid token');
        res.set('Content-Type', 'application/json');
        res.send({
            'access_token': 'foobar',
            'scope': 'am_application_scope openid',
            'id_token': 'this-is-you-mock-token',
            'token_type': 'Bearer',
            'expires_in': 3600,
        });
        return;
    }

    if (req.get('Content-Type') !== 'application/json') {
        res.sendStatus(415);
        return;
    }

    const token = jwt.sign(req.body, privateKey, { algorithm: 'RS256'});
    res.set('Content-Type', 'text/plain');
    res.send(token);
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
