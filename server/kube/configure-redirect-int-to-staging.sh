#!/bin/bash

# 1. Log into atmos-int through Atmos CLI.
# `atmos use int -e`
# 2. Export all environment variables printed to the console
#    by copying and pasting them into the terminal and then pressing Enter.
# 2. Run this script to configure the nginx server.

kubectl exec -it "$(kubectl get pods -l app=redirect-int-to-staging -o jsonpath='{.items[0].metadata.name}' -n doctools)" -n doctools \
 -- /bin/sh -c 'rm /etc/nginx/conf.d/default.conf && echo "server { listen 80; listen 443; server_name _; return 301 https://docs.staging.ccs.guidewire.net$request_uri; }" > /etc/nginx/conf.d/nginx.conf && nginx -s reload'
