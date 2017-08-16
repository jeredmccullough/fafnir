#!/bin/sh
export NODE_ENV="build";
export PARTNER="";
export HASH=$(git rev-parse --short=0 HEAD);

for var in $@
do
  case $var in
    "prod")
      NODE_ENV="production";;
    "production")
      NODE_ENV="production";;
    "stage")
      NODE_ENV="production";;
    "staging")
      NODE_ENV="production";;
    *)
      PARTNER=$var
  esac
done

echo "NODE_ENV: $NODE_ENV"
node node-files/prep.js
node_modules/webpack/bin/webpack.js
