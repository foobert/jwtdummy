#!/bin/sh
curl -sSL -XPOST -H "Content-Type: application/json" -d "$@" http://localhost:3000/token
