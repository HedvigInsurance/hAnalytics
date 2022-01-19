#!/usr/bin/env bash
set -e

if [ -x /usr/local/bin/hygen ] 
then
    echo "Skipping installing hygen"
else
    sudo npm i -g hygen
fi

npm install

HYGEN_OVERWRITE=1 hygen generator hAnalytics

for file in $( find events -type f -name '*.yml' );
    do HYGEN_OVERWRITE=1 hygen generator documentation --path $file
done

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

swift-format format -i swift/hAnalytics.swift

if [ -f ktfmt.jar ]
then
    echo "Skipping downloading ktfmt"
else
    curl https://repo1.maven.org/maven2/com/facebook/ktfmt/0.30/ktfmt-0.30-jar-with-dependencies.jar --output ktfmt.jar
fi

java -jar ktfmt.jar --kotlinlang-style kotlin/src/main/kotlin/hAnalytics.kt

npm run test -- --ci