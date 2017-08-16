#!/bin/bash
PATHS=$(git show --name-only | grep "\(partners\{1,\}\).*\/\(archetypes\|content\|scripts\|styles\|static\)")
containsElement () {
  local e
  for e in "${@:2}"; do [[ "$e" == "$1" ]] && return 0;done
  return 1
}
PARTNERS=();
for mypath in $PATHS; do
  TEMPPARTNER=$(echo $mypath | cut -d "/" -f2)
  mypath=$(echo ${mypath#$TEMPPARTNER/})
  containsElement $TEMPPARTNER ${PARTNERS[@]}
  mytest=$?;
  if [[ -d partners/$TEMPPARTNER  ]]; then
    echo "detecting changes in $mypath"

    if [[ "$mytest" != 0 ]]; then
      PARTNERS+=($TEMPPARTNER)
    fi
    echo $mypath
    echo "$mypath" | grep -q content
    if [ $? -eq 0 ];then
      echo $temp
      cd partners/$TEMPPARTNER
      hugo undraft $mypath
      cd ../..
    fi
  fi
done
for PARTNER in $PARTNERS; do
  source scripts/build.sh $PARTNER $@
done
