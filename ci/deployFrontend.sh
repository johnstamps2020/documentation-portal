#!/bin/bash
set -eux

aws eks update-kubeconfig --name atmos-${DEPLOY_ENV}

export POD_NAME=$(kubectl get pods -l app=docportal-app --namespace=${NAMESPACE} | cut -d' ' -f1 | tail -n +2)
for i in {1..5}; do
  volumeMounted=$(kubectl describe pod ${POD_NAME} --namespace=${NAMESPACE} | grep "/usr/src/app/static from static-storage")
  if [[ -z ${volumeMounted} ]]; then
    echo "Persistent Volume not available. Checking again in 15 seconds..."
    sleep 15
  else
    echo "Persistent Volume available. Copying files..."
  fi
done
kubectl cp ${OUTPUT_DIR} ${POD_NAME}:/tmp/out --namespace=${NAMESPACE}
kubectl exec ${POD_NAME} --namespace=${NAMESPACE} -- sh -c 'rm -rf /usr/src/app/static/pages && mkdir /usr/src/app/static/pages && cp -R /tmp/out/* /usr/src/app/static/pages/ && rm -rf /tmp/out'
