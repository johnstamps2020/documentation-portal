#!/bin/bash
set -eux

DEPLOYMENT_MODE=$1

aws eks update-kubeconfig --name atmos-${DEPLOY_ENV}

if [[ "$DEPLOYMENT_MODE" == "frontend" ]]; then
  export DEPLOYMENT_COMMAND="rm -rf /usr/src/app/static/pages && mkdir /usr/src/app/static/pages && cp -R /tmp/out/* /usr/src/app/static/pages/ && rm -rf /tmp/out"
elif [[ "$DEPLOYMENT_MODE" == "sitemap" ]]; then
  export DEPLOYMENT_COMMAND="rm -rf /usr/src/app/static/sitemap && mkdir /usr/src/app/static/sitemap && cp -R /tmp/out/* /usr/src/app/static/sitemap/ && rm -rf /tmp/out"
else
  echo "Incorrect deployment mode."
  exit 1
fi

export POD_NAME=$(kubectl get pods -l app=docportal-app --namespace=${NAMESPACE} | cut -d' ' -f1 | tail -n +2)

for i in {1..5}; do
  export VOLUME_MOUNTED=$(kubectl describe pod ${POD_NAME} --namespace=${NAMESPACE} | grep "/usr/src/app/static from static-storage")
  if [[ -z ${VOLUME_MOUNTED} ]]; then
    echo "Persistent Volume not available. Checking again in 15 seconds..."
    sleep 15
  else
    echo "Persistent Volume available. Copying files..."
    kubectl cp ${OUTPUT_DIR} ${POD_NAME}:/tmp/out --namespace=${NAMESPACE}
    kubectl exec ${POD_NAME} --namespace=${NAMESPACE} -- sh -c "${DEPLOYMENT_COMMAND}"
    echo "Files copied successfully"
    exit 0
  fi
done

if [[ -z ${VOLUME_MOUNTED} ]]; then
  echo "ERROR: Unable to reach the Persistent Volume."
  exit 1
fi
