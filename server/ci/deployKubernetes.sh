#!/bin/bash
set -eux

echo "OKTA_DOMAIN" ${OKTA_DOMAIN}
aws eks update-kubeconfig --name atmos-${DEPLOY_ENV}

echo $(kubectl get pods --namespace=${NAMESPACE})

if [[ "$DEPLOY_ENV" == "us-east-2" ]]; then
    eval "echo \"$(cat server/kube/deployment-prod.yml)\"" > deployment.yml
    eval "echo \"$(cat server/kube/ingress-prod.yml)\"" > ingress.yml
else
    eval "echo \"$(cat server/kube/deployment.yml)\"" > deployment.yml
    eval "echo \"$(cat server/kube/ingress.yml)\"" > ingress.yml
fi

eval "echo \"$(cat server/kube/service.yml)\"" > service.yml

kubectl get secret artifactory-secret --output="jsonpath={.data.\.dockerconfigjson}" --namespace=${NAMESPACE} || \
kubectl create secret docker-registry artifactory-secret --docker-server=artifactory.guidewire.com --docker-username=${ARTIFACTORY_USERNAME} --docker-password=${ARTIFACTORY_PASSWORD} --namespace=${NAMESPACE}

sed -ie "s/BUILD_TIME/$(date)/g" deployment.yml
kubectl apply -f deployment.yml --namespace=${NAMESPACE}
kubectl apply -f service.yml --namespace=${NAMESPACE}
kubectl apply -f ingress.yml --namespace=${NAMESPACE}