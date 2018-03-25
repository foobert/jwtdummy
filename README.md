# jwtdummy

A stupid mock for working with JSON web tokens. You can use this to sign and
validate tokens in *dev* environments.

## Usage

1. Configure your JWT validation code to fetch the public key from
   [.well-known/jwks.json](http://localhost:3000/.well-known/jwks.json).
2. Generate a token by POSTing a payload to the [/token](http://localhost:3000/token) endpoint.
3. Use your new token.

The service will sign any payload given to it. The only default claim is `iat`,
which is set to the current timestamp. This can of course be changed by already
passing in an `iat` claim.

Example usage with curl:

    curl -X POST -d '{"foo":42}' http://localhost:3000/token

Or nested into another curl:

    curl -H "Authorization: $(curl -X POST -d '{"foo":42}' http://localhost:3000/token)" http://example.com

You can run the dummy using Docker:

    docker run -p 3000:3000 foobert/jwtdummy

## Advanced usage

The key id can be configured by setting the `KEY_ID` environment variable.
You can override the private key by putting a PEM formatted RSA key in a file
called `private.key`.

## Developing

[![Build Status](https://travis-ci.org/foobert/jwtdummy.svg?branch=master)](https://travis-ci.org/foobert/jwtdummy)

[Pull requests welcome!](https://github.com/foobert/jwtdummy)
