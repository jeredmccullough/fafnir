#!/bin/bash
STOP=false;
if ! hash hugo 2>.nohup;then
  echo "Missing Hugo (https://gohugo.io/)";
  STOP=true;
fi
if ! hash node 2>.nohup;then
  echo "Missing nodejs (https://nodejs.org/)";
  STOP=true;
fi

if $STOP; then
  echo "Please install missing dependencies before running the install script"
  exit 2;
fi
HUGO_VERSION=$(hugo version | awk '{print $5}');
NODE_VERSION=$(node -v);
echo "Hugo version $HUGO_VERSION";
echo "Node version $NODE_VERSION";
echo "Installing JS dependencies";
npm install;
