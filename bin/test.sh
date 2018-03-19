#!/bin/bash

function setup {
    local image=$1
    SUT=$(docker run -d --name sut -p 3000 "${image}")
    PORT=$(docker port "${SUT}" 3000 | cut -d: -f2)
    URL=http://localhost:${PORT}
    wait
}

function teardown {
    #docker logs "${SUT}"
    docker rm -f "${SUT}" > /dev/null
}

function run {
    local jwt=$(curl -sSL -XPOST -H "Content-Type: application/json" -d "{\"foo\":42}" "${URL}/token")
    echo $jwt
}

function wait {
    until $(curl --output /dev/null --silent --head --fail "${URL}"); do
        printf '.'
        sleep 1
    done
}

trap teardown EXIT

setup e126a99ae437
run
