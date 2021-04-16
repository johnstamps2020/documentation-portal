#!/bin/bash
set -eux

aws eks update-kubeconfig --name atmos-${DEPLOY_ENV}

export POD_NAME=$(kubectl get pods -l app=docportal-app --namespace=${NAMESPACE} | cut -d' ' -f1 | tail -n +2)
kubectl cp ${OUTPUT_DIR} ${POD_NAME}:/tmp/out --namespace=${NAMESPACE}
kubectl exec ${POD_NAME} --namespace=${NAMESPACE} -- sh -c 'rm -rf /usr/src/app/static/pages/* && cp -R /tmp/out/* /usr/src/app/static/pages/ && rm -rf /tmp/out'
