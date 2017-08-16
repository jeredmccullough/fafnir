function partner {
  echo creating new Partner $@
  cp -r ./template-files/PARTNER_TEMPLATE ./partners/$@
  sed -i ''  "s/\${PARTNER_NAME}/$@/"  ./partners/$@/*.yml
  sed -i ''  "s/\${PARTNER_NAME}/$@/"  ./partners/$@/**/*.md
  sed -i ''  "s/\${PARTNER_NAME}/$@/"  ./partners/$@/scripts/templates/sample-hero-template.js
  sed -i ''  "s/\${TEMPLATE_NAME}/sample-hero-template/"  ./partners/$@/scripts/templates/sample-hero-template.js
}

function template {
  echo creating partners/$1/archetypes/$2.md
  cp -r ./template-files/TEMPLATE.md ./partners/$1/archetypes/$2.md
  sed -i ''  "s/\${PARTNER_NAME}/$1/"  ./partners/$1/archetypes/$2.md
  sed -i ''  "s/\${TEMPLATE_NAME}/$2/"  ./partners/$1/archetypes/$2.md
  echo creating partners/$1/layouts/partials/templates/$2.html
  cp -r ./template-files/TEMPLATE.html ./partners/$1/layouts/partials/templates/$2.html
  sed -i ''  "s/\${TEMPLATE_NAME}/$2/" ./partners/$1/layouts/partials/templates/$2.html
  echo creating partners/$1/styles/templates/$2.scss
  cp -r ./template-files/TEMPLATE.scss ./partners/$1/styles/templates/$2.scss
  sed -i ''  "s/\${TEMPLATE_NAME}/$2/" ./partners/$1/styles/templates/$2.scss
  echo creating partners/$1/scripts/templates/$2.js
  cp -r ./template-files/TEMPLATE.js ./partners/$1/scripts/templates/$2.js
  sed -i ''  "s/\${TEMPLATE_NAME}/$2/" ./partners/$1/scripts/templates/$2.js
  echo new template $2 created
}

function variant {
  cd ./partners/$1
  hugo new $2/$3.md
  cd ../..
}

ARGS=()
index=0;
for var in $@
do
  index+=1
  case $var in
    "partner")
      partner ${@:index + 1:1};;
    "template")
      template ${@:index + 1:2};;
    "variant")
      variant ${@:index + 1:3};;
    *)
      ARGS+=($var)
  esac
done
