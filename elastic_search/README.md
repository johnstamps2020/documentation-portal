# Getting the service up and running

1. Log into Atmos CLI and select the dev environment. For instructions, see [https://atmos.internal.guidewire.net/docs/dev/atmos-cli/](https://atmos.internal.guidewire.net/docs/dev/atmos-cli/)

1. Create the deployment in Kubernetes.

```bash
kubectl apply -f deployment.yml
```

# TODO: This step needs checking
1. Set up the env:

```bash
ELASTIC_SEARCH_URL=https://docsearch-doctools.dev.ccs.guidewire.net:9200
```