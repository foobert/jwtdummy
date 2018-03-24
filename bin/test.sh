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
    export URL
    $(npm bin)/mocha test/int.js
}

function wait {
    until $(curl --output /dev/null --silent --head --fail "${URL}"); do
        printf '.'
        sleep 1
    done
}

function main {
    local image=${1:-foobert/jwtdummy:latest}

    trap teardown EXIT

    setup "${image}"
    run
}

main
