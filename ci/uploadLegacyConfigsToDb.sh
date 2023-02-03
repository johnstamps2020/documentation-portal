#!/bin/bash

# TODO: When this build is productized, add conditions for settings proper vars depending on env
APP_BASE_URL="https://croissant.dev.ccs.guidewire.net"
OKTA_ACCESS_TOKEN_ISSUER="https://guidewire-hub.oktapreview.com/oauth2/ausj9ftnbxOqfGU4U0h7"
BASE64_CLIENT_CREDS=$(echo -n "$OKTA_CLIENT_ID:$OKTA_CLIENT_SECRET" | base64)

JWT=$(curl -v --location -X POST "$OKTA_ACCESS_TOKEN_ISSUER/v1/token" \
  --header "Content-Type: application/x-www-form-urlencoded" \
  --header "Authorization: Basic $BASE64_CLIENT_CREDS" \
  --data-urlencode "grant_type=client_credentials" \
  --data-urlencode "scope=$OKTA_ACCESS_TOKEN_SCOPES" |
  jq -r '.access_token')

[[ -z "$JWT" || "$JWT" == "null" ]] && echo "Unable to get an access token from Okta" && exit 1

for entityType in source doc page openRoutes
do
    curl -v -o response_${entityType}.json -X PUT "$APP_BASE_URL/safeConfig/entity/legacy/putConfigInDatabase/${entityType}" \
      --header "Authorization: Bearer $JWT"

    echo "Done. For details, see the response_${entityType}.json file in the build artifacts."
done
