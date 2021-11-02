#!/usr/bin/env bash
set -Ex

function apply_path {
    mainjs=./build/server.js
    bundlejs=./build/public/static/js/*.js
    test -f $mainjs

    echo "Check that we have API_PATH and API vars"
    test -n "$API_PATH"

    echo "Changing built files inplace"
    sed -i "s#VOLTO_API_PATH#${API_PATH}#g" $mainjs
    sed -i "s#VOLTO_API_PATH#${API_PATH}#g" $bundlejs
    sed -i "s#VOLTO_INTERNAL_API_PATH#${INTERNAL_API_PATH}#g" $mainjs
    sed -i "s#VOLTO_INTERNAL_API_PATH#${INTERNAL_API_PATH}#g" $bundlejs

    echo "Zipping JS Files"
    gzip -fk $mainjs
}

# Should we monkey patch?
test -n "$API_PATH" && apply_path

echo "Starting Volto"

if [ -z "$TIMEOUT" ]; then
  TIMEOUT="120000"
fi

if [ -z "$RAZZLE_API_PATH" ]; then
  RAZZLE_API_PATH="http://plone:8080/Plone"
fi

if [ -z "$CYPRESS_API_PATH" ]; then
  CYPRESS_API_PATH="$RAZZLE_API_PATH"
fi

if [[ "$1" == "cypress"* ]]; then
  RAZZLE_API_PATH=$RAZZLE_API_PATH yarn start &

  cd /opt/frontend
  exec bash -c "wait-on -t $TIMEOUT http://localhost:3000 && NODE_ENV=production CYPRESS_API_PATH=$CYPRESS_API_PATH ./node_modules/cypress/bin/cypress run"
fi

exec "$@"
