# Getting the service up and running

1. Log into Atmos CLI and select the dev environment. For instructions, see [https://atmos.internal.guidewire.net/docs/dev/atmos-cli/](https://atmos.internal.guidewire.net/docs/dev/atmos-cli/)

1. Compose the image.

```bash
docker-compose up --no-start
```

1. Tag the image.

```bash
docker tag docker.elastic.co/elasticsearch/elasticsearch:7.5.0 artifactory.guidewire.com/doctools-docker-dev/docsearch:latest
```

1. Log into Artifactory as `sys-doc`.

```bash
docker login artifactory.guidewire.com
```

1. Push image to Artifactory

```bash
docker push artifactory.guidewire.com/doctools-docker-dev/docsearch:latest
```

1. Create the deployment in Kubernetes.

```bash
kubectl apply -f deployment.yml
```

1. Create a service for the deployment.

```bash
kubectl apply -f service.yml
```

1. Deploy the ingress for the service.

```bash
kubectl apply -f ingress.yml
```

1. Set up the env:

```bash
ELASTIC_SEARCH_URL=https://docsearch-doctools.dev.ccs.guidewire.net:9200
```