#!/bin/bash
set -eux

NAMESPACE=doctools
OUTPUT_DIR=$1

export POD_NAME=$(kubectl get pods -l app=docportal-flail-app --namespace=${NAMESPACE} | cut -d' ' -f1 | tail -n +2)
kubectl cp ${OUTPUT_DIR} ${POD_NAME}:/tmp/ --namespace=${NAMESPACE}
kubectl exec ${POD_NAME} --namespace=${NAMESPACE} -- sh -c 'for f in $(find /tmp/out/* -maxdepth 0); do rm -rf /usr/src/app/public/$(basename $f); done && cp -R /tmp/out/* /usr/src/app/public/ && rm -rf /tmp/out'
