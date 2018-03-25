#!/bin/bash

function main {
  local branch=${TRAVIS_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}
  local tag=$(git show -s --format=%ct-%h HEAD)

  if [ "${DOCKER_USERNAME}" != "" -a "${DOCKER_PASSWORD}" != "" ]
  then
    docker login -u "${DOCKER_USERNAME}" -p "${DOCKER_PASSWORD}"
  fi

  if [ "${branch}" = "master" ]
  then
    docker push foobert/jwtdummy:latest
  else
    tag="${tag}-${branch}"
  fi

  docker tag foobert/jwtdummy:latest "foobert/jwtdummy:${tag}"
  docker push "foobert/jwtdummy:${tag}"
}

set -e
main
