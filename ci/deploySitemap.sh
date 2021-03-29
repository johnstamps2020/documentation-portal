#!/bin/bash
set -eux

export POD_NAME=$(kubectl get pods -l app=docportal-flail-app --namespace=${NAMESPACE} | cut -d' ' -f1 | tail -n +2)
kubectl cp ${OUTPUT_FILE} ${POD_NAME}:/tmp/out/sitemap.xml --namespace=${NAMESPACE}