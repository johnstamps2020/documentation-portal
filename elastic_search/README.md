# Deploying the service to Kubernetes

1. Log into Atmos CLI and select the dev environment. For instructions, see [https://atmos.internal.guidewire.net/docs/dev/atmos-cli/](https://atmos.internal.guidewire.net/docs/dev/atmos-cli/)

1. Create the deployment in Kubernetes.

```bash
kubectl apply -f deployment.yml
```