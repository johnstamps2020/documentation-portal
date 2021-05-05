#!/bin/bash
set -eux

aws eks update-kubeconfig --name atmos-${DEPLOY_ENV}

echo $(kubectl get pods --namespace=${NAMESPACE})

kubectl get secret artifactory-secret --output="jsonpath={.data.\.dockerconfigjson}" --namespace=${NAMESPACE} ||
  kubectl create secret docker-registry artifactory-secret --docker-server=artifactory.guidewire.com --docker-username=${ARTIFACTORY_USERNAME} --docker-password=${ARTIFACTORY_PASSWORD} --namespace=${NAMESPACE}

sed -ie "s/\${DEPLOY_ENV}/${DEPLOY_ENV}/g" ${KUBE_FILE}

if [[ ! -z "${DEPLOYMENT_NAME+x}" ]]; then
  kubectl delete deployment ${DEPLOYMENT_NAME} --namespace=${NAMESPACE}
fi
kubectl apply -f ${KUBE_FILE} --namespace=${NAMESPACE}
