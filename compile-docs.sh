#!/usr/bin/env bash
set -e

# documentation

rm -rf docs/docs/events

for file in $( find definitions/events -type f -name '*.yml' );
    do HYGEN_OVERWRITE=1 npx hygen generator eventDocumentation --path $file
done

for file in $( find definitions/experiments -type f -name '*.yml' );
    do HYGEN_OVERWRITE=1 npx hygen generator experimentDocumentation --path $file
done