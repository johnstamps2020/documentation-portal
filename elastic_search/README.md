Steps to get the service up and running

Compose and tag the image
```bash
docker-compose
```

Tag the image
```bash
docker tag docker.elastic.co/elasticsearch/elasticsearch:7.5.0 artifactory.guidewire.com/doctools-docker-dev/docsearch
```

Log into Artifactory as `doc-service`
```bash
docker login artifactory.guidewire.com
```

Push image to Artifactory
```bash
docker push artifactory.guidewire.com/doctools-docker-dev/docsearch:latest
```

Deploy the service from docker:

```bash
kubectl apply -f deployment.yml
```

Deploy the ingress for the service

```bash
kubectl apply -f ingress.yml
```

Set up the env:

```bash
ELASTIC_SEARCH_URL=https://docsearch-doctools.dev.ccs.guidewire.net:9200
```