#!/usr/bin/env bash
set -e

# generation

HYGEN_OVERWRITE=1 npx hygen generator hAnalytics

cd client/ts
npm install
npx tsup index.ts --dts
cd ../..

# formatting

if [ -x /usr/local/bin/swift-format ] 
then
    echo "Skipping installing swift-format"
else
    mkdir -p build
    cd build

    git clone -b swift-5.5-branch https://github.com/apple/swift-format.git

    cd swift-format

    swift build -c release --disable-sandbox

    SWIFT_FORMAT_PATH=$(find . -type f -name swift-format | grep -v '.dSYM')

    sudo cp $SWIFT_FORMAT_PATH /usr/local/bin/swift-format

    cd ../../
fi

npx prettier --write client/ts/**/*.ts

swift-format format -i swift/hAnalyticsEvent.swift
swift-format format -i swift/hAnalyticsExperiment.swift

./gradlew ktlintFormat

# testing

npm run test -- --ci

# documentation

rm -rf docs/docs/events

for file in $( find definitions/events -type f -name '*.yml' );
    do HYGEN_OVERWRITE=1 npx hygen generator eventDocumentation --path $file
done

for file in $( find definitions/experiments -type f -name '*.yml' );
    do HYGEN_OVERWRITE=1 npx hygen generator experimentDocumentation --path $file
done