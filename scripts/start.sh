#!/bin/bash
function cleanTmp() {
  echo "removing partners/$PARTNER/static/tmp"
  rm -rf partners/$PARTNER/static/tmp
  rm -rf node-files/tmp
}
trap cleanTmp EXIT

if [ ! -d "node_modules" ]; then
  echo "Node Dependencies not found!";
  echo "Make sure you are in the Mystique root directory!";
  echo "If this is your first time run the install script";
  exit;
fi

export ENV="development";
export SERVE=true;
export EXPERIMENTER_URL;
export PARTNER;
export HASH=$(git rev-parse --short=0 HEAD);
originArgs=("$@")
ARGS=()
index=0;
for var in  "${originArgs[@]}"
do
  case $var in
    "--build")
      SERVE=false;;
    "--prod")
      ENV="production"
      EXPERIMENTER_URL="https://experimenter.ampush.io/experimenter"
      ARGS+=("--disableKinds" "404,rss,sitemap,list,tag,category,taxonomyTerm,section,taxonomy");;
    "--stage")
      ENV='production'
      EXPERIMENTER_URL="https://experimenterqa.ampush.io/experimenter"
      ARGS+=("--disableKinds" "404,rss,sitemap,list,tag,category,taxonomyTerm,section,taxonomy");;
    "-p")
      PARTNER=${originArgs[$index+1]};;
    "--partner")
      PARTNER=${originArgs[$index+1]};;
    *)
      if [[ $var != $PARTNER ]]; then
        ARGS+=($var)
      fi
  esac
  ((index++))
done

if [[ ! $PARTNER && "${ARGS[0]}" != *"-"* ]]; then
  PARTNER=${ARGS[0]};
  ARGS=("${ARGS[@]:1}")
fi

if [[ ! $PARTNER ]]; then
  echo No Partner Found!
  exit 1;
fi

echo "Partner: $PARTNER"
echo "ENV: $ENV"

echo "Starting Webpack"
if [ "$SERVE" = true ] ; then
  ARGS=("serve" "${ARGS[@]}")
  source scripts/npm-start.sh $ENV $PARTNER &
else
  if [ -d "dist" ]; then
    echo "Cleaning old dist"
    rm -rf "dist"
  fi
  ARGS+=("-d" "../../dist")
  echo "HASH: $HASH"
  source scripts/npm-build.sh $ENV $PARTNER;
  echo "HASH: $HASH"
fi

echo "Starting Hugo";

hugo ${ARGS[@]} -s partners/$PARTNER/
