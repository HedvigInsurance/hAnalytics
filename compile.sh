#!/usr/bin/env bash
set -e

# generation

HYGEN_OVERWRITE=1 npx hygen generator hAnalytics

cd client/ts
npm ci
npm run build

if [ -z "${BUMP_VERSION_TO}" ]; then
  echo "Not bumping TS client version"
else
  npm version $BUMP_VERSION_TO

  if [ -z "${NODE_AUTH_TOKEN}" ]; then
    echo "Not publishing to NPM"
  else
    npm publish
  fi
fi

cd ../..

# formatting

if [ -x /usr/local/bin/swift-format ] 
then
    echo "Skipping installing swift-format"
else
    mkdir -p build
    cd build

    git clone -b release/5.6 https://github.com/apple/swift-format.git

    cd swift-format

    swift build -c release --disable-sandbox

    SWIFT_FORMAT_PATH=$(find . -type f -name swift-format | grep -v '.dSYM')

    sudo cp $SWIFT_FORMAT_PATH /usr/local/bin/swift-format

    cd ../../
fi

npx prettier --write client/**/*.ts

swift-format format -i swift/hAnalyticsEvent.swift
swift-format format -i swift/hAnalyticsExperiment.swift

./gradlew ktlintFormat

# testing

npm run test -- --ci